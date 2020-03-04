import Store from '../stores/Store';
import {action, decorate, observable} from "mobx";
import {loadBasemap} from '../services/MapService';

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
}

decorate(SurveyStore, {
  basemaps: observable.shallow,
  load: action.bound,
  _onZoomChange: action.bound,
  _applyBasemap: action.bound,
})

export default SurveyStore;
