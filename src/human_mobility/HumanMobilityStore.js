import Store from '../stores/Store';

class HumanMobilityStore extends Store{
  constructor(appState, storeConfig){
    super(appState, storeConfig);
    const dayOfWeekFilter = this.filters.find(f => f.field === 'day_of_week');
    dayOfWeekFilter.onValueChange('Weekdays');
  }

}

export default HumanMobilityStore;