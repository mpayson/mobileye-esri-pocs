import Store from '../stores/Store';
import {decorate, action } from 'mobx';

class HumanMobilityStore extends Store{
  constructor(appState, storeConfig){
    super(appState, storeConfig);
    const dayOfWeekFilter = this.filters.find(f => f.field === 'day_of_week');
    // initial store configuration
    dayOfWeekFilter.onValueChange('Weekdays');
  }

  // set initial layer visibility
  // TODO move to webmap
  async load(mapViewDiv){
    const view = await super.load(mapViewDiv);
    this.layers.forEach((layer, index) => {
      const layerConfig = super._getLayerConfigByInitialIndex(index);
      if (!["average_speed","bicycles_lanes"].includes(layerConfig.name)){
        super.setLayerVisibility(layer, false);
      }
    });
    return view;
  }
}

decorate(HumanMobilityStore, {
  load: action.bound
})

export default HumanMobilityStore;