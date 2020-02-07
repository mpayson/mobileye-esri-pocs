import {decorate, observable, action, computed, autorun} from 'mobx';
import createFilterFromConfig from './Filters';
import {
    loadWebMap, loadMap, jsonToRenderer, 
    registerSession, jsonToExtent, layerFromId, debounce,
    whenFalseOnce
} from '../services/MapService';
import { combineNullableWheres } from '../utils/Utils';

class Store {

    aliasMap = null;
    chartResultMap = new Map();
    map = null;
    layerVisibleMap = new Map();
    tooltipResults = null;
    bookmarkInfo = null;
    autoplay = false;
    bookmarkIndex = -1;
    layerViewsMap = new Map();
    layersLoaded = false;

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
        this.viewConfig = storeConfig.viewConfig;
        this.outFields = storeConfig.outFields;
        this.layersConfig = storeConfig.layers;
        this.hasCustomTooltip = storeConfig.hasCustomTooltip;
        this.hasZoomListener = storeConfig.hasZoomListener;
        this.bookmarkInfos = storeConfig.bookmarkInfos;
        this.locationsByArea = storeConfig.locationsByArea ? storeConfig.locationsByArea : [];
        this.hasCustomTooltip = storeConfig.hasCustomTooltip;
        this.liveLayersStartIndex = storeConfig.liveLayersStartIndex;
        this.defaultVisibleLayersList = storeConfig.defaultVisibleLayersList;
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
        if (this._zoomListener) this._zoomListener.remove();
    }

    loadFilters() {
        this.filters.forEach(f => f.load(this.lyr, this.interactiveLayers, this.view));
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

    // todo, if many layers will have many dynamic renderers
    // should create a map of layer id to renderer field
    _updateRendererFields(layer, useDefault=false) {
        if(!layer) return;
        let renderer;
        const config = this.layerConfigByLayerId.get(layer.id);
        if (useDefault && config){
            renderer = config.defaultRendererField;
        } else {
            renderer = this.renderers[this.rendererField];
        }
        layer.renderer = this._formatRenderer(renderer);
    }

    // TODO: go off of Layer ID not collection index since mutable
    _applyInitialLayerOverrides(layer, collectionIndex){  
        // guard against other layer types that may be in the map
        if(layer.type !== 'feature') return;

        // used if need to override popup from webmap
        if(!this.layersConfig && this.popupTemplate)
                layer.popupTemplate = this.popupTemplate;

        // backwards compatible one-layer pattern
        if(!this.layersConfig && collectionIndex === 0){
            if(this.outFields) layer.outFields = this.outFields; // used if client-side functionality that requires fields
            if(this.rendererField) // used if need there are many renderer options for layer not in webmap
                layer.renderer = this._formatRenderer(this.renderers[this.rendererField]);
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
        if(config.baselineWhereCondition || config.initialZoomExpression) {
            layer.definitionExpression = combineNullableWheres([
                config.baselineWhereCondition,
                config.initialZoomExpression
            ]);
        }
        if(config.outFields) layer.outFields = config.outFields;
        if(config.popupTemplate !== undefined) layer.popupTemplate = config.popupTemplate;
        if(config.refreshInterval) layer.refreshInterval = config.refreshInterval;

        // Port static logic
        if(config.defaultRendererField && config.type !== 'static'){
            const renderer = this.renderers[config.defaultRendererField];
            layer.renderer = this._formatRenderer(renderer);
        }
        if(this.defaultVisibleLayersList && !this.defaultVisibleLayersList.includes(config.id)){
            layer.visible = false;
        }
    }

    _initLayerDataStructures(layer, collectionIndex){
        // guard against other layer types that may be in the map
        if(layer.type !== 'feature') return;

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

                // set initial where, port of logic where only applied if theres a baseline condition
                // because baseline condition was set to definitionexpression
                const config = this.layerConfigByLayerId.get(layer.id);
                if(config && config.customDefaultFilter) {
                    lV.filter = {where: config.customDefaultFilter}
                    return;
                }
                if(config && config.ignoreFilter === true) return;
                lV.filter = {where: this.where}
            })
    }

    async _loadLayers(){
        this.map.layers.items.forEach(this._applyInitialLayerOverrides);
        this.layersLoaded = true;

        const pLyrs = this.map.layers.items.map(this._initLayerDataStructures);
        return Promise.all(pLyrs);
    }

    _buildAutoRunEffects() {
        const onApplyFilter = debounce(function (layerViewsMap, where, interactiveIds, layerConfigByLayerId) {
            layerViewsMap.forEach(lV => {
                const id = lV.layer.id;
                if(interactiveIds.has(id)){
                     const config = layerConfigByLayerId.get(id);
                     if(!config || (config && !config.ignoreFilter))
                       lV.filter = {where};
                }
            });
        });
        this.effectHandler = autorun(_ => {
            const where = this.where;
            if (this.layerViewsMap && this.layersLoaded && onApplyFilter) {
                onApplyFilter(this.layerViewsMap, where, this.interactiveLayerIdSet, this.layerConfigByLayerId);
            }
        });
        this.rendererHandler = autorun(_ => {
            const rendererField = this.rendererField;
            // only interactive layers will have updated renderers
            this.interactiveLayers.forEach(layer => {
                const config = this.layerConfigByLayerId.get(layer.id);
                if (!config || (config && !config.ignoreRendererUpdate)) {
                    this._updateRendererFields(layer);
                }
            })
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

                const results = hit.results.filter(
                    r => this.interactiveLayerIdSet.has(r.graphic.layer.id)
                );

                if (results.length) {
                    const graphic = results[0].graphic;
                    const screenPoint = hit.screenPoint;
                    this._tooltipHighlight = this.layerViewsMap.get(results[0].graphic.layer.id).highlight(graphic);

                    if (this.onMouseOutStatistics) {
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
                            const queryResults = queryFeaturesResults.features;
                            this.tooltipResults = {
                                screenPoint,
                                graphic,
                                queryResults
                            }

                        });
                    } else
                        this.tooltipResults = {screenPoint, graphic}

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

    _onZoomChange(zoom){
        if(!this.layers || this.layers.length < 1 || !Number.isInteger(zoom)) return;
        this.layers.forEach(l => {
            const config = this.layerConfigByLayerId.get(l.id);
            if(!config || !config.zoomExpressions) return;
            const expression = config.zoomExpressions.find(e => zoom < e.zoom);
            const where = expression ? expression.where : null;
            const combinedWhere = combineNullableWheres([
                config.baselineWhereCondition,
                where
            ]);
            l.definitionExpression = combinedWhere;
        })
    }

    setRendererField(field) {
        this.rendererField = field;
    }

    toggleLayerVisibility(layer) {
        const isVisible = !layer.visible;
        this.setLayerVisibility(layer, isVisible);
    }

    setLayerVisibility(layer, isVisible){
        if(layer.visible !== isVisible){
            layer.visible = isVisible;
        }
        this.layerVisibleMap.set(layer.id, isVisible);
    }

    async load(mapViewDiv) {
        this.appState.loadingMessage('Loading map.');

        await registerSession(this.appState.session);
        this._buildAutoRunEffects();

        this.locationsByArea.forEach(l => 
            l.locations.forEach(loc => 
                loc.extent = jsonToExtent(loc.extent)
            )   
        );
        
        if(this.mapId){ // web map logic
            try{
                this.view = loadWebMap(mapViewDiv, this.mapId, this.viewConfig);
                this.map = this.view.map;
                await this.map.when();
            } catch (e){
                this.appState.onError(e, 'Could not load the webmap, does the webmap item exist?');
            }
        } else { // backwards compatible layer logic
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

        // wait for layers to load before loading filters / charts
        // can return from function and keep this going in background
        this.lyr = this.map.layers.getItemAt(0);
        this._loadLayers()
            .then(_ => {
                this.loadFilters();
                this.loadCharts();
            })
            .catch(er => {
                this.appState.onError(er, 'Could not load layers, do you have access to the data?')
            })

        if (this.hasCustomTooltip) {
            this._tooltipListener = this.view.on("pointer-move", this._onMouseMove);
            this._mouseLeaveListener = this.view.on("pointer-leave", this._onMouseLeave);
        }
        if (this.hasZoomListener) {
            this._zoomListener = this.view.watch("zoom", this._onZoomChange);
        }
        whenFalseOnce(this.view, 'updating')
            .then(_ => this.appState.clearMessage());

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
        if (this.map && this.layersLoaded) {
          // WARNING, previously used reverse but this is mutable
          return this.map.layers.items;
        }
        return [];
    }

    get legendLayerInfos() {
        return this.layers
            .filter(l => {
                const config = this.layerConfigByLayerId.get(l.id);
                return config && config.showLegend; // default to false
            })
            .map(l => ({
                layer: l,
                title: this.layerConfigByLayerId.get(l.id).customLegendTitle
                    ? this.layerConfigByLayerId.get(l.id).customLegendTitle
                    : ""
            }));
    }
    get interactiveLayers(){
        return this.layers.filter(layer => {
            const config = this.layerConfigByLayerId.get(layer.id);
            if(config && config.type === 'static'){
                return false;
            }
            return true;
        });
    }

    get interactiveLayerIdSet(){
        return new Set(this.interactiveLayers.map(l => l.id));
    }

    get layerConfigByLayerId(){
        if(!this.layersLoaded){
            throw new Error("Wait until the layers are loaded as the ID gets overrwritten when created")
        }
        if(!this.layersConfig) return new Map();
        return this.layersConfig.reduce((p, c) => {
            p.set(c.name, c);
            return p;
        }, new Map());
    }

    get bookmarks() {
        if (this.map && this.layersLoaded) {
            return this.map.bookmarks.items;
        }
        return [];
    }
}

decorate(Store, {
    user: observable,
    rendererField: observable,
    layersLoaded: observable,
    aliasMap: observable,
    layerVisibleMap: observable,
    autoplay: observable,
    chartResultMap: observable.shallow,
    tooltipResults: observable.shallow,
    bookmarkInfo: observable.ref,
    map: observable.ref,
    where: computed,
    layers: computed,
    interactiveLayers: computed,
    interactiveLayerIdSet: computed,
    layerConfigByLayerId: computed,
    bookmarks: computed,
    load: action.bound,
    _updateRendererFields: action.bound,
    _loadLayers: action.bound,
    _applyInitialLayerOverrides: action.bound,
    _initLayerDataStructures: action.bound,
    loadFilters: action.bound,
    loadCharts: action.bound,
    setRendererField: action.bound,
    clearFilters: action.bound,
    toggleLayerVisibility: action.bound,
    setLayerVisibility: action.bound,
    _onMouseMove: action.bound,
    _onZoomChange: action.bound,
    onBookmarkClick: action.bound,
    onLocationClick: action.bound,
    clearBookmark: action.bound,
    clearTooltip: action.bound,
    _onMouseLeave: action.bound,
    startAutoplayBookmarks: action.bound,
    stopAutoplayBookmarks: action.bound
});

export default Store;
