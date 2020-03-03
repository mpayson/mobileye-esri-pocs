// following guidance here:
// https://github.com/Esri/esri-loader#using-classes-synchronously

import {loadModules} from 'esri-loader';
import loaderOptions from '../config/esri-loader-options';

let _pModules;
let
    // auth
    _esriId,
    // mapping
    _WebMap,
    _Map,
    _Basemap,
    _FeatureLayer,
    _VectorTileLayer,
    _MapView,
    // widget UIs
    _Search,
    _Legend,
    _Home,
    _Expand,
    // services
    _locatorService,
    _geometryEngine,
    // geometries
    _Point,
    _Extent,
    _Graphic,
    // utils
    _wU,
    _pU, 
    _jsonUtils,
    _getHistogram;

// utility for preloading necessary modules
export function preloadAllModules(){
  _pModules = loadModules([
    // auth
    'esri/identity/IdentityManager',
    // mapping
    'esri/WebMap',
    'esri/Map',
    'esri/Basemap',
    'esri/layers/FeatureLayer',
    'esri/layers/VectorTileLayer',
    'esri/views/MapView',
    // widget UIs
    'esri/widgets/Search',
    'esri/widgets/Legend',
    'esri/widgets/Home',
    'esri/widgets/Expand',
    // services
    'esri/tasks/Locator',
    "esri/geometry/geometryEngine",
    // geometry objs
    'esri/geometry/Point',
    'esri/geometry/Extent',
    'esri/Graphic',
    // utils
    'esri/core/watchUtils',
    'esri/core/promiseUtils',
    'esri/renderers/support/jsonUtils',
    // 'esri/renderers/smartMapping/statistics/histogram'
  ], loaderOptions)
  .then(([
    esriId,
    WebMap,
    Map,
    Basemap,
    FeatureLayer,
    VectorTileLayer,
    MapView,
    Search,
    Legend,
    Home,
    Expand,
    Locator,
    geometryEngine,
    Point,
    Extent,
    Graphic,
    wU,
    pU,
    jsonUtils,
    // histogram
  ]) => {
    _esriId = esriId;

    _WebMap = WebMap;
    _Map = Map;
    _Basemap = Basemap;
    _FeatureLayer = FeatureLayer;
    _VectorTileLayer = VectorTileLayer;
    _MapView = MapView;
    
    _Search = Search;
    _Legend = Legend;
    _Home = Home;
    _Expand = Expand;

    _locatorService = new Locator({
      url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    })
    _geometryEngine = geometryEngine;

    _Point = Point;
    _Extent = Extent;
    _Graphic = Graphic;

    _wU = wU;
    _pU = pU;
    _jsonUtils = jsonUtils;
    // _getHistogram = histogram;

  });
  return _pModules;
}

// modules specific to the safety app, up to the caller to indicate
// that these are needed otherwise won't be requested

let _pSafetyModules;
let _routeService,
  _RouteParameters,
  _FeatureSet,
  _SketchVM,
  _SpatialReference

export function preloadSafetyModules(){
  _pSafetyModules = loadModules([
    'esri/tasks/RouteTask',
    'esri/tasks/support/RouteParameters',
    'esri/tasks/support/FeatureSet',
    'esri/widgets/Sketch/SketchViewModel',
    'esri/geometry/SpatialReference'
  ], loaderOptions)
  .then(([
    RouteTask,
    RouteParameters,
    FeatureSet,
    SketchVM,
    SpatialReference
  ]) => {
    _routeService = new RouteTask({
      url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
    });
    _RouteParameters = RouteParameters;
    _FeatureSet = FeatureSet;
    _SketchVM = SketchVM;
    _SpatialReference = SpatialReference;
  });
  return _pSafetyModules;
}

// utility for loading modules if needed
function _loadAllModules(){
  return _pModules ? _pModules : preloadAllModules();
}
function _loadSafetyModules(){
  return _pSafetyModules ? _pSafetyModules : preloadSafetyModules();
}

// this must get called before all other map service calls
export function registerSession(session){
  return _loadAllModules()
    .then(_ => {
      _esriId.registerToken(session.toCredential())
    });
}

export function destroyCurrentSession(session){
  _moduleCheck(_esriId, "You must register an authenticated session before destroying a session");
  _esriId.destroyCredentials();
}

// this must get called before all other safety app service calls
export function createSketchVM(view, options){
  return _loadSafetyModules()
    .then(_ => {
      return new _SketchVM({view, ...options});
    });
}

function _loadMapView(map, container, options){
  _moduleCheck(_WebMap, "You must register an authenticated session before loading the map view");
  const view = new _MapView({
    map,
    container,
    ...options
  });
  // adjust the default behavior of the map view
  view.ui.move("zoom", "bottom-left");
  view.popup.actions.removeAll();
  return view;
}

export function loadMap(container, mapOptions, viewOptions){
  _moduleCheck(_Map, "You must register an authenticated session before loading the map");
  const map = new _Map(mapOptions);
  return _loadMapView(map, container, viewOptions);
}

export function loadWebMap(container, webmapId, viewOptions){
  _moduleCheck(_WebMap, "You must register an authenticated session before instantiating the map")
  const map = new _WebMap({
    portalItem: {
      id: webmapId
    }
  });
  return _loadMapView(map, container, viewOptions);
}

