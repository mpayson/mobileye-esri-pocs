import Store from '../stores/Store';
import { action, decorate } from 'mobx';

class EventsStore extends Store {

  constructor(appState, storeConfig){
    super(appState, storeConfig);
    this.renderIconsAboveStreetNames = storeConfig.renderIconsAboveStreetNames;
  }

  async load(mapViewDiv){
    await super.load(mapViewDiv);
    this._fixLayerOrder(this.view);
    return this.view;
  }

  _fixLayerOrder(mapView) {
    const layers = mapView.map.layers;
    const iSpeed = layers.items.findIndex(lyr => lyr.id === 'speed');
    if (iSpeed > 0) {
      const speedLayer = layers.getItemAt(iSpeed);
      layers.reorder(speedLayer, 0);
    }
  }

  _doAfterLayersLoaded = () => {
    if (!this.renderIconsAboveStreetNames) return;
    const {layers, basemap: {referenceLayers}} = this.view.map;
    const streetNamesLayer = referenceLayers.pop();
    layers.add(streetNamesLayer, 1);
  }
}

decorate(EventsStore, {
  load: action.bound,
  _doAfterLayersLoaded: action.bound,
})

export default EventsStore;