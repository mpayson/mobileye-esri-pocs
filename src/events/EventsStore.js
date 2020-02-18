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
    if (this.renderIconsAboveStreetNames) {
      const {layers, basemap: {referenceLayers}} = this.view.map;
      const streetNamesLayer = referenceLayers.pop();
      layers.add(streetNamesLayer, 1);
    }
    this.patchLegendIcons();
  }

  patchLegendIcons() {
    const legend = this.view.ui._components.find(c => c.widget.label === 'Legend');
    if (legend) {
      const activeLayerInfo = legend.widget.activeLayerInfos.items.find(ali => ali.layer.id === 'events0');
      if (activeLayerInfo) {
        const elements = activeLayerInfo.legendElements[0];
        if (elements) {
          elements.infos = elements.infos.filter(i => i.value.endsWith('legend'));
        }
      }
    }
  }
}

decorate(EventsStore, {
  load: action.bound,
  _doAfterLayersLoaded: action.bound,
})

export default EventsStore;