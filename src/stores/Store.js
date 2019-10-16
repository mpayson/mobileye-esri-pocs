import {decorate, observable, action, computed, autorun} from 'mobx';
import { MinMaxFilter, MultiSelectFilter, SelectFilter } from './Filters';
import { HistogramStore } from './HistogramStore';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import { message } from 'antd';

message.config({
  // top: "calc(100vh - 70px)"
  top: "75px"
});

let pUtils;

class Store {

  credential = {};
  aliasMap = null;

  constructor(appState, storeConfig){
    this.appState = appState;
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
    this.histograms =  (typeof storeConfig.histograms === 'undefined') ? [] :
      storeConfig.histograms.map(f => {
        if(f.withFilter) {        
          return new MinMaxFilter(f.name, f.params);
        } else {
          return new HistogramStore(f.name, f.params);
        }
      });
    
    this.renderers = storeConfig.renderers;
    this.rendererOptions = [...Object.keys(this.renderers)];
    this.rendererField = storeConfig.initialRendererField;
    this.popupTemplate = storeConfig.popupTemplate;
    this.layerLoaded = false;
    this.viewConfig = storeConfig.viewConfig;
  }
  // to destroy map view, need to do `view.container = view.map = null;`
  // should probably include this in the dismount
  destroy(){
    if(this.effectHandler) this.effectHandler();
    if(this.rendererHandler) this.rendererHandler();
  }

  _loadLayers(){
    this.view.whenLayerView(this.lyr)
    .then(lV => {
      message.destroy();
      this.lyrView = lV;
      this.filters.forEach(f => f.load(this.lyr, this.view));
      this.histograms.forEach(f => f.load(this.lyr, this.view));
      this.aliasMap = this.lyr.fields.reduce((p, f) => {
        p.set(f.name, f.alias);
        return p;
      }, new Map());
      this.layerLoaded = true;
    })
    .catch(er => {
      message.destroy();
      message.error('Error loading the layers, does your account have access to the data?', 4);
      console.log(er);
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
    message.loading('Loading map!', 0);
    return loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/core/promiseUtils',
      'esri/identity/IdentityManager',
      'esri/renderers/support/jsonUtils'
    ], options)
    .then(([Map, MapView, FeatureLayer, promiseUtils, esriId, rendererJsonUtils]) => {

      esriId.registerToken(this.appState.session.toCredential());

      pUtils = promiseUtils; 
      this._buildAutoRunEffects();

      let renderer;
      if (this.renderers[this.rendererField]._type === 'jsapi')
        renderer = this.renderers[this.rendererField];
      else
        renderer = rendererJsonUtils.fromJSON(this.renderers[this.rendererField]);

      this.lyr = new FeatureLayer({
        portalItem: {id: this.layerId},
        renderer: renderer,

        popupTemplate: this.popupTemplate
      });

      this.map = new Map({
        basemap: 'dark-gray-vector',
        layers: [this.lyr]
      });
      this.view = new MapView({
        map: this.map,
        container: mapViewDiv,
        center: this.viewConfig.center,
        zoom: this.viewConfig.zoom
      });
      this._loadLayers();
      return this.view;
    })
    .catch(er => {
      message.destroy();
      message.error('Error creating the map, please refresh for now');
    });
  }

  clearFilters(){
    this.filters.forEach(f => f.clear());
  }

  get where(){
    const where = this.filters
      .filter(f => !!f.where)
      .map(f => f.where)
      .join(' AND ') +
      this.histograms
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
  clearFilters: action.bound
});

export default Store;