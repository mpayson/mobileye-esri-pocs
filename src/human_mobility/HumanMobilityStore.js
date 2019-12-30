import Store from '../stores/Store';
import {decorate, action } from 'mobx';

class HumanMobilityStore extends Store{
  constructor(appState, storeConfig){
    super(appState, storeConfig);
    const dayOfWeekFilter = this.filters.find(f => f.field === 'day_of_week');
    dayOfWeekFilter.onValueChange('Weekdays');
  }

  // set initial layer visibility and title, or further up in store
  // TODO move to webmap
  async load(mapViewDiv){
    const view = await super.load(mapViewDiv);
    this.layers.forEach((layer, index) => {
      const config = super._getLayerConigById(index);
      if(config.title) layer.title = config.title;
      const isVisible = !this.defaultVisibleLayersList.includes(config.id)
        ? false
        : true;
      super.setLayerVisibility(layer, isVisible);
    });
    return view;
  }
}

decorate(HumanMobilityStore, {
  load: action.bound
})

export default HumanMobilityStore;