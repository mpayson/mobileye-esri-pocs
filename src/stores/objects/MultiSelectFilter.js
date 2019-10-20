import SelectFilter from './SelectFilter';
import { decorate, action, computed } from 'mobx';
import {getMultiSelectWhere} from '../../utils/Utils';

class MultiSelectFilter extends SelectFilter{
  
  type = 'multiselect';
  selectValue = [];

  onValueChange(v){
    this.selectValue = v;
  }

  clear(){
    this.selectValue = [];
  }
  
  get where(){
    return getMultiSelectWhere(this.field, this.selectValue, this.fieldInfo.type);
  }

  get selectedOptionSet(){
    return new Set(this.selectValue.map(v => 
      this.options[v]
    ));
  }

};

decorate(MultiSelectFilter, {
  onValueChange: action.bound,
  clear: action.bound,
  where: computed,
  selectedOptionSet: computed
})

export default MultiSelectFilter;