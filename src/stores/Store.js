import {decorate, observable, action, computed, autorun} from 'mobx';
import { MinMaxFilter, MultiSelectFilter, SelectFilter } from './Filters';
import { HistogramStore } from './HistogramStore';
import {loadModules} from 'esri-loader';
import config from '../config/config';
import options from '../config/esri-loader-options';

const {appId, portalUrl} = config;
let pUtils;

class Store {

  credential = {};
  aliasMap = null;

  constructor(storeConfig){
    this.layerId = storeConfig.layerItemId;
    this.filters = storeConfig.filters.map(f => {
      switch(f.type){
        case 'minmax':
          return new MinMaxFilter(f.name, f.params)
        case 'multiselect':
          return new MultiSelectFilter(f.name, f.params);
        case 'select':
          return new SelectFilter(f.name, f.params);
        default:
          throw new Error("Unknown filter type!")
      }
    });
    if (typeof storeConfig.histograms === 'undefined') {
      this.histograms = []
    } else {
      this.histograms = storeConfig.histograms.map(f => new HistogramStore(f.name, f.params));
    }
    this.renderers = storeConfig.renderers;
    this.rendererOptions = [...Object.keys(this.renderers)];
    this.rendererField = storeConfig.initialRendererField;
    this.popupTemplate = storeConfig.popupTemplate;
    this.layerLoaded = false;
    this.viewConfig = storeConfig.viewConfig;
  }

  _loadLayers(){
    this.view.whenLayerView(this.lyr)
    .then(lV => {
      this.lyrView = lV;
      this.filters.forEach(f => f.load(this.lyr, this.view));
      this.histograms.forEach(f => f.load(this.lyr));
      this.aliasMap = this.lyr.fields.reduce((p, f) => {
        p.set(f.name, f.alias);
        return p;
      }, new Map());
      this.layerLoaded = true;
    });
  }

  _buildAutoRunEffects(){
    const onApplyFilter = pUtils.debounce(function(layerView, where){
      layerView.filter = {where};
    });
    this.effectHandler = autorun(_ => {
      const where = this.where;
      if(this.lyrView && onApplyFilter){
        onApplyFilter(this.lyrView, where);
      }
    });
    this.rendererHandler = autorun(_ => {
      const rendererField = this.rendererField;
      if(!this.lyr) return;
      const renderer = this.renderers[rendererField];
      if(renderer._type === 'jsapi') {
        this.lyr.renderer = renderer;
        return;
      } 
      loadModules(['esri/renderers/support/jsonUtils'], options)
        .then(([rendererJsonUtils]) => {
          this.lyr.renderer = rendererJsonUtils.fromJSON(this.renderers[rendererField]);
        });
    })
  }

  setRendererField(field){
    this.rendererField = field;
  }

  load(mapViewDiv){

    let M, MV, FL, rjsonUtils;
    
    return loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/core/promiseUtils',
      'esri/identity/OAuthInfo',
      'esri/identity/IdentityManager',
      'esri/renderers/support/jsonUtils'
    ], options)
    .then(([Map, MapView, FeatureLayer, promiseUtils, OAuthInfo, esriId, rendererJsonUtils]) => {
      // .then(([Map, MapView, FeatureLayer, promiseUtils, rendererJsonUtils]) => {
      pUtils = promiseUtils; 
      this._buildAutoRunEffects();

      M = Map;
      MV = MapView;
      FL = FeatureLayer;
      rjsonUtils = rendererJsonUtils;

      const info = new OAuthInfo({
        appId
      });
      esriId.registerOAuthInfos([info]);

      return esriId.checkSignInStatus(portalUrl)
        .catch(er => {
          if(er.name === "identity-manager:not-authenticated"){
            return esriId.getCredential(portalUrl);
          }
        });
    })
    .then(credential => {
      let renderer;
      console.log(this.renderers, this.rendererField)
      if (this.renderers[this.rendererField]._type === 'jsapi')
        renderer = this.renderers[this.rendererField];
      else
        renderer = rjsonUtils.fromJSON(this.renderers[this.rendererField]);
      this.credential = credential;
      this.user = credential.userId;
      this.lyr = new FL({
        portalItem: {id: this.layerId},
        renderer: renderer,

        popupTemplate: this.popupTemplate
      });
      this.map = new M({
        basemap: 'dark-gray-vector',
        layers: [this.lyr]
      });
      this.view = new MV({
        map: this.map,
        container: mapViewDiv,
        center: this.viewConfig.center,//[-74.00157, 40.71955],
        zoom: this.viewConfig.zoom//12
      });
      this._loadLayers();
      return this.view;
    });
  }

  get where(){
    const where = this.filters
      .filter(f => !!f.where)
      .map(f => f.where)
      .join(' AND ');
    return where ? where : "1=1";
  }
}

decorate(Store, {
  user: observable,
  rendererField: observable,
  layerLoaded: observable,
  aliasMap: observable,
  where: computed,
  load: action.bound,
  setRendererField: action.bound,
  _loadLayers: action.bound,
});

export default Store;