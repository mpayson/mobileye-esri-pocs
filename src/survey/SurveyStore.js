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
    console.log(zoom);
    this._scheduleVisualUpdate(() => this.applyBasemap(zoom), '_zoomUpdate');
  }

  applyBasemap(zoom) {
    if (!this.basemapConfig) return;
    const basemap = Object.entries(this.basemapConfig)
      .find(([id, params]) => params.minZoom <= zoom && zoom < params.maxZoom);
    const current = this.view.map.basemap;

    if (basemap && current) {
      const [id, params] = basemap;
      const {portalItem} = current;
      if ((current.id !== id) && (portalItem ? portalItem.id !== params.id : true)) {
        loadBasemap(this.view, id, params);
      }
    }
  }
}

decorate(SurveyStore, {
  load: action.bound,
  _onZoomChange: action.bound,
})

export default SurveyStore;
