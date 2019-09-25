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
  constructor(fieldName){
    this.field = fieldName;
    this.fieldInfo = {};
  }
  load(featureLayer){

    if(!featureLayer.loaded){
      throw new Error("Please wait until the layer is loaded");
    }
    this.fieldInfo = featureLayer.fields.find(f => f.name === this.field);
  }
}

class SelectFilter extends Filter{
  type = 'select';
  loaded = false;
  options = [];
  selectValue = null;
  domainMap = new Map();

  constructor(fieldName, params){
    super(fieldName);
  }

  load(featureLayer){
    super.load(featureLayer);
    // const domain = featureLayer.getFieldDomain(this.field);
    // if(domain){
    //   this.domainMap = domain.codedValues.reduce((p, cv) => {
    //     p.set(cv.code, cv.name);
    //     console.log(p);
    //     return p;
    //   }, new Map());
    //   console.log(domain);
    // }
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
    console.log("CALLED")
    if(this.selectValue === v){
      this.selectValue = null;
    } else {
      this.selectValue = v;
    }
  }

  get where(){
    return getSelectWhere(this.field, this.selectValue);
  }

}

decorate(SelectFilter, {
  options: observable,
  loaded: observable,
  selectValue: observable,
  load: action.bound,
  where: computed,
  onValueChange: action.bound
})

class MultiSelectFilter extends SelectFilter{
  
  type = 'multiselect';
  selectValue = [];

  onValueChange(v){
    this.selectValue = v;
  }
  
  get where(){
    return getMultiSelectWhere(this.field, this.selectValue);
  }

};

decorate(MultiSelectFilter, {
  onValueChange: action.bound,
  where: computed
})

class MinMaxFilter extends Filter{

  type = 'minmax';
  bins = [];
  loaded = false;
  min = null;
  max = null;

  constructor(fieldName, params){
    super(fieldName);
    this.lowerBound = params.lowerBound || null;
    this.upperBound = params.upperBound || null;
    this.log = params.log || false;
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
        return getHistogram({
          layer: featureLayer,
          field: field,
          numBins: 50,
          minValue: this.lowerBound,
          maxValue: this.upperBound
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

  get where(){
    if(this.min === this.lowerBound && this.max === this.upperBound){
      return null;
    }
    return getMinMaxWhere(this.field, this.min, this.max);
  }
}
decorate(MinMaxFilter, {
  min: observable,
  max: observable,
  loaded: observable,
  fieldInfo: observable,
  where: computed,
  load: action.bound,
  onValuesChange: action.bound
})

export {SelectFilter, MinMaxFilter, MultiSelectFilter}