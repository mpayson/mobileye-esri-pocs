import {decorate, observable, action, computed, autorun} from 'mobx';
import {
  MinMaxFilter,
  MultiSelectFilter,
  SelectFilter,
  QuantileFilter
} from './Filters';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import { message } from 'antd';

let pUtils;
// can we keep this at the top? I find it intrusive in the middle?
message.config({
  top: 75,
});

class Store {

  credential = {};
  aliasMap = null;
  chartResultMap = new Map();
  map = null;
  layerVisibleMap = new Map();
  tooltipResults = null;
  bookmarkInfo = null;
  autoplay = false;
  bookmarkIndex = -1;
  layerViewsMap = null;
  mapLayers = null;

  constructor(appState, storeConfig){
    this.appState = appState;
    //this.layerId = storeConfig.layerItemId;
    this.mapId = storeConfig.webmapId;
    console.log(storeConfig.webmapId)
    this.filters = storeConfig.filters.map(f => {
      switch(f.type){
        case 'minmax':
          return new MinMaxFilter(f.name, f.params)
        case 'multiselect':
          return new MultiSelectFilter(f.name, f.params);
        case 'select':
          return new SelectFilter(f.name, f.params);
        case 'quantile':
          return new QuantileFilter(f.name, f.params);
        default:
          throw new Error("Unknown filter type!")
      }
    });
    this.charts = storeConfig.charts || [];
    
    this.renderers = storeConfig.renderers;
    this.rendererOptions = [...Object.keys(this.renderers)];
    this.rendererField = storeConfig.initialRendererField;
    this.popupTemplate = storeConfig.popupTemplate;
    this.defaultRenderersList = storeConfig.defaultRenderersList;
    this.baselineWhereConditionList = storeConfig.baselineWhereConditionList;

    this.layerLoaded = false;
    this.viewConfig = storeConfig.viewConfig;
    this.outFields = storeConfig.outFields;
    this.hasCustomTooltip = storeConfig.hasCustomTooltip;
    this.bookmarkInfos = storeConfig.bookmarkInfos;
    this.locationsByArea = storeConfig.locationsByArea ? storeConfig.locationsByArea : [];
    this.hasCustomTooltip = storeConfig.hasCustomTooltip;
  }
  // to destroy map view, need to do `view.container = view.map = null;`
  // should probably include this in the dismount
  destroy(){
    if(this.effectHandler) this.effectHandler();
    if(this.rendererHandler) this.rendererHandler();
    if(this._tooltipListener) this._tooltipListener.remove();
    if( this._mouseLeaveListener) this._mouseLeaveListener.remove();
    if(this.bookmarkAutoplayId) {
      clearTimeout(this.bookmarkAutoplayId);
      this.bookmarkAutoplayId = null;
    }
  }

  loadFilters(){
    this.filters.forEach(f => f.load(this.lyr, this.map, this.view));
  }

  // todo could query the client instead of the server
  // once the layerview has loaded
  loadCharts(){
    if(!this.charts || this.charts.length < 1) return;
    this.charts.forEach(c => {
      this.lyr.queryFeatures(c.queryDefinition)
        .then(qRes => {
          const storedResult = c.resultTransform
            ? c.resultTransform(qRes)
            : qRes;
          this.chartResultMap.set(c.id, storedResult);
        });
    });
  }

