import {decorate, observable, action } from 'mobx';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import Store from '../stores/Store';
import { message } from 'antd';

// number of barriers to account for when routing
const NUMBER_BARRIERS = 200;
// added_network_cost = eventvalue / RISK_SCALE_FACTOR 
const RISK_SCALE_FACTOR = 3;

message.config({
  // top: "calc(100vh - 70px)"
  top: "75px"
})

const stopSymbol = {
  type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
  color: "white",
  size: "10px",  // pixels
  outline: {  // autocasts as new SimpleLineSymbol()
    color: [ 0, 0, 0 ],
    width: 1  // points
  }
};

const scoreStatQuery = {
  onStatisticField: 'eventvalue',
  outStatisticFieldName: 'score_sum',
  statisticType: 'sum'
}

class SafetyStore extends Store {
  editMode = null;
  startGraphic = null;
  endGraphic = null;

  // TODO refactor to a map instead of individual variables
  startStr = '';
  endStr = '';
  startSearchResults = [];
  endSearchResults = [];
  isSketchLoaded = false;

  stdRoute = null;
  stdTravelTime = null;
  stdTravelScore = null;
  scoreRoute = null;
  safetyTravelTime = null;
  safetyTravelScore = null;

  load(mapViewDiv){
    return super.load(mapViewDiv)
      .then(view => {
        loadModules([
          'esri/widgets/Sketch/SketchViewModel',
          'esri/layers/FeatureLayer',
          'esri/geometry/SpatialReference'
        ], options)
          .then(([SketchVM, FeatureLayer, SpatialReference]) => {
            this.sketchVM = new SketchVM({
              view,
              layer: view.graphics,
              pointSymbol: stopSymbol
            });
            this.sketchListener = this.sketchVM.on("create", this.onCreateComplete);
            this.isSketchLoaded = true;

            this.routeResultLyr = new FeatureLayer({
              title: "Route Results",
              geometryType: "polyline",
              spatialReference: SpatialReference.WebMercator,
              //spatialReference: SpatialReference.WGS84,
              objectIdField: 'oid',
              source: []
            })
            this.map.add(this.routeResultLyr);
          });
        return view;
      })
  }

  clearRouteData(){
    if(this.startGraphic){
      this.view.graphics.remove(this.startGraphic);
      this.startGraphic = null;
    }
    if(this.endGraphic){
      this.view.graphics.remove(this.endGraphic);
      this.endGraphic = null;
    }
    if(this.stdRoute){
      this.view.graphics.remove(this.stdRoute);
      this.stdRoute = null;
    }
    if(this.scoreRoute){
      this.view.graphics.remove(this.scoreRoute);
      this.scoreRoute = null;
    }
    this.editMode = null;
    this.startStr = '';
    this.endStr = '';
    this.stdTravelTime = null;
    this.stdTravelScore = null;
    this.safetyTravelTime = null;
    this.safetyTravelScore = null;
    this.startSearchResults = [];
    this.endSearchResults = [];
  }

  onCreateComplete(evt){
    if(evt.state !== 'complete') return;
    if(this.editMode === 'start'){
      this.startGraphic = evt.graphic;
      this.setAddressFromGeocode('start', this.startGraphic);
    } else if (this.editMode === 'end'){
      this.endGraphic = evt.graphic;
      this.setAddressFromGeocode('end', this.endGraphic);
    } else {
      this.view.graphics.remove(evt.graphic);
    }
    if(this.startGraphic && this.endGraphic){
      this.view.goTo([this.startGraphic, this.endGraphic])
    }
  }

  setAddressFromGeocode(stopType, graphic){

    loadModules(['esri/tasks/Locator'], options)
      .then(([Locator]) => {
        const locator = new Locator({
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });
        return locator.locationToAddress({
          location: graphic.geometry,
          locationType: "street"
        });
      })
      .then(res => {
        if(stopType === 'start') this.startStr = res.address;
        else if(stopType === 'end') this.endStr = res.address;
      })
      .catch(er => {
        message.error('Error converting point to an address, please retry!')
      });
  }

  onAddressSearchChange(value, isStart){
    if(isStart){
      this.startStr = value;
    } else {
      this.endStr = value;
    }
    if(!value) {
      console.log("HERE")
      if(isStart) this.startSearchResults = [];
      else this.endSearchResults = [];
      return;
    }
    loadModules(['esri/tasks/Locator'], options)
      .then(([Locator]) => {
        const locator = new Locator({
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });
        return locator.suggestLocations({
          text: value,
          location: this.view.center
        });
      })
      .then(res => {
        if(isStart){
          this.startSearchResults = res;
        } else {
          this.endSearchResults = res;
        }
      })
  }

