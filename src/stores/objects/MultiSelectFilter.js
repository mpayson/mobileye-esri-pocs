import SelectFilter from './SelectFilter';
import { decorate, action, computed } from 'mobx';
import {getMultiSelectWhere} from '../../utils/Utils';

class MultiSelectFilter extends SelectFilter{
  
  type = 'multiselect';
  selectValue = [];

  // Used for directly setting the selected value array
  onValueChange(v){
    this.selectValue = v;
    console.log(v);
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
    return getMultiSelectWhere(this.field, this.selectValue, this.fieldInfo.type);
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