import { decorate, observable, action, computed } from 'mobx';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';

class HistogramStore {

    bins = [];
    loaded = false;
    

    constructor(fieldName, params){
      this.field = fieldName;
      this.fieldInfo = {};
      this.log = params.log || false;
      this.bins = [];
      this.loaded = false;
    }

    load(featureLayer){
      if(!featureLayer.loaded){
            throw new Error("Please wait until the layer is loaded");
      }
      this.fieldInfo = featureLayer.fields.find(f => f.name === this.field);
      const field = this.field;
  
  
      let histPromise = loadModules([
        'esri/widgets/Histogram'
      ], options);
  
  
      Promise.all([histPromise])
        .then(([[getHistogram]]) => {
          return getHistogram({
            layer: featureLayer,
            field: field,
//            normalizationField: field,
            numBins: 140,
            minValue : 0,
            maxValue : 140,
          })
        })
        .then(histRes => {
            this.bins = histRes.bins;
//            console.log("ORK 1", this.bins)
            this.loaded = true;})
    }
  
  }
  decorate(HistogramStore, {
    loaded: observable,
    fieldInfo: observable,
    load: action.bound,
    bins:observable,
  })


  export {HistogramStore}