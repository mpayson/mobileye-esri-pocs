import MultiSelectFilter from './MultiSelectFilter';
import { getMinMaxWhere } from '../../utils/Utils';
import { decorate, action, computed, observable } from 'mobx';

class QuantileFilter extends MultiSelectFilter{
  type = 'quantile';
  options = [];
  
  constructor(fieldName, params=null){
    super(fieldName, params);
    this.quantiles = params.quantiles;
    if(!this.quantiles){
      throw new Error("Please provide quantile breaks")
    }
  }

  load(featureLayer){
    // we're not doing anything because these are hardcoded for now!
    super.setFieldInfoFromLayer(featureLayer);
    this.loaded = true;
    this.options = this.quantiles.map(q => q.label);
    // this.selectValue = this.options.slice();
    this.labelMap = new Map();
    this.quantiles.forEach(q => this.labelMap.set(q.label, q));
  }

  clear(){
    this.selectValue = [];
  }

  get where(){
    // if(this.options.length === this.selectValue.length) return null;
    if(!this.selectValue || this.selectValue.length < 1) return null;

    const wheres = this.selectValue.map(label => {
      const q = this.labelMap.get(label);
      return getMinMaxWhere(this.field, q.min, q.max);
    })
    return `(${wheres.join(' OR ')})`;
  }

  get displayOptions(){
    return this.options.slice();
  }

}

decorate(QuantileFilter, {
  options: observable,
  load: action.bound,
  where: computed,
  displayOptions: computed,
  clear: action.bound
})

export default QuantileFilter;