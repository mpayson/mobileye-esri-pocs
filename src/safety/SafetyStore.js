import {decorate, observable, action, computed, autorun} from 'mobx';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import Store from '../stores/Store';


class SafetyStore extends Store {
  editMode = null;
  startGraphic = null;
  endGraphic = null;
  startStr = '';
  endStr = '';
  isSketchLoaded = false;

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

  // don't like this logic, re-write at some point
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

}

decorate(SafetyStore, {
  editMode: observable,
  startGraphic: observable,
  endGraphic: observable,
  startStr: observable,
  endStr: observable,
  isSketchLoaded: observable,
  onStartClick: action.bound,
  onEndClick: action.bound,
  load: action.bound,
  onCreateComplete: action.bound,
  setAddressFromGeocode: action.bound
})

export default SafetyStore;