  _updateRendererFields(layer){
    const renderer = this.renderers[this.rendererField];
    if(renderer._type === 'jsapi'){
      layer.renderer = renderer;
    }
    else
      loadModules(['esri/renderers/support/jsonUtils'], options)
      .then(([rendererJsonUtils]) => {
          layer.renderer = rendererJsonUtils.fromJSON(this.renderers[this.rendererField]);
      });
  }

  
  _loadLayers(){
    this.mapLayers = this.map.layers;
    //this.map.layers.getItemAt(0).renderer = this.renderers[this.rendererField];
    
    // this.map.layers.getItemAt(0).renderer = this.renderers["average_speed"];
    // this.map.layers.getItemAt(1).renderer = this.renderers["pedestrian_density"];
    // this.map.layers.getItemAt(2).renderer = this.renderers["bicycles_density"];

    this.layerViewsMap = new Map();
    var initialLayerSetup = true; 
    const layers = this.mapId ? this.map.layers : [this.lyr];
    layers.forEach(layer => {
      this.view.whenLayerView(layer)
      .then(lV => {
        message.destroy();
        this.layerViewsMap.set(layer.id,lV);
        if (!this.defaultRenderersList)
          this._updateRendererFields(layer);
        if(this.popupTemplate !== undefined) layer.popupTemplate = this.popupTemplate;

        this.aliasMap = layer.fields.reduce((p, f) => {
          p.set(f.name, f.alias);
          return p;
        }, new Map());
        lV.filter = {where: this.where}
        if (initialLayerSetup){

          this.loadFilters();
          this.loadCharts();

          this.layerLoaded = true;
          initialLayerSetup = false;
        }
  
  
       }
      )
      .catch(er => {
        message.destroy();
        message.error('Error loading the layers, does your account have access to the data?', 4);
        console.log(er);
      });



    })
    if (this.defaultRenderersList){
      this.map.layers.forEach((value,key)=>{
        this.map.layers.getItemAt(key).renderer = this.renderers[this.defaultRenderersList[key]]

      })
    }

    if(this.hasCustomTooltip){
      this._tooltipListener = this.view.on("pointer-move", this._onMouseMove);
      this._mouseLeaveListener = this.view.on("pointer-leave", this._onMouseLeave);
    }




  }

  _buildAutoRunEffects(){
    const onApplyFilter = pUtils.debounce(function(layerViewsMap, where, baselineWhereConditionList){
      var index = 0;
      layerViewsMap.forEach((layerView) => {
        var whereCondition = where;
        if (baselineWhereConditionList) {
          whereCondition = whereCondition + baselineWhereConditionList[index];
          console.log(layerView.layer.renderer.field);
          console.log(whereCondition);

        }
        layerView.filter = {where: whereCondition};
        index++;
      })

    });
    this.effectHandler = autorun(_ => {
      const where = this.where;
      if(this.layerViewsMap && onApplyFilter){
        console.log("filtering:" + where);
        onApplyFilter(this.layerViewsMap, where, this.baselineWhereConditionList);
      }
    });
    this.rendererHandler = autorun(_ => {
      if ((this.map && this.map.layers.length > 0) || this.lyr){
        const layers = this.mapid ? this.map.layers : [this.lyr];

        layers.forEach(layer => {
          console.log("updating")
          this._updateRendererFields(layer);
        });
      }
    })
  }

  clearTooltip(){
    if(this._tooltipHighlight){
      this._tooltipHighlight.remove();
      this._tooltipHighlight = null;
    }
    this.tooltipResults = null;
  }

  // function to watch for mouse movement
  _onMouseMove(evt){

    const promise = ( this._tooltipPromise = this.view
      .hitTest(evt)
      .then(hit => {
        if(promise !== this._tooltipPromise){
          return; // another test was performed
        }
        if(this._tooltipHighlight){
          this._tooltipHighlight.remove();
          this._tooltipHighlight = null;
        }
        const results = hit.results.filter(
          r => r.graphic.layer === this.lyr
        );
        if(results.length){
          const graphic = results[0].graphic;
          const screenPoint = hit.screenPoint;
          this._tooltipHighlight = this.layerViewsMap.get(this.lyr.id).highlight(graphic);
          this.tooltipResults = {
            screenPoint,
            graphic
          }
        } else {
          this.tooltipResults = null;
        }
      })
      
    )
  }

  _onMouseLeave(evt){
    this._tooltipPromise = null;
    this.clearTooltip();
  }

  setRendererField(field){
    this.rendererField = field;
  }

  toggleLayerVisibility(layer){
    const isVisible = !layer.visible;
    layer.visible = isVisible;
    this.layerVisibleMap.set(layer.id, isVisible);
  }

