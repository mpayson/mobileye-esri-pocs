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

  _onMouseMove(evt) {
    const promise = (this._tooltipPromise = this.view
        .hitTest(evt)
        .then(hit => {
          if (promise !== this._tooltipPromise) {
            return; // another test was performed
          }

          const results = hit.results.filter(
            r => this.interactiveLayerIdSet.has(r.graphic.layer.id)
          );
          
          if (results.length) {
            const graphic = results[0].graphic;
            const screenPoint = hit.screenPoint;
            const eventType = graphic.attributes.eventType;
            if (eventType) {
              const uniqVal = this.renderers.eventType.uniqueValueInfos
              .find(u => u.value === eventType);
              
              if (uniqVal) {
                graphic.symbol = uniqVal.symbol;
                graphic.symbol.width *= 1.3;
                graphic.symbol.height *= 1.3;
                setImmediate(() => {
                    this.view.graphics.removeAll();
                    this.view.graphics.add(graphic);
                  });
                }
              } else {
                this.view.graphics.removeAll();
              }

              if (this.onMouseOutStatistics) {
                var new_geometry = results[0].graphic.geometry;
                new_geometry.paths[0][0][0] = new_geometry.paths[0][0][0] + 0.00001;
                new_geometry.paths[0][1][0] = new_geometry.paths[0][1][0] - 0.00001;
                this.layerViewsMap.get(results[0].graphic.layer.id).queryFeatures({
                    where: this.where,
                    geometry: results[0].graphic.geometry,
                    returnGeometry: true,
                    spatialRelationship: "contains",
                    outStatistics: this.onMouseOutStatistics
                }).then(queryFeaturesResults => {
                    const queryResults = queryFeaturesResults.features;
                    this.tooltipResults = {
                        screenPoint,
                        graphic,
                        queryResults
                    }
                });
              } else {
                this.tooltipResults = {screenPoint, graphic}
              }

          } else {
            this.view.graphics.removeAll();
            this.tooltipResults = null;
          }
        })
    );
  }
}

decorate(EventsStore, {
  load: action.bound,
  _onMouseMove: action.bound,
  _doAfterLayersLoaded: action.bound,
})

export default EventsStore;