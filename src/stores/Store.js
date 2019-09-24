import {decorate, observable, action, computed, autorun} from 'mobx';
import { MinMaxFilter } from './Filters';
import {loadModules} from 'esri-loader';
import config from '../config';
import renderers from '../Renderers';
import options from '../esri-loader-options';

const {appId, portalUrl} = config;
let pUtils;

const setRenderer = (lyr, field) => {
  loadModules(['esri/renderers/support/jsonUtils'], options)
  .then(([rendererJsonUtils]) => {
    lyr.renderer = rendererJsonUtils.fromJSON(renderers[field]);
  });
}

class Store {

  credential = {};

  constructor(layerId){
    this.layerId = layerId;
    this.filters = [
      new MinMaxFilter('eventvalue'),
      new MinMaxFilter('pedestrians_density'),
      new MinMaxFilter('bicycles_density'),
      new MinMaxFilter('harsh_cornering_ratio'),
      new MinMaxFilter('harsh_acc_ratio')
    ];
  }

  _loadLayers(){
    this.view.whenLayerView(this.lyr)
    .then(lV => {
      this.lyrView = lV;
      this.filters.forEach(f => f.load(this.lyr));
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
  }

  load(mapViewDiv){

    let M, MV, FL;
    
    return loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/core/promiseUtils',
      'esri/identity/OAuthInfo',
      'esri/identity/IdentityManager'
    ], options)
    .then(([Map, MapView, FeatureLayer, promiseUtils, OAuthInfo, esriId]) => {
      pUtils = promiseUtils; 
      this._buildAutoRunEffects();

      M = Map;
      MV = MapView;
      FL = FeatureLayer;

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
      this.credential = credential;
      this.user = credential.userId;
      this.lyr = new FL({
        portalItem: {id: this.layerId},
      });
      setRenderer(this.lyr, 'eventvalue');
      this.map = new M({
        basemap: 'dark-gray-vector',
        layers: [this.lyr]
      });
      this.view = new MV({
        map: this.map,
        container: mapViewDiv,
        center: [-74.00157, 40.71955],
        zoom: 12
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
  where: computed,
  load: action.bound,
  _loadLayers: action.bound,
});

export default Store;