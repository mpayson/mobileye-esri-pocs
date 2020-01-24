import SelectFilter from './SelectFilter';
import { decorate, action, computed } from 'mobx';
import {getMultiSelectWhere} from '../../utils/Utils';

class MultiSelectFilter extends SelectFilter{
  
  type = 'multiselect';
  selectValue = [];

  // Used for directly setting the selected value array
  onValueChange(v){
    this.selectValue = v;
  }

  // Used for setting whether an individual option is selected
  onValueOptionChange(option){
    if(!option) return;
    if(this.selectedOptionSet.has(option)){
      this.selectValue = this.selectValue.slice().filter(s => s !== option);
    } else {
      this.selectValue.push(option);
    }
  }

  clear(){
    this.selectValue = [];
  }
  
  get where(){
    if (this.selectValue.indexOf("-100") !== -1) return this.subset_query;
    let values = this.selectValue;
    if (this.optionsToMerge) {
      const reversed = new Map(); // meta -> real
      for (let [k, v] of this.optionsToMerge.entries()) {
          if (!reversed.has(v)) {
            reversed.set(v, [])
          }
          reversed.get(v).push(k);
      }
      let updValues = []
      for (let v of values) {
        const addKeys = reversed.get(v);
        if (addKeys) {
          updValues = updValues.concat(addKeys);
        } else {
          updValues.push(v);
        }
      }
      values = updValues;
    }
    return getMultiSelectWhere(this.field, values, this.fieldInfo.type);
  }

  get selectedOptionSet(){
    return new Set(this.selectValue);
  }

};

decorate(MultiSelectFilter, {
  onValueChange: action.bound,
  clear: action.bound,
  where: computed,
  selectedOptionSet: computed
})

export default MultiSelectFilter;