  load(mapViewDiv){
    message.loading('Loading data.', 0);
    let renderer;
    return loadModules([
      'esri/WebMap',
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/core/promiseUtils',
      'esri/identity/IdentityManager',
      'esri/renderers/support/jsonUtils',
      'esri/geometry/SpatialReference',
      'esri/geometry/Extent'
    ], options)
    .then(([WebMap, Map, MapView, FeatureLayer, promiseUtils, esriId, rendererJsonUtils, SpatialReference, Extent]) => {

      esriId.registerToken(this.appState.session.toCredential());

      pUtils = promiseUtils;
      this._buildAutoRunEffects();

      this.view = new MapView({
        container: mapViewDiv,
        center: this.viewConfig.center,
        zoom: this.viewConfig.zoom,
      })

      this.locationsByArea.forEach(l => 
        l.locations.forEach(loc => 
          loc.extent = new Extent(loc.extent))
      );
      if(this.mapId){
        this.map = new WebMap({
          portalItem: {
            id: this.mapId
          }
        });
        this.view.map = this.map;

        return this.map.when();
      } else {
        const lyr = new FeatureLayer({
          portalItem: {id: this.layerId}
        })
        this.map = new Map({
          basemap: 'dark-gray-vector',
          layers: [lyr]
        });
        this.view.map = this.map;
        return Promise.resolve();
      }

      
    })
    .then(_ => {
      this.lyr = this.map.layers.getItemAt(0);
      //if(renderer) this.lyr.renderer = renderer;
      if(this.outFields) this.lyr.outFields = this.outFields;
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

  //todo, move the GoTo to the view?
  onBookmarkClick(index){
    if(!this.view || index >= this.bookmarks.length) return;
    const bookmark = this.bookmarks[index];
    this.view.goTo(bookmark.extent);
    if(this.bookmarkInfos){
      this.bookmarkInfo = this.bookmarkInfos[bookmark.name]
    }
  }

  startAutoplayBookmarks(){
    this.autoplay = true;

    this.bookmarkIndex = this.bookmarkIndex + 1 < this.bookmarks.length
      ? this.bookmarkIndex + 1
      : 0;

    this.onBookmarkClick(this.bookmarkIndex);
    this.bookmarkAutoplayId = setTimeout(this.startAutoplayBookmarks, 30000);
  }

  stopAutoplayBookmarks(){
    this.autoplay = false;
    this.bookmarkIndex = 0;
    if(this.bookmarkAutoplayId) {
      clearTimeout(this.bookmarkAutoplayId);
      this.bookmarkAutoplayId = null;
    }
  }

  onLocationClick(areaIndex, index) {
    
    if(!this.view || areaIndex >= this.locationsByArea.length || index >= this.locationsByArea[areaIndex].locations.length) return;
    const location = this.locationsByArea[areaIndex].locations[index];
    this.view.goTo(location.extent);
  }

  clearBookmark(){
    this.bookmarkInfo = null;
  }

  get where(){
    const where = this.filters
      .filter(f => !!f.where)
      .map(f => f.where)
      .join(' AND ');
    console.log(where) 
    return where ? where : "1=1";
  }
  
  get layers(){
    if(this.map && this.layerLoaded) {
      return this.map.layers.items.reverse();
    };
    return [];
  }

  get bookmarks(){
    if(this.map && this.layerLoaded) {
      return this.map.bookmarks.items;
    };
    return [];
  }
}

decorate(Store, {
  user: observable,
  rendererField: observable,
  layerLoaded: observable,
  aliasMap: observable,
  layerVisibleMap: observable,
  autoplay: observable,
  chartResultMap: observable.shallow,
  tooltipResults: observable.shallow,
  bookmarkInfo: observable.ref,
  map: observable.ref,
  mapLayers: observable.ref,
  where: computed,
  layers: computed,
  bookmarks: computed,
  load: action.bound,
  _updateRendererFields: action.bound,
  _loadLayers: action.bound,
  loadFilters: action.bound,
  loadCharts: action.bound,
  setRendererField: action.bound,
  clearFilters: action.bound,
  toggleLayerVisibility: action.bound,
  _onMouseMove: action.bound,
  onBookmarkClick: action.bound,
  onLocationClick: action.bound,
  clearBookmark: action.bound,
  clearTooltip: action.bound,
  _onMouseLeave: action.bound,
  startAutoplayBookmarks: action.bound,
  stopAutoplayBookmarks: action.bound
});

export default Store;
