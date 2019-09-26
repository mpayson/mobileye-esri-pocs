import {decorate, observable, action, computed, autorun} from 'mobx';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import Store from '../stores/Store';

const scoreStatQuery = {
  onStatisticField: 'eventvalue',
  outStatisticFieldName: 'score_sum',
  statisticType: 'sum'
}

class SafetyStore extends Store {
  editMode = null;
  startGraphic = null;
  endGraphic = null;
  startStr = '';
  endStr = '';
  isSketchLoaded = false;

  stdTravelTime = null;
  safetyTravelTime = null;
  stdTravelScore = null;
  safetyTravelScore = null;

  load(mapViewDiv){
    return super.load(mapViewDiv)
      .then(view => {
        loadModules(['esri/widgets/Sketch/SketchViewModel'], options)
          .then(([SketchVM]) => {
            this.sketchVM = new SketchVM({
              view,
              layer: view.graphics
            });
            this.sketchListener = this.sketchVM.on("create", this.onCreateComplete);
            this.isSketchLoaded = true;
          });
        return view;
      })
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
    });
  }

  // don't like this logic, re-write at some point #refactor!
  onCreateClick(e){
    if(e === 'start' && this.startGraphic){
      this.view.graphics.remove(this.startGraphic);
      this.startGraphic = null;
      this.editMode = e;
      this.startStr = '';
    }
    if(e === 'end' && this.endGraphic){
      this.view.graphics.remove(this.endGraphic);
      this.endGraphic = null;
      this.editMode = e;
      this.endStr = '';
    }
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
    loadModules([
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
        outSpatialReference: SpatialReference.WebMercator
      });
  
      routeParams.stops.features.push(this.startGraphic);
      routeParams.stops.features.push(this.endGraphic);
  
      return routeTask.solve(routeParams)
    })
    .then(data => {
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
    }).then(res => {
      if(res.features && res.features.length){
        this.stdTravelScore = res.features[0].attributes['score_sum']
      }
    });
  }

  generateScoreRoute(){
    const pQuery = this.lyrView.queryFeatures({
      where: "1=1",
      geometry: this.view.extent,
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

    Promise.all([pQuery, pModules])
    .then(([
      qres,
      [ RouteTask, RouteParameters, FeatureSet, SpatialReference,geometryEngine]
    ]) => {

      const routeTask = new RouteTask({
        url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
      });
  
      const routeParams = new RouteParameters({
        stops: new FeatureSet(),
        //polylineBarriers: new FeatureSet(),
        polygonBarriers: new FeatureSet(),
        outSpatialReference: SpatialReference.WebMercator
      });
  
      routeParams.stops.features.push(this.startGraphic);
      routeParams.stops.features.push(this.endGraphic);

      var scorepolys = qres.features.slice(0,100).map((f,i) => {
        var scorebuffer = {
          geometry: geometryEngine.geodesicBuffer(f.geometry, 15, "meters"),
          symbol: {type: "simple-fill", color: 'red'}
        }
        return scorebuffer;  
      });
      this.view.graphics.addMany(scorepolys);
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
      this.safetyTravelTime = this.scoreRoute.attributes['Total_TravelTime'];
      this.view.graphics.add(this.scoreRoute);
      return this.lyrView.queryFeatures({
        where: "1=1",
        geometry: this.scoreRoute.geometry,
        outStatistics: [scoreStatQuery]
      })
    }).then(res => {
      if(res.features && res.features.length){
        this.safetyTravelScore = res.features[0].attributes['score_sum']
      }
    });
  }

   generateRoutes(){
    
    loadModules([
      'esri/tasks/RouteTask',
      'esri/tasks/support/RouteParameters',
      'esri/tasks/support/FeatureSet',
      'esri/geometry/SpatialReference'
    ], options)
    .then(_ => {
      this.generateStdRoute();
      this.generateScoreRoute();
    });

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
  generateStdRoute: action.bound
})

export default SafetyStore;