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
    this.customFieldDomainMap = params && params.customFieldDomainMap ? params.customFieldDomainMap : null;
    this.optionsToRemovePostfix = params && params.optionsToRemovePostfix ? params.optionsToRemovePostfix : null;
  }
  _setFromQueryResults(results){
    results.features.forEach(f => {
      if (this.options.indexOf(f.attributes[this.field]) === -1)
        if (!this.optionsToRemovePostfix || !f.attributes[this.field].endsWith(this.optionsToRemovePostfix))
          this.options.push(f.attributes[this.field]);
    }
    );
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