export function loadBasemap(view, basemapId, addStreetNames) {
  view.map.basemap = _Basemap.fromId(basemapId);
  if (addStreetNames) {
    view.map.basemap.referenceLayers = [
      new _VectorTileLayer({
        // street names
        url: "https://www.arcgis.com/sharing/rest/content/items/747cb7a5329c478cbe6981076cc879c5/resources/styles/root.json"
      })
    ];
  }
  return view;
}

export function layerFromJson(esriJson, oidField, layerOptions){
  _moduleCheck(_FeatureLayer, "You must register an authenticated session before creating layers");
  return new _FeatureLayer({
    source: esriJson,
    objectIdField: oidField,
    geometryType: "point",
    ...layerOptions
  });
}

export function layerFromId(itemId, layerOptions){
  _moduleCheck(_FeatureLayer, "You must register an authenticated session before creating layers");
  return new _FeatureLayer({
    portalItem: {id: itemId},
    ...layerOptions
  });
}

export function suggestLocations(text, location){
  _moduleCheck(_locatorService, "You must register an authenticated session before using the locator");
  return _locatorService.suggestLocations({
    text,
    location
  });
}

export function locationToAddress(geometry, locationType="street"){
  _moduleCheck(_locatorService, "You must register an authenticated session before using the locator");
  return _locatorService.locationToAddress({
    location: geometry,
    locationType
  });
}

export function magicKeyToLocation(magicKey){
  _moduleCheck(_locatorService, "You must register an authenticated session before using the locator");
  return _locatorService.addressToLocations({
    magicKey
  });
}

export function featuresIntoFeatureSet(featureArray){
  _moduleCheck(_FeatureSet, "You must register a sketch view model before creating feature sets in safety app");
  const fs = new _FeatureSet();
  fs.features = featureArray;
  return fs;
}

export function generateRoute(startGraphic, endGraphic, options){
  _moduleCheck(_RouteParameters, "You must register a sketch view model before generating routes in safety app");
  const stops = featuresIntoFeatureSet([startGraphic, endGraphic]);
  const routeParams = new _RouteParameters({
    stops,
    outSpatialReference: _SpatialReference.WebMercator, // hardcode for now
    ...options
  });
  return _routeService.solve(routeParams);
}

export function buffer(geometry, distance, unit){
  _moduleCheck(_geometryEngine, "You must register an authenticated session before buffering");
  return _geometryEngine.buffer(geometry, distance, unit);
}

export function jsonToPoint(pointJson){
  _moduleCheck(_Point, "You must register an authenticated session before creating points");
  return new _Point(pointJson);
}

export function jsonToExtent(extentJson){
  _moduleCheck(_Extent, "You must register an authenticated session before creating extents");
  return new _Extent(extentJson);
}

export function jsonToRenderer(rendererJson){
  _moduleCheck(_jsonUtils, "You must register an authenticated session before parsing renderers");
  return _jsonUtils.fromJSON(rendererJson);
}

export function jsonToGraphic(esriJson, options){
  _moduleCheck(_jsonUtils, "You must register an authenticated session before using graphics");
  return new _Graphic({
    ...esriJson,
    ...options
  });
}

export function addHomeWidget(view, position='top-right', goToTarget){
  _moduleCheck(_Home, "You must register an authenticated session before adding widgets");
  const home = new _Home({view})
  if(goToTarget){
    home.goToOverride = (v, goToParams) => {
      goToParams.target = {...goToTarget};
      return v.goTo(goToParams.target, goToParams.options);
    }
  }
  view.ui.add(home, position);
}

function addExpandWidget(view, widget, iconClass){
  _moduleCheck(_Expand, "You must register an authenticated session before adding widgets");
  return new _Expand({
    view,
    content: widget,
    expandIconClass: iconClass
  })
}

export function addSearchWidget(view, position, index, withExpand=false){
  _moduleCheck(_Search, "You must register an authenticated session before adding widgets");
  const search = new _Search({view});
  const widget = withExpand
    ? addExpandWidget(view, search, 'esri-icon-search')
    : search;
  const options = index || index === 0 ? {position, index} : position;
  view.ui.add(widget, options);
  return search;
}

export function addLegendWidget(view, position, options){
  _moduleCheck(_Legend, "You must register an authenticated session before adding legends");
  const legend = new _Legend({
    view,
    ...options
  });
  view.ui.add(legend, position);
}

export function whenTrue(object, property, handler){
  _moduleCheck(_wU, "You must register an authenticated session before adding watches");
  return _wU.whenTrue(object, property, handler);
}

export function whenFalseOnce(object, property){
  _moduleCheck(_wU, "You must register an authenticated session before adding watches");
  return _wU.whenFalseOnce(object, property);
}

export function debounce(asyncFunction){
  _moduleCheck(_pU, "You must register an authenticated session before using debounce util")
  return _pU.debounce(asyncFunction);
}

export function getHistogram(options){
  throw new Error("Not currently loading the histogram module, uncomment above to load");
  // _moduleCheck(_getHistogram, "You must register an authenticated session before using histogram util");
  // return _getHistogram({...options})
}

function _moduleCheck(module, errorMsg){
  if(!module) throw new Error(errorMsg);
}