import Filter from './Filter';
import { decorate, observable, action, computed } from 'mobx';
import { getSelectWhere, getDomainMap, getMultiSelectWhere, reverse } from '../../utils/Utils';

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
    this.customFieldDomainMap = params && params.customFieldDomainMap ? params.customFieldDomainMap : null;
    this.optionsToRemovePostfix = params && params.optionsToRemovePostfix ? params.optionsToRemovePostfix : null;
    this.optionsToMerge = (params && params.optionsToMerge) || null;
    this.mergedOptions = this.optionsToMerge ? reverse(this.optionsToMerge) : null;
    this.setSelectedValuesFromDomain = (params && params.setSelectedValuesFromDomain) || null;
  }
  
  _setFromQueryResults(results){
    results.features.forEach(f => {
      const key = f.attributes[this.field];
      if (this.optionsToMerge && this.optionsToMerge.has(key)) {
        const metaKey = this.optionsToMerge.get(key);
        if (metaKey) {
          if (this.options.indexOf(metaKey) === -1) {
            this.options.push(metaKey);
          }
        }
      } else if (this.options.indexOf(key) === -1)
        if (!this.optionsToRemovePostfix || !key.toLowerCase().endsWith(this.optionsToRemovePostfix))
          this.options.push(key);
      }
    );
    if (this.subset_query !== "1=1" && this.options.length === 0) {
      this.options.push(-100); // marking the "all" option
    }
    
    
    //this.options = this.options.slice().sort()
    this.loaded = true;
  }

  loadLayer(layer){
    const domain = layer.getFieldDomain(this.field);
    if(domain){
      getDomainMap(domain).forEach((value, key)=> this.domainMap.set(key,value));
    }
    layer.queryFeatures({
        where: this.subset_query,
        returnDistinctValues: true,
        outFields: [this.field]
      }).then(this._setFromQueryResults);
  }

  load(featureLayer, layers = null){
    //console.log("Load called ", this.field)
    super.load(layers[0]);

    layers.forEach(layer => {
      this.loadLayer(layer)
    })

    if (this.customFieldDomainMap)
      this.domainMap = this.customFieldDomainMap;
    if (this.setSelectedValuesFromDomain)
      this.selectValue = [...this.domainMap.keys()]
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
    if (this.selectValue === "-100") return this.subset_query;
    if (this.mergedOptions) {
      const values = this.mergedOptions.get(this.selectValue);
      if (values) {
        return getMultiSelectWhere(this.field, values, this.fieldInfo.type);
      }
    }
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