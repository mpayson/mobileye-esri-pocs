import Filter from './Filter';
import { decorate, observable, action, computed } from 'mobx';
import { getSelectWhere, getDomainMap } from '../../utils/Utils';

class SelectFilter extends Filter{
  type = 'select';
  loaded = false;
  options = [];
  selectValue = null;
  domainMap = new Map();

  constructor(fieldName, params=null){
    super(fieldName, params);
    this.style = params && params.style ? params.style : 'dropdown';
  }
  _setFromQueryResults(results){
    this.options = results.features.map(f => 
      f.attributes[this.field]
    ).sort();
    this.loaded = true;
  }

  load(featureLayer){
    super.load(featureLayer);
    const domain = featureLayer.getFieldDomain(this.field);
    if(domain){
      this.domainMap = getDomainMap(domain);
    }
    featureLayer.queryFeatures({
      where: "1=1",
      returnDistinctValues: true,
      outFields: [this.field]
    }).then(this._setFromQueryResults);
  }

  // execute client-side query based on what's currently available
  refresh(featureLayer, featureLayerView, where="1=1"){
    super.load(featureLayer);
    const domain = featureLayer.getFieldDomain(this.field);
    if(domain){
      this.domainMap = getDomainMap(domain);
    }
    featureLayerView.queryFeatures({
      where,
      returnDistinctValues: true,
      outFields: [this.field]
    }).then(this._setFromQueryResults);
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

  get optionSet(){
    return new Set(this.options);
  }

  get displayOptions(){
    return this.options.slice().sort();
  }

}

decorate(SelectFilter, {
  options: observable,
  loaded: observable,
  selectValue: observable,
  load: action.bound,
  where: computed,
  onValueChange: action.bound,
  clear: action.bound,
  _setFromQueryResults: action.bound,
  optionSet: computed,
  displayOptions: computed
})

export default SelectFilter;