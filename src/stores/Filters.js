import SelectFilter from './objects/SelectFilter';
import MinMaxFilter from './objects/MinMaxFilter';
import MultiSelectFilter from './objects/MultiSelectFilter';
import QuantileFilter from './objects/QuantileFilter';
import DayOfWeekFilter from './objects/DayOfWeekFilter';

function createFilterFromConfig(filterConfig){
  const f = filterConfig;
  switch (f.type) {
    case 'minmax':
        return new MinMaxFilter(f.name, f.params)
    case 'multiselect':
        return new MultiSelectFilter(f.name, f.params);
    case 'select':
        return new SelectFilter(f.name, f.params);
    case 'quantile':
        return new QuantileFilter(f.name, f.params);
    case 'dayofweek':
      return new DayOfWeekFilter(f.name, f.params);
    default:
        throw new Error("Unknown filter type!")
  }
}

export default createFilterFromConfig;

export {SelectFilter, MinMaxFilter, MultiSelectFilter, QuantileFilter, DayOfWeekFilter}