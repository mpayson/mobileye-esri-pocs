import SelectFilter from './SelectFilter';
import { getMultiSelectWhere } from '../../utils/Utils';
import { decorate, computed } from 'mobx';

class DayOfWeekFilter extends SelectFilter{
  type = 'dayofweek';
  dayMap = new Map([
    ['Weekend',[5,6]],
    ['Weekdays',[0,1,2,3,4]],
    ['Monday',[0]],
    ['Tuesday',[1]],
    ['Wednesday',[2]],
    ['Thursday',[3]],
    ['Friday',[4]],
    ['Saturday',[5]],
    ['Sunday',[6]]
  ]);
  
  constructor(fieldName, params=null){
    super(fieldName, params);
    this.options = [...this.dayMap.keys()];
  }
  load(featureLayer, layers=null){
    super.setFieldInfoFromLayer(featureLayer, layers);
  }
  get where(){
    const values = this.dayMap.get(this.selectValue);
    return getMultiSelectWhere(this.field, values, 'int');
  }
  get displayOptions(){
    return this.options;
  }
}

decorate(DayOfWeekFilter, {
  where: computed,
  displayOptions: computed
});

export default DayOfWeekFilter;