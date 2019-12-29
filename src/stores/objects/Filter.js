import { decorate, observable, computed, action } from 'mobx';

// A base filter object class. Filter objects define the logic
// to build filter where clauses from UI interactions

class Filter {
  fieldInfo = {};

  constructor(fieldName, params = null){
    this.field = fieldName;
    this.manualInfoText = params && params.info ? params.info : null;
    this.isDynamic = params && params.dynamic ? params.dynamic : false;
  }

  setFieldInfoFromLayer(featureLayer){
    this.fieldInfo = featureLayer.fields.find(f => f.name === this.field);
  }

  load(featureLayer){
    if(!featureLayer.loaded){
      throw new Error("Please wait until the layer is loaded");
    }
    this.setFieldInfoFromLayer(featureLayer);
  }

  // defaults to returning the alias, or end-user name, for field
  // otherwise just returns field name
  get alias(){
    return this.fieldInfo && this.fieldInfo.alias
      ? this.fieldInfo.alias
      : this.field;
  }

  // defaults to metadata in the feature layer field description
  // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-support-Field.html#description
  get infoText(){
    return this.fieldInfo && this.fieldInfo.description
      ? this.fieldInfo.description
      : this.manualInfoText;
  }

  get where(){
    return null;
  }
  
  get isActive(){
    return !!this.where;
  }

}

decorate(Filter, {
  fieldInfo: observable.ref,
  alias: computed,
  infoText: computed,
  where: computed,
  isActive: computed,
  load: action.bound,
  setFieldInfoFromLayer: action.bound
})

export default Filter;