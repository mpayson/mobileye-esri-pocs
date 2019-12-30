import {decorate, observable, action, computed, autorun} from 'mobx';
import createFilterFromConfig from './Filters';
import {
  loadMap,
  loadWebMap,
  registerSession,
  jsonToRenderer,
  jsonToExtent,
  layerFromId,
  debounce
} from '../services/MapService';

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
    layerViewsMap = new Map();
    mapLoaded = false;

    constructor(appState, storeConfig) {
        this.appState = appState;
        //this.layerId = storeConfig.layerItemId;
        this.mapId = storeConfig.webmapId;
        console.log(storeConfig.webmapId)
        this.filters = storeConfig.filters.map(createFilterFromConfig);
        this.charts = storeConfig.charts || [];

        this.renderers = storeConfig.renderers;
        this.rendererOptions = [...Object.keys(this.renderers)];
        this.rendererField = storeConfig.initialRendererField;
        this.popupTemplate = storeConfig.popupTemplate;
        this.onMouseOutStatistics = storeConfig.onMouseOutStatistics;
        this.layerLoaded = false;
        this.viewConfig = storeConfig.viewConfig;
        this.outFields = storeConfig.outFields;
        this.layersConfig = storeConfig.layers;
        this.hasCustomTooltip = storeConfig.hasCustomTooltip;
        this.bookmarkInfos = storeConfig.bookmarkInfos;
        this.locationsByArea = storeConfig.locationsByArea ? storeConfig.locationsByArea : [];
        this.hasCustomTooltip = storeConfig.hasCustomTooltip;
    }

    // to destroy map view, need to do `view.container = view.map = null;`
    // should probably include this in the dismount
    destroy() {
        if (this.effectHandler) this.effectHandler();
        if (this.rendererHandler) this.rendererHandler();
        if (this._tooltipListener) this._tooltipListener.remove();
        if (this._mouseLeaveListener) this._mouseLeaveListener.remove();
        if (this.bookmarkAutoplayId) {
            clearTimeout(this.bookmarkAutoplayId);
            this.bookmarkAutoplayId = null;
        }
    }

    loadFilters() {
        var layers = null;//this.lyr;
        if (this.layersConfig) {
            layers = this.map.layers.filter((layer,index) => this._getLayerConfigByInitialIndex(index).type !== "static");
        }
        this.filters.forEach(f => f.load(this.lyr, layers, this.view));
    }

    // todo could query the client instead of the server
    // once the layerview has loaded
    loadCharts() {
        if (!this.charts || this.charts.length < 1) return;
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

    _formatRenderer(renderer){
        return renderer._type === 'jsapi'
            ? renderer
            : jsonToRenderer(renderer);
    }

    _updateRendererFields(layer,key) {
        var renderer;
        if (key) {
          renderer = this.renderers[this._getLayerConfigByInitialIndex(key).defaultRendererField];
        }
        else
          renderer = this.renderers[this.rendererField];

        if (renderer._type === 'jsapi') {
          layer.renderer = renderer;
        } else {
          layer.renderer = jsonToRenderer(this.renderers[this.rendererField]);
        }
    }

    _getLayerConfigByInitialIndex(index){
        var layer;
        if(!this.layersConfig) return null;
        for (layer of this.layersConfig){
            if (layer.id === index)
                return layer;
        }
    }

    // TODO: go off of Layer ID not collection index since mutable
    _applyInitialLayerOverrides(layer, collectionIndex){
        // backwards compatible one-layer pattern
        if(collectionIndex === 0){
            if(this.outFields) layer.outFields = this.outFields; // used if client-side functionality that requires fields
            if(this.rendererField) // used if need there are many renderer options for layer not in webmap
                layer.renderer = this._formatRenderer(this.renderers[this.rendererField]);
            if(this.popupTemplate) // used if need to override popup from webmap
                layer.popupTemplate = this.popupTemplate;
        }

        // new layers config pattern
        // TODO these can all be saved in the webmap
        if(!this.layersConfig) return;
        const config = this.layersConfig.find(c => 
            c.id === collectionIndex
        );
		if(!config) return;

        if(config.title) layer.title = config.title;
        if(config.name) layer.id = config.name;
        if(config.baselineWhereCondition) 
            layer.definitionExpression = config.baselineWhereCondition;
        if(config.outFields) layer.outFields = config.outFields;
        // Port static logic
        if(config.defaultRenderer && config.type !== 'static'){
            layer.renderer = this._formatRenderer(config.defaultRenderer);
        }
    }

    _initLayerDataStructures(layer, collectionIndex){
        // sets observable visibility map for layer list
        this.setLayerVisibility(layer, layer.visible);
        
        return this.view.whenLayerView(layer)
            .then(lV => {
                // backwards compatible one-layer pattern
                if(collectionIndex === 0) {
                    this.lyrView = lV;
                    this.aliasMap = layer.fields.reduce((p,f) => {
                            p.set(f.name, f.alias);
                            return p;
                    }, new Map());
                }
                // multiple layers pattern
                this.layerViewsMap.set(layer.id, lV);
            })
            .catch(er => console.log(er))
    }

    async _loadLayers() {
        // backwards compatible one-layer pattern
        this.lyr = this.map.layers.getItemAt(0);

        this.map.layers.items.forEach(this._applyInitialLayerOverrides);
        const pLyrs = this.map.layers.items.map(this._initLayerDataStructures);
        return Promise.all(pLyrs);
    }

    _buildAutoRunEffects() {
        const onApplyFilter = debounce(function (layerViewsMap, where, layersConfig) {
            var index = 1;
            layerViewsMap.forEach((layerView) => {
                var whereCondition = where;
                if (layersConfig) {

                    var layerConfigTemp;
                    var layerConfig;
                    for (layerConfigTemp of layersConfig.filter(layer=>layer.type !== "static")){
                        if (layerConfigTemp.id === index) {
                            layerConfig = layerConfigTemp;
                            break;
                        }
                    }
                    whereCondition = whereCondition + layerConfig.baselineWhereCondition;
                }
                layerView.filter = {where: whereCondition};
                index++;
            })

        });
        this.effectHandler = autorun(_ => {
            const where = this.where;
            if (this.layerViewsMap && onApplyFilter) {
                onApplyFilter(this.layerViewsMap, where, this.layersConfig);
            }
        });
        this.rendererHandler = autorun(_ => {
            const rendererField = this.rendererField;
            if ((this.map && this.map.layers.length > 0) || this.lyr) {
                const layers = this.mapId ? this.map.layers : [this.lyr];
                layers.forEach((layer,key) => {
                    console.log("updating");
                    if (this.layersConfig)
                        this._updateRendererFields(layer,key);
                    else
                        this._updateRendererFields(layer);

                });
            }
        })
    }

    clearTooltip() {
        if (this._tooltipHighlight) {
            this._tooltipHighlight.remove();
            this._tooltipHighlight = null;
        }
        this.tooltipResults = null;
    }

    // function to watch for mouse movement
    _onMouseMove(evt) {
        const promise = (this._tooltipPromise = this.view
            .hitTest(evt)
            .then(hit => {

                if (promise !== this._tooltipPromise) {
                    return; // another test was performed
                }
                if (this._tooltipHighlight) {
                    this._tooltipHighlight.remove();
                    this._tooltipHighlight = null;
                }

                const results = hit.results.filter(r => 
                    this.interactiveLayerIdSet.has(r.graphic.layer.id)
                );


                if (results.length) {
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
                        const graphic = results[0].graphic;
                        const screenPoint = hit.screenPoint;
                        this._tooltipHighlight = this.layerViewsMap.get(results[0].graphic.layer.id).highlight(graphic);
                        const queryResults = queryFeaturesResults.features;
                        this.tooltipResults = {
                            screenPoint,
                            graphic,
                            queryResults
                        }

                    });


                } else {
                    this.tooltipResults = null;
                }
            })

        )
    }

    _onMouseLeave(evt) {
        this._tooltipPromise = null;
        this.clearTooltip();
    }

    setRendererField(field) {
        this.rendererField = field;
    }

    toggleLayerVisibility(layer) {
      const isVisible = !layer.visible;
      this.setLayerVisibility(layer, isVisible);
    }

    setLayerVisibility(layer, isVisible){
      layer.visible = isVisible;
      this.layerVisibleMap.set(layer.id, isVisible);
    }

    async load(mapViewDiv) {
      this.appState.loadingMessage('Loading data.');

      await registerSession(this.appState.session);
      // this._buildAutoRunEffects();

      this.locationsByArea.forEach(l => 
        l.locations.forEach(loc => 
          loc.extent = jsonToExtent(loc.extent)
        )
      );

      if(this.mapId){
        try {
          this.view = loadWebMap(mapViewDiv, this.mapId, this.viewConfig);
          this.map = this.view.map;
          await this.map.when(); // need to wait to get layer info
        } catch(e){
          this.appState.onError(e, 'Could not load the webmap, does the webmap item exist?');
        }
      } else {
        try{
          const lyr = layerFromId(this.layerId);
          const mapOptions = {basemap: 'dark-gray-vector'};
          this.view = loadMap(mapViewDiv, mapOptions, this.viewConfig);
          this.map = this.view.map;
          this.map.add(lyr);
        } catch(e){
          this.appState.onError(e, 'Could not load the map, does the layer item exist?');
        }
      }

        // keep this going in the background
        this._loadLayers()
            .then(_ => {
                this.loadFilters();
                this.loadCharts();
            })

      if (this.hasCustomTooltip) {
        this._tooltipListener = this.view.on("pointer-move", this._onMouseMove);
        this._mouseLeaveListener = this.view.on("pointer-leave", this._onMouseLeave);
			}

      // placement of this is important, affects calculated values that get run when set
			this.mapLoaded = true;
			this.appState.clearMessage();
      return this.view;

    }

    clearFilters() {
        this.filters.forEach(f => f.clear());
    }

    //todo, move the GoTo to the view?
    onBookmarkClick(index) {
        if (!this.view || index >= this.bookmarks.length) return;
        const bookmark = this.bookmarks[index];
        this.view.goTo(bookmark.extent);
        if (this.bookmarkInfos) {
            this.bookmarkInfo = this.bookmarkInfos[bookmark.name]
        }
    }

    startAutoplayBookmarks() {
        this.autoplay = true;

        this.bookmarkIndex = this.bookmarkIndex + 1 < this.bookmarks.length
            ? this.bookmarkIndex + 1
            : 0;

        this.onBookmarkClick(this.bookmarkIndex);
        this.bookmarkAutoplayId = setTimeout(this.startAutoplayBookmarks, 30000);
    }

    stopAutoplayBookmarks() {
        this.autoplay = false;
        this.bookmarkIndex = 0;
        if (this.bookmarkAutoplayId) {
            clearTimeout(this.bookmarkAutoplayId);
            this.bookmarkAutoplayId = null;
        }
    }

    onLocationClick(areaIndex, index) {

        if (!this.view || areaIndex >= this.locationsByArea.length || index >= this.locationsByArea[areaIndex].locations.length) return;
        const location = this.locationsByArea[areaIndex].locations[index];
        this.view.goTo(location.extent);
    }

    clearBookmark() {
        this.bookmarkInfo = null;
    }

    get where() {
        const where = this.filters
            .filter(f => !!f.where)
            .map(f => f.where)
            .join(' AND ');
        return where ? where : "1=1";
    }

    get layers() {

      if (this.map && this.mapLoaded) {
        // WARNING, previously used reverse but this is mutable
        return this.map.layers.items;
      }
      return [];
    }

    get interactiveLayers(){
      return this.layers.filter((layer, index) => {
        const config = this._getLayerConfigByInitialIndex(index);
        if(config && config.showFilter === false){
          return false;
        }
        return true;
      });
    }

    get interactiveLayerIdSet(){
        return new Set(this.interactiveLayers.map(l => l.id));
    }

    get bookmarks() {
      if (this.map && this.layerLoaded) {
        return this.map.bookmarks.items;
      }
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
    mapLoaded: observable,
    where: computed,
    layers: computed,
    interactiveLayers: computed,
    interactiveLayerIdSet: computed,
    bookmarks: computed,
    load: action.bound,
    _updateRendererFields: action.bound,
		_loadLayers: action.bound,
		_applyInitialLayerOverrides: action.bound,
		_initLayerDataStructures: action.bound,
		_registerLayerViews: action.bound,
    loadFilters: action.bound,
    loadCharts: action.bound,
    setRendererField: action.bound,
    clearFilters: action.bound,
    toggleLayerVisibility: action.bound,
    setLayerVisibility: action.bound,
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
