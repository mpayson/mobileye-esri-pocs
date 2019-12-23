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
    let t = getMultiSelectWhere(this.field, this.selectValue, this.fieldInfo.type);
    if (t === null) {
      return null;
    }
    if (this.subset_query !== "1=1") {
      return "(" + t + " OR NOT ("+this.subset_query+"))";
    }
    return t;
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