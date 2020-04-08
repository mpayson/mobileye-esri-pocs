import Store from '../stores/Store';
import {action, decorate, observable} from "mobx";
import {loadBasemap} from '../services/MapService';
import { getDomainMap } from '../utils/Utils';

const CAT_CODE_TO_QUERY_FIELD = [
  'traffic_sign_category_l3',
  'tfl_category_l3',
  'road_marking_category_l3',
  'pole_category_l3',
  'manhole_category_l3',
];

class SurveyStore extends Store {

  basemaps = new Map();

  constructor(appState, storeConfig) {
    super(appState, storeConfig);
    this.basemapConfig = storeConfig.basemaps;
  }

  async load(mapViewDiv) {
    await super.load(mapViewDiv);
    this._applyBasemap(this.viewConfig.zoom);
    return this.view;
  }

  _onZoomChange(zoom) {
    super._onZoomChange(zoom);

    if (this._zoomUpdate) {
        clearTimeout(this._zoomUpdate);
    }
    this._zoomUpdate = setTimeout(() => this._applyBasemap(zoom));
  }

  _applyBasemap(zoom) {
    if (!this.basemapConfig) return;
    const basemap = Object.entries(this.basemapConfig)
      .find(([id, params]) => params.minZoom <= zoom && zoom < params.maxZoom);
    const current = this.view.map.basemap;

    if (basemap && current) {
      const [id, params] = basemap;
      const {portalItem} = current;
      if ((current.id !== id) && (portalItem ? portalItem.id !== params.id : true)) {
        const stored = this.basemaps.get(id);
        if (stored) {
          this.view.map.basemap = stored;
        } else {
          loadBasemap(this.view, id, params);
          this.basemaps.set(id, this.view.map.basemap);
        }
      }
    }
  }

  _onClick = (evt) => {
    super._onClick(evt);
    this._clickPromise = this._clickPromise.then(() => {
      const results = this.clickResults;

      if (results && results.graphic) {
        const graphic = results.graphic;
        const attrs = graphic.attributes;
        const field = graphic.layer.renderer.field;
        const value = attrs[field];
        const queryField = CAT_CODE_TO_QUERY_FIELD[value];
  
        this.lyr.queryFeatures({
          where: `ObjectId = ${attrs.ObjectId}`,
          outFields: [queryField],
        })
        .then(result => {
          if (result && result.features && result.features[0]) {
            const feature = result.features[0];
            const code = feature.attributes[queryField];
    
            const field = result.fields.find(f => f.name === queryField);
            const domainMap = getDomainMap(field.domain);
    
            if (domainMap.has(code)) {
              results['subcat'] = domainMap.get(code);
            }
          }
        });
      }
    });
  }
}

decorate(SurveyStore, {
  basemaps: observable.shallow,
  clickResults: observable.shallow,
  load: action.bound,
  _onZoomChange: action.bound,
  _applyBasemap: action.bound,
  _onClick: action.bound,
})

export default SurveyStore;
