import { decorate, observable, computed } from 'mobx';

class Filter {
  constructor(fieldName, params = null){
    this.field = fieldName;
    this.fieldInfo = {};
    this.infoText = params && params.info ? params.info : null;
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

export default Filter;