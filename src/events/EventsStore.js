import Store from '../stores/Store';
import { action, decorate, observable } from 'mobx';

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
      this._patchLegendIcons();
    }
  }

  _patchLegendIcons() {
    const legend = this.view.ui._components.find(c => c.widget.label === 'Legend');
    if (!legend) return;
    const activeLayersInfos = legend.widget.activeLayerInfos.items;
    const eventLayerInfo = activeLayersInfos.find(ali => ali.layer.id === 'events0');
    if (!eventLayerInfo) return;
    const elements = eventLayerInfo.legendElements[0];
    if (!elements) return;
    const renderer = Object.values(this.renderers).find(r => r.type === 'unique-value'); // eventType

    const batch = renderer.uniqueValueInfos.map((uniqVal, i) => {
      if (uniqVal.legendSymbol) {
        const container = elements.infos[i].preview;
        const svg = container.querySelector('svg');
        const svgImage = svg ? svg.querySelector('image') : null;
        return svgImage ? {svg, svgImage, ...uniqVal.legendSymbol} : null;
      }
      return null;
    }).filter(Boolean);

    requestAnimationFrame(() => {
      batch.forEach(upd => {
        const {svg, svgImage, url, width, height} = upd;
        if (url) svgImage.href.baseVal = url;
        if (width) {
          svg.width.baseVal.value = width;
          svgImage.width.baseVal.value = width;
        };
        if (height) {
          svg.height.baseVal.value = height;
          svgImage.height.baseVal.value = height;
        };
      });
    });
  }

}

decorate(EventsStore, {
  _graphicUpdate: observable,
  load: action.bound,
  _doAfterLayersLoaded: action.bound,
})

export default EventsStore;