import Filter from './Filter';
import { decorate, observable, action, computed } from 'mobx';
import createFilterFromConfig from '../Filters';


class NestedFilter extends Filter{
  type = 'nested';
  loaded = false;
  
  domainMap = new Map();
  mode = ''

  constructor(fieldName, params=null){
    super(fieldName, params);
    this.filters = params && params.filters ? params.filters.map(filterConfig => {
      filterConfig['subset_query'] =  fieldName+"="+filterConfig.nesting_field_value;
      return createFilterFromConfig(filterConfig);
    }) : []
  }

  _subfiltersLoaded() {
    this.loaded = true;
  }
  load(featureLayer, layers = null){
    super.load(layers.items[0]);
    if (this.customFieldDomainMap)
      this.domainMap = this.customFieldDomainMap;
    Promise.all(this.filters.map(f => f.load(featureLayer, layers)))
    .then(this._subfiltersLoaded())
  }

  get where(){
    let wheres = this.filters.filter(f => !!f.where).map(f => f.where)
    return wheres.length == 0 ? 
      wheres.join(' OR ') : null;
  }

  clear() {
    this.clearFilters();
  }

  clearFilters() {
    this.filters.forEach(f => f.clear());
  }
}

decorate(NestedFilter, {
  loaded: observable,
  load: action.bound,
  where: computed,
  clearFilters: action.bound,
  clear: action.bound
})

export default NestedFilter;