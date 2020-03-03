import Store from '../stores/Store';
import {action, decorate} from "mobx";
import {loadBasemap} from '../services/MapService';

class SurveyStore extends Store {

  constructor(appState, storeConfig) {
    super(appState, storeConfig);
    this.basemapConfig = storeConfig.basemaps;
  }

  async load(mapViewDiv) {
    await super.load(mapViewDiv);
    this.applyBasemap(this.viewConfig.zoom);
    return this.view;
  }

  _onZoomChange(zoom) {
    super._onZoomChange(zoom);
    this.applyBasemap(zoom);
  }

  applyBasemap(zoom) {
    if (!this.basemapConfig) return;
    const basemap = Object.entries(this.basemapConfig)
      .filter(([id, params]) => params.minZoom <= zoom && zoom < params.maxZoom);

    if (basemap && basemap[0]) {
      const [id, params] = basemap[0];
      if (this.view.map.basemap.id !== id) {
        loadBasemap(this.view, id, params.streetNames);
      }
    }
  }
}

decorate(SurveyStore, {
  load: action.bound,
  _onZoomChange: action.bound,
})

export default SurveyStore;
