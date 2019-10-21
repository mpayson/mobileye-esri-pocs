import Filter from './Filter';
import { decorate, observable, action, computed } from 'mobx';
import {loadModules} from 'esri-loader';
import options from '../../config/esri-loader-options';
import {getMinQuery, getMaxQuery, getMinMaxWhere } from '../../utils/Utils';

class MinMaxFilter extends Filter{

  type = 'minmax';
  bins = [];
  loaded = false;
  min = null;
  max = null;

  constructor(fieldName, params){
    super(fieldName, params);
    this.lowerBound = params.lowerBound || null;
    this.upperBound = params.upperBound || null;
    this.upperBoundSupplied = this.upperBound !== null;
    this.lowerBoundSupplied = this.lowerBound !== null;
    this.logBase = 10;
    this.isLogarithmic = params.isLogarithmic || false;
    this.numBins = (typeof params.numBins === 'undefined') ? 50 : params.numBins;
    this.hasHistograms = params.hasHistograms || false;
    this.upperBoundLabel = params.upperBoundLabel || null;
    this.lowerBoundLabel = params.lowerBoundLabel || null;
  }

  _setBoundsFromQueryResult([rawMin, rawMax]){
    this.lowerBound = Math.floor(rawMin);
    this.upperBound = Math.ceil(rawMax);
    if (this.isLogarithmic){
      if (!this.lowerBoundSupplied && this.lowerBound !== 0)
        this.lowerBound = Math.floor((Math.log(this.lowerBound) / Math.log(this.logBase)) * 100) / 100;
      if (!this.upperBoundSupplied && this.upperBound !== 0)
        this.upperBound = Math.ceil((Math.log(this.upperBound) / Math.log(this.logBase)) * 100) / 100;
    }
    return [this.lowerBound, this.upperBound];
  }

  _setHistogramBins(featureLayer, view){
    return loadModules([
      'esri/renderers/smartMapping/statistics/histogram'
    ], options)
    .then(([getHistogram]) => 
      getHistogram({
        layer: featureLayer,
        field: this.field,
        numBins: this.numBins,
        minValue: this.lowerBound,
        maxValue: this.upperBound,
        valueExpression: this.isLogarithmic ? `IIf($feature.${this.field} != 0,Log($feature.${this.field}) / Log(${this.logBase}),0)` : `$feature.${this.field}`,
        view
      })
    ).then(histRes => {
      this.bins = histRes.bins;
    })
  };

  load(featureLayer, view){
    super.load(featureLayer);
    const field = this.field;

    const isLwr = this.lowerBound || this.lowerBound === 0;
    const isUpr = this.upperBound || this.upperBound === 0;

    let lwrUprPromise;
    if(isLwr && isUpr){
      lwrUprPromise = Promise.resolve([this.lowerBound, this.upperBound]);
    } else {
      let queries = [];
      if(!isLwr) queries.push(getMinQuery(field));
      if(!isUpr) queries.push(getMaxQuery(field));
      lwrUprPromise = featureLayer.queryFeatures({
        where: "1=1",
        outStatistics: queries
      }).then(qRes => {
        const attrs = qRes.features[0].attributes;
        return [
          isLwr ? this.lowerBound : attrs[`MIN_${field}`],
          isUpr ? this.upperBound : attrs[`MAX_${field}`]
        ]
      })
    }

    lwrUprPromise.then(minMaxRes => {
      this._setBoundsFromQueryResult(minMaxRes);
      if(this.hasHistograms) {
        return this._setHistogramBins(featureLayer, view)
      }
      return Promise.resolve();
    })
    .then(_ => this.loaded = true);

  }

  onValuesChange(min, max){
    this.min = min;
    this.max = max;
  }

  clear(){
    this.min = this.lowerBound;
    this.max = this.upperBound;
  }

  get where(){
    let where;
    if(this.min <= this.lowerBound && this.max >= this.upperBound){
      where = null;
    } else {
      let maxWhere = (!this.upperBoundSupplied && this.isLogarithmic) ? Math.pow(this.logBase, this.max) : this.max;
      let minWhere = (!this.lowerBoundSupplied && this.isLogarithmic) ? Math.pow(this.logBase, this.min) : this.min;
      where = getMinMaxWhere(this.field, minWhere, maxWhere);
    }
    return where;
  }
}
decorate(MinMaxFilter, {
  min: observable,
  max: observable,
  loaded: observable,
  fieldInfo: observable,
  where: computed,
  load: action.bound,
  onValuesChange: action.bound,
  clear: action.bound
})

export default MinMaxFilter;