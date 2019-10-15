import { decorate, observable, action, computed } from 'mobx';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import {getMinMaxWhere, getMultiSelectWhere, getSelectWhere} from '../utils/Utils';

const getMaxQuery = (field) => ({
  onStatisticField: field,
  outStatisticField: `MAX_${field}`,
  statisticType: 'max'
});
const getMinQuery = (field) => ({
  onStatisticField: field,
  outStatisticField: `MIN_${field}`,
  statisticType: 'min'
});

class Filter {
  constructor(fieldName, params = null){
    this.field = fieldName;
    this.fieldInfo = {};
    this.infoText = params && params.info ? params.info : null;
    console.log('infotext', params);
    // this.caption = (params !== null && "caption" in params) ? params.caption : null;

  }
  load(featureLayer){
    if(!featureLayer.loaded){
      throw new Error("Please wait until the layer is loaded");
    }
    this.fieldInfo = featureLayer.fields.find(f => f.name === this.field);
  }
  get alias(){
    // if (this.caption !== null) return this.caption;
    if(this.fieldInfo) return this.fieldInfo.alias;
    return null;
  }

  get where(){
    return null;
  }
  
  get isActive(){
    return !!this.where;
  }

}

decorate(Filter, {
  fieldInfo: observable,
  alias: computed,
  where: computed,
  isActive: computed
})

class SelectFilter extends Filter{
  type = 'select';
  loaded = false;
  options = [];
  selectValue = null;
  domainMap = new Map();

  load(featureLayer){
    super.load(featureLayer);
    const domain = featureLayer.getFieldDomain(this.field);
    if(domain){
      this.domainMap = domain.codedValues.reduce((p, cv) => {
        p.set(cv.code, cv.name);
        return p;
      }, new Map());
    }
    featureLayer.queryFeatures({
      where: "1=1",
      returnDistinctValues: true,
      outFields: [this.field]
    }).then(res => {
      this.options = res.features.map(f => 
        f.attributes[this.field]
      ).sort();
      this.loaded = true;
    });
  }

  onValueChange(v){
    if(this.selectValue === v){
      this.selectValue = null;
    } else {
      this.selectValue = v;
    }
  }

  clear(){
    this.selectValue = null;
  }

  get where(){
    return getSelectWhere(this.field, this.selectValue, this.fieldInfo.type);
  }

}

decorate(SelectFilter, {
  options: observable,
  loaded: observable,
  selectValue: observable,
  load: action.bound,
  where: computed,
  onValueChange: action.bound,
  clear: action.bound
})

class MultiSelectFilter extends SelectFilter{
  
  type = 'multiselect';
  selectValue = [];

  onValueChange(v){
    this.selectValue = v;
  }

  clear(){
    this.selectValue = [];
  }
  
  get where(){
    return getMultiSelectWhere(this.field, this.selectValue, this.fieldInfo.type);
  }

};

decorate(MultiSelectFilter, {
  onValueChange: action.bound,
  clear: action.bound,
  where: computed
})

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
    this.bins = [];
    this.loaded = false;
  }
  load(featureLayer, view){
    super.load(featureLayer);
    const field = this.field;

    const isLwr = this.lowerBound || this.lowerBound === 0;
    const isUpr = this.upperBound || this.upperBound === 0;

    let histPromise = loadModules([
      'esri/renderers/smartMapping/statistics/histogram'
    ], options);

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

    Promise.all([histPromise, lwrUprPromise])
      .then(([[getHistogram], minMaxRes]) => {
        const [rawMin, rawMax] = minMaxRes;
        this.lowerBound = Math.floor(rawMin);
        this.upperBound = Math.ceil(rawMax);
        if (this.isLogarithmic){
          if (!this.lowerBoundSupplied && this.lowerBound !== 0)
            this.lowerBound = Math.floor((Math.log(this.lowerBound) / Math.log(this.logBase)) * 100) / 100;
          if (!this.upperBoundSupplied && this.upperBound !== 0)
            this.upperBound = Math.ceil((Math.log(this.upperBound) / Math.log(this.logBase)) * 100) / 100;
        }

        return getHistogram({
          layer: featureLayer,
          field: field,
          numBins: this.numBins,
          minValue: this.lowerBound,
          maxValue: this.upperBound,
          valueExpression: this.isLogarithmic ? `IIf($feature.${this.field} != 0,Log($feature.${this.field}) / Log(${this.logBase}),0)` : `$feature.${this.field}`,
          view
        })
      })
      .then(histRes => {
        this.bins = histRes.bins;
        this.loaded = true;
      })
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

export {SelectFilter, MinMaxFilter, MultiSelectFilter}