  onAddressSearchSelect(magicKey, isStart){
    let G;
    loadModules(['esri/tasks/Locator', 'esri/Graphic'], options)
    .then(([Locator, Graphic]) => {
      G = Graphic;
      const locator = new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
      });
      return locator.addressToLocations({
        magicKey
      })
    })
    .then(res => {
      if(!res || res.length < 1) console.log('ERROR GETTING GEOCODE RESULTS');
      const address = res[0].address;
      const graphic = new G({
        symbol: stopSymbol,
        geometry: res[0].location
      });
      if(isStart){
        this.startStr = address;
        this.startGraphic = graphic;
        this.view.graphics.add(this.startGraphic);
        this.endGraphic 
          ? this.view.goTo([this.startGraphic, this.endGraphic])
          : this.view.goTo(this.startGraphic);
      } else {
        this.endStr = address;
        this.endGraphic = graphic;
        this.view.graphics.add(this.endGraphic);
        this.startGraphic 
        ? this.view.goTo([this.startGraphic, this.endGraphic])
        : this.view.goTo(this.endGraphic);
      }

    })
  }



  // don't like this logic, re-write at some point #refactor!
  onCreateClick(e){

    // remove start point
    if(e === 'start' && this.startGraphic){
      this.view.graphics.remove(this.startGraphic);
      this.startGraphic = null;
      this.editMode = e;
      this.startStr = '';
      this.startSearchResults = [];
    }
    // remove end graphic
    if(e === 'end' && this.endGraphic){
      this.view.graphics.remove(this.endGraphic);
      this.endGraphic = null;
      this.editMode = e;
      this.endStr = '';
      this.endSearchResults = [];
    }
    // cancel current edit mode
    if(this.editMode === e){
      this.editMode = null;
      if(this.sketchVM.state === 'active') {
        this.sketchVM.cancel();
      }
    } else {
      this.sketchVM.create("point");
      this.editMode = e;
    }
  }

  generateStdRoute(){
    return loadModules([
      'esri/tasks/RouteTask',
      'esri/tasks/support/RouteParameters',
      'esri/tasks/support/FeatureSet',
      'esri/geometry/SpatialReference'
    ], options)
    .then(([
      RouteTask,
      RouteParameters,
      FeatureSet,
      SpatialReference
    ]) => {
      const routeTask = new RouteTask({
        url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
      });
  
      const routeParams = new RouteParameters({
        stops: new FeatureSet(),
        outSpatialReference: SpatialReference.WebMercator,
        impedanceAttribute: 'Miles',
        accumulateAttributes: ['TravelTime']
      });
  
      routeParams.stops.features.push(this.startGraphic);
      routeParams.stops.features.push(this.endGraphic);
  
      return routeTask.solve(routeParams)
    })
    .then(data => {
      // console.log('std', data);
      
      // const existingGraphic = this.routeResultLyr.source.find(f => f.attributes.oid === 1);
      // if(existingGraphic){
      //   this.routeResultLyr.source.remove(existingGraphic);
      // }
      // const nextRoute = data.routeResults[0].route;

      if(this.stdRoute) this.view.graphics.remove(this.stdRoute);
      this.stdRoute = data.routeResults[0].route;
      this.stdRoute.symbol = {
        type: "simple-line",
        color: [94, 43, 255, 1],
        width: 3
      };
      this.stdTravelTime = this.stdRoute.attributes['Total_TravelTime'];
      this.view.graphics.add(this.stdRoute);
      return this.lyrView.queryFeatures({
        where: "1=1",
        geometry: this.stdRoute.geometry,
        outStatistics: [scoreStatQuery]
      })
    })
    .then(res => {
      if(res.features && res.features.length){
        this.stdTravelScore = res.features[0].attributes['score_sum']
      }
    });
  }

  generateScoreRoute(pStdRoute){
    const pQuery = this.lyrView.queryFeatures({
      where: "eventvalue > 0",
      geometry: this.view.extent,
      spatialRelationship: 'contains',
      orderByFields: ['eventvalue DESC'],
      returnGeometry: true,
      outFields: ['eventvalue', 'OBJECTID']
    });

    const pModules = loadModules([
      'esri/tasks/RouteTask',
      'esri/tasks/support/RouteParameters',
      'esri/tasks/support/FeatureSet',
      'esri/geometry/SpatialReference',
      "esri/geometry/geometryEngine"
    ], options);

    return Promise.all([pQuery, pModules])
    .then(([
      qres,
      [ RouteTask, RouteParameters, FeatureSet, SpatialReference,geometryEngine]
    ]) => {

      const routeTask = new RouteTask({
        url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
      });
  
      const routeParams = new RouteParameters({
        stops: new FeatureSet(),
        polygonBarriers: new FeatureSet(),
        outSpatialReference: SpatialReference.WebMercator,
        impedanceAttribute: 'Miles',
        accumulateAttributes: ['TravelTime']
      });
  
      routeParams.stops.features.push(this.startGraphic);
      routeParams.stops.features.push(this.endGraphic);

      var scorepolys = qres.features.slice(0,NUMBER_BARRIERS).map((f,i) => {
        var scorebuffer = {
          geometry: geometryEngine.geodesicBuffer(f.geometry, 15, "meters"),
          attributes: {
            Name: f.attributes['ObjectId'],
            BarrierType: 1,
            Attr_Miles: f.attributes['eventvalue'] / RISK_SCALE_FACTOR
          },
        }
        return scorebuffer;  
      });
      routeParams.polygonBarriers.features = scorepolys;

      return routeTask.solve(routeParams)
    })
    .then(data => {
      if(this.scoreRoute) this.view.graphics.remove(this.scoreRoute);
      this.scoreRoute = data.routeResults[0].route;
      this.scoreRoute.symbol = {
        type: "simple-line",
        color: [227, 69, 143, 1],
        width: 3
      };
      const pQuery = this.lyrView.queryFeatures({
        where: "1=1",
        geometry: this.scoreRoute.geometry,
        outStatistics: [scoreStatQuery]
      });
      return Promise.all([pQuery, pStdRoute])
    })
    .then(([res, _]) => {
      const tempScore = res.features && res.features.length
        ? res.features[0].attributes['score_sum']
        : null;

      // std values will be defined once the promise resolves
      // if score gets worse don't show results
      if(!tempScore || tempScore > this.stdTravelScore){
        this.scoreRoute.geometry = this.stdRoute.geometry;
        this.safetyTravelTime = this.stdTravelTime;
        this.safetyTravelScore = this.stdTravelScore;
      } else {
        this.safetyTravelTime = this.scoreRoute.attributes['Total_TravelTime'];
        this.safetyTravelScore = res.features[0].attributes['score_sum']
      }
      this.view.graphics.add(this.scoreRoute);
    });
  }

  // todo refactor to add to map and zoom to the extents then query data
  generateRoutes(){
    message.loading('Generating routes!', 0);
    loadModules([
      'esri/tasks/RouteTask',
      'esri/tasks/support/RouteParameters',
      'esri/tasks/support/FeatureSet',
      'esri/geometry/SpatialReference'
    ], options)
    .then(_ => {
      const pStdRoute = this.generateStdRoute();
      return Promise.all([
        pStdRoute,
        this.generateScoreRoute(pStdRoute)
      ])
    })
    // defer working with score results in case it adds more time
    .then( _ => {
      this.view.goTo([this.scoreRoute, this.stdRoute]);
      message.destroy();
    })
    .catch( er => {
      message.destroy();
      message.error('Error generating routes, please retry!');
      console.log(er);
    })

  }

  get safetyScoreDelta(){
    if(!this.stdTravelScore || !this.safetyTravelScore){
      return null;
    }
    return 100 * ((this.safetyTravelScore - this.stdTravelScore) / this.stdTravelScore);
  }

  get safetyTimeDelta(){
  if(!this.stdTravelTime || !this.safetyTravelTime){
    return null;
  }
  return 100 * ((this.safetyTravelTime - this.stdTravelTime) / this.stdTravelTime);
}

}

decorate(SafetyStore, {
  editMode: observable,
  startGraphic: observable,
  endGraphic: observable,
  startStr: observable,
  endStr: observable,
  startSearchResults: observable.ref,
  endSearchResults: observable.ref,
  isSketchLoaded: observable,
  stdTravelTime: observable,
  safetyTravelTime: observable,
  stdTravelScore: observable,
  safetyTravelScore: observable,
  onStartClick: action.bound,
  onEndClick: action.bound,
  load: action.bound,
  onCreateComplete: action.bound,
  setAddressFromGeocode: action.bound,
  generateRoutes: action.bound,
  generateStdRoute: action.bound,
  clearRouteData: action.bound,
  onAddressSearchChange: action.bound
})

export default SafetyStore;