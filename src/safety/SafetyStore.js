import Store from '../stores/Store';
import {decorate, observable, action } from 'mobx';

import {
  createSketchVM,
  suggestLocations,
  locationToAddress,
  magicKeyToLocation,
  jsonToGraphic,
  generateRoute,
  buffer,
  featuresIntoFeatureSet
} from '../services/MapService';

// number of barriers to account for when routing
const NUMBER_BARRIERS = 200;
// added_network_cost = eventvalue / RISK_SCALE_FACTOR 
const RISK_SCALE_FACTOR = 3;

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

  async load(mapViewDiv){
    const view = await super.load(mapViewDiv);
    this.sketchVM = await createSketchVM(view, {
      layer: view.graphics,
      pointSymbol: stopSymbol
    });
    this.sketchListener = this.sketchVM.on("create", this.onCreateComplete);
    this.isSketchLoaded = true;
    return view;
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

  async setAddressFromGeocode(stopType, graphic){
    let result;
    try {
      result = await locationToAddress(graphic.geometry);
    } catch(e){
      this.appState.onError(e, 'Could not convert point to address, please retry!');
    }
    if(!result) return;
    if(stopType === 'start') this.startStr = result.address;
    else if(stopType === 'end') this.endStr = result.address;
  }

  async onAddressSearchChange(value, isStart){
    if(isStart){
      this.startStr = value;
    } else {
      this.endStr = value;
    }
    if(!value) {
      if(isStart) this.startSearchResults = [];
      else this.endSearchResults = [];
      return;
    }
    let searchResults;
    try {
      searchResults = await suggestLocations(value, this.view.center);
    } catch(e) {
      this.appState.onError(e, 'Error looking for suggestions, please keep typing!');
    }
    if(!searchResults) return;
    if(isStart) this.startSearchResults = searchResults;
    else this.endSearchResults = searchResults;
  }

  async onAddressSearchSelect(magicKey, isStart){
    
    const res = await magicKeyToLocation(magicKey);
    if(!res || res.length < 1) this.appState.onError(null, 'Error getting the result');
    const address = res[0].address;

    console.log("HERE")
    const graphic = jsonToGraphic(
      {geometry: res[0].location},
      {symbol: stopSymbol}
    );
    console.log(graphic);

    if(isStart){
      if(this.startGraphic){
        this.view.graphics.remove(this.startGraphic);
      }
      this.startStr = address;
      this.startGraphic = graphic;
      this.view.graphics.add(this.startGraphic);
      this.endGraphic 
        ? this.view.goTo([this.startGraphic, this.endGraphic])
        : this.view.goTo(this.startGraphic);
    } else {
      if(this.endGraphic){
        this.view.graphics.remove(this.endGraphic);
      }
      this.endStr = address;
      this.endGraphic = graphic;
      this.view.graphics.add(this.endGraphic);
      this.startGraphic 
      ? this.view.goTo([this.startGraphic, this.endGraphic])
      : this.view.goTo(this.endGraphic);
    }

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

    generateRoute(this.startGraphic, this.endGraphic, {
      impedanceAttribute: 'Miles',
      accumulateAttributes: ['TravelTime']
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
    })
    .then(res => {
      if(res.features && res.features.length){
        this.stdTravelScore = res.features[0].attributes['score_sum']
      }
    });
  }

  generateScoreRoute(pStdRoute){
    this.lyrView.queryFeatures({
      where: "eventvalue > 0",
      geometry: this.view.extent,
      spatialRelationship: 'contains',
      orderByFields: ['eventvalue DESC'],
      returnGeometry: true,
      outFields: ['eventvalue', 'OBJECTID']
    })
    .then(qres => {
      const scorePolys = qres.features.slice(0, NUMBER_BARRIERS).map(f => ({
        geometry: buffer(f.geometry, 15, 'meters'),
        attributes: {
          Name: f.attributes['ObjectId'],
          BarrierType: 1,
          Attr_Miles: f.attributes['eventvalue'] / RISK_SCALE_FACTOR
        }
      }));
      const scorePolyFS = featuresIntoFeatureSet(scorePolys);
      return generateRoute(this.startGraphic, this.endGraphic, {
        polygonBarriers: scorePolyFS,
        impedanceAttribute: 'Miles',
        accumulateAttributes: ['TravelTime']
      });

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
    this.appState.loadingMessage('Generating routes!');

    const pStdRoute = this.generateStdRoute();
    Promise.all([
      pStdRoute,
      this.generateScoreRoute(pStdRoute)
    ])
    // defer working with score results in case it adds more time
    .then( _ => {
      this.view.goTo([this.scoreRoute, this.stdRoute]);
      this.appState.clearMessage();
    })
    .catch( er => {
      this.appState.onError(er, 'Error generating routes, please retry!');
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