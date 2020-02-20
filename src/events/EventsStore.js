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

  static _findValueInfo(renderer, value) {
    let valueInfo;

    switch (renderer.type) {
      case 'unique-value':
        valueInfo = renderer.uniqueValueInfos.find(u => u.value === value);
        break;

      case 'class-breaks':
        valueInfo = renderer.classBreakInfos
          .find(b => b.minValue <= value && value < b.maxValue)
        break;

      default:
    }

    return valueInfo;
  }

  _scheduleGraphicsUpdate(graphic) {
    if (this._graphicUpdate) {
      cancelAnimationFrame(this._graphicUpdate);
    }
    this._graphicUpdate = requestAnimationFrame(() => {
      this.view.graphics.removeAll();
      this.view.graphics.add(graphic);
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
          const attributeNames = new Set(Object.keys(graphic.attributes));
          const renderer = Object.values(this.renderers).find(r => attributeNames.has(r.field));
          const value = graphic.attributes[renderer.field];
          const valueInfo = EventsStore._findValueInfo(renderer, value);

          if (valueInfo) {
            const {onHoverScale, ...symbol} = valueInfo.symbol;
            if (onHoverScale) {
              graphic.symbol = symbol;
              graphic.symbol.width *= onHoverScale;
              graphic.symbol.height *= onHoverScale;
              this._scheduleGraphicsUpdate(graphic);
            }
          } else {
            this.view.graphics.removeAll();
          }

          if (this.onMouseOutStatistics) {
            const {geometry} = graphic;
            geometry.paths[0][0][0] = geometry.paths[0][0][0] + 0.00001;
            geometry.paths[0][1][0] = geometry.paths[0][1][0] - 0.00001;
            this.layerViewsMap.get(graphic.layer.id).queryFeatures({
              where: this.where,
              geometry,
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