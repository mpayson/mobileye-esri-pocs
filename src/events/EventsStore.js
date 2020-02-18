import Store from '../stores/Store';
import { action, decorate } from 'mobx';

class EventsStore extends Store {

  constructor(appState, storeConfig){
    super(appState, storeConfig);
    this.customLegendIcons = storeConfig.customLegendIcons;
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
    if (this.customLegendIcons) {
      this.patchLegendIcons();
    }
  }

  patchLegendIcons() {
    const legend = this.view.ui._components.find(c => c.widget.label === 'Legend');
    if (!legend) return;
    const activeLayerInfo = legend.widget.activeLayerInfos.items.find(ali => ali.layer.id === 'events0');
    if (!activeLayerInfo) return;
    const elements = activeLayerInfo.legendElements[0];
    if (!elements) return;

    this.renderers.eventType.uniqueValueInfos.forEach((uniqVal, i) => {
      if (uniqVal.legendSymbol) {
        const svg = elements.infos[i].preview.querySelector('svg');
        if (svg) {
          const svgImage = svg.querySelector('image');
          if (svgImage) {
            const {url, width, height} = uniqVal.legendSymbol;
            if (url) svgImage.href.baseVal = url;
            if (width) {
              svg.width.baseVal.value = width;
              svgImage.width.baseVal.value = width;
            };
            if (height) {
              svg.height.baseVal.value = height;
              svgImage.height.baseVal.value = height;
            };
          }
        }
      }
    });

  }
}

decorate(EventsStore, {
  load: action.bound,
  _doAfterLayersLoaded: action.bound,
})

export default EventsStore;