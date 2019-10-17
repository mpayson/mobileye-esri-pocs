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

};

decorate(MultiSelectFilter, {
  onValueChange: action.bound,
  clear: action.bound,
  where: computed
})

export default MultiSelectFilter;