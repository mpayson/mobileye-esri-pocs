import Filter from './Filter';
import { decorate, observable, action, computed } from 'mobx';
import { getSelectWhere, getDomainMap } from '../../utils/Utils';

class SelectFilter extends Filter{
  type = 'select';
  loaded = false;
  options = [];
  selectValue = null;
  domainMap = new Map();
  mode = ''

  constructor(fieldName, params=null){
    super(fieldName, params);
    this.style = params && params.style ? params.style : 'dropdown';
    this.subset_query =  params && params.subset_query ? params.subset_query : '1=1';
    this.mode = params && params.mode ? params.mode : '';
  }
  _setFromQueryResults(results){
    results.features.forEach(f => { 
      if (this.options.indexOf(f.attributes[this.field]) === -1)
        this.options.push(f.attributes[this.field]);
    }
    );
    //this.options = this.options.slice().sort()
  this.loaded = true;
  }

  load(featureLayer, map = null){
    super.load(featureLayer);
    const layers = map ? map.layers : [featureLayer];
    layers.forEach(layer => {
      layer.queryFeatures({
        where: this.subset_query,
        returnDistinctValues: true,
        outFields: [this.field]
      }).then(this._setFromQueryResults);  
    })
    const domain = featureLayer.getFieldDomain(this.field);
    if(domain){
      this.domainMap = getDomainMap(domain);
    }
  }

  // execute client-side query based on what's currently available
  refresh(featureLayer, featureLayerView, where=this.subset_query){
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
    return getSelectWhere(this.field, this.selectValue, this.fieldInfo.type)
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