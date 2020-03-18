import Store from '../stores/Store';
import {debounce, buffer} from "../services/MapService";
import {autorun, decorate, computed, action, observable} from "mobx";
import { getRange } from '../utils/Utils';

class HumanMobilityStore extends Store{

  hourAutoplay = false;
  mouseResults = null;

  constructor(appState, storeConfig){
    super(appState, storeConfig);

    this.dayOfWeekFilter = this.filters.find(f => f.field === 'day_of_week');
    this.hourFilter = this.filters.find(f => f.field === 'hour');

    // these don't act like normal fields so manage them locally
    this.filters = this.filters.filter(f => 
      f.field !== 'day_of_week' && f.field !== 'hour'
    )

    this.dayOfWeekFilter.onValueChange('Weekdays');
    this.hourFilter.manualLoad();
  }

  destroy(){
    super.destroy();
    if(this.selectionHandler) this.selectionHandler();
    if(this.hourAutoplayId){
      clearTimeout(this.hourAutoplayId);
    }
    if(this._onMouseClickListener) this._onMouseClickListener.remove();
  }

  async load(mapViewDiv){
    await super.load(mapViewDiv);
    // don't want any side effects for now, so remove parent renderer handler
    if(this.rendererHandler) this.rendererHandler();
    if(this.effectHandler) this.effectHandler();
    if(this._tooltipListener) {
      this._tooltipListener.remove()
      this._tooltipListener = this.view.on("pointer-move", this._onMouseMove);
    };
    this._buildMobilityAutoRunEffects();
    this._onMouseClickListener = this.view.on("click", this._onMouseClick);
    return this.view;
  }

  _onMouseMove(evt){
    if(!this.mouseResults) super._onMouseMove(evt);
  }

  _buildMobilityAutoRunEffects(){
    const onRedefineRenderers = debounce(function(store, selectedField, selectedDays, selectedHours) {
      store.interactiveLayers.forEach(layer => {
        store._updateValueExpression(selectedField, selectedDays, selectedHours);
        store._updateRendererFields(layer);
      });
    });

    this.selectionHandler = autorun(_ => {
      // we want to update the renderer whenever selected field, days, or hours change
      // so explicitly passing those in as parameters
      onRedefineRenderers(this, this.rendererField, this.selectedDays, this.selectedHours);
    })
  }

  _updateValueExpression(id, selectedDays, selectedHours){
    let selectedStatsSumList = this._buildSelectedStatsSumList(id, selectedDays, selectedHours);
    //const valueExpression = "(" + selectedStatsSumList.join(" + ") + ")/"+selectedStatsSumList.length.toString();
    const valueExpression =
        "var fieldList = ['" + selectedStatsSumList.join("','") + "'];\n" +
        "var sum = 0;\n" +
        "var count = 0;\n" +
        "for(var k in fieldList){\n" +
        "  var field = fieldList[k];\n" +
        "  if (HasKey($feature,field)){\n" +
        "      if ($feature[field] != null && $feature[field] > 0)\n" +
        "        count++;\n" +
        "      sum += $feature[field];\n" +
        "  }\n" +
        "}\n" +
        "sum/count;"
    this.renderers[id].valueExpression =  valueExpression;
  }

  _buildSelectedStatsSumList(selectedStatId, selectedDays, selectedHours){
    var results = [];
    for (let day of selectedDays)
      for (let hour of selectedHours)
        for (let prefix of [selectedStatId]){
          results.push([prefix,day.toString(),hour.toString()].join("_"));
        }
    return results;
  }

  _onMouseClick(evt){
    if(!this.layersLoaded) return;
    this.clearMouseResults();
    const promise = (this._clickPromise = this.view
      .hitTest(evt)
      .then(hit => {
        if(promise !== this._clickPromise){
          return; // another test was performed
        }
        const results = hit.results.filter(
          r => !this.interactiveLayerIdSet.has(r.graphic.layer.id)
        );
        if(!results.length) return;

        super.clearTooltip();

        const graphic = results[0].graphic;

        const bufferSize = graphic.layer.id === 'bus_stops'
          ? 150
          : 50;
        const geometry = buffer(graphic.geometry, bufferSize, 'meters');
        // right now there's only one interactive layer, in future may need to iterate
        const lyrView = this.layerViewsMap.get(this.interactiveLayers[0].id);
        
        lyrView.effect = {
          filter: {
            geometry,
            spatialRelationship: "contains"
          },
          excludedEffect: "grayscale(80%) opacity(80%)",
          includedEffect: "brightness(150%)"
        };
        
        // this.view.graphics.add({
        //   geometry,
        //   symbol: {
        //     type: "simple-fill",
        //     color: [255,255,255, 0],
        //     style: "solid",
        //     outline: {
        //       color: [255,255,255,0.8],
        //       width: 1
        //     }
        //   }
        // });

        const graphicLV = this.layerViewsMap.get(graphic.layer.id);
        this._mouseResultHighlight = graphicLV.highlight(graphic);

        lyrView.queryFeatures({
          outFields: "*",
          geometry,
          spatialRelationship: "contains"
        })
        .then(qRes => {
          const title = graphic.layer.id === 'bus_stops'
            ? `Bus Stop ${graphic.attributes.CODI_CAPA}`
            : `Bike Lane ${graphic.attributes.TOOLTIP}`
          this.mouseResults = {
            graphics: qRes.features,
            title
          }
        })
        .catch(er => console.log(er));
      })
      
    )
  }

  clearMouseResults(){
    this.mouseResults = null;
    const lyrView = this.layerViewsMap.get(this.interactiveLayers[0].id);
    lyrView.effect = null;
    // this.view.graphics.removeAll();
    if(this._mouseResultHighlight){
      this._mouseResultHighlight.remove();
      this._mouseResultHighlight = null;
    }
  }

  startAutoplayTime(){
    this.hourAutoplay = true;
    this.hourFilter.increment(true);
    this.hourAutoplayId = setTimeout(this.startAutoplayTime, 5000);
  }

  stopAutoplayTime(){
    this.hourAutoplay = false;
    if(this.hourAutoplayId){
      clearTimeout(this.hourAutoplayId);
    }
  }

  toggleAutoplayTime(){
    if(this.hourAutoplay) this.stopAutoplayTime();
    else this.startAutoplayTime();
  }

  get selectedDays(){
    return this.dayOfWeekFilter.selectedDays;
  }

  get selectedHours(){
    let t = getRange(this.hourFilter.min, this.hourFilter.max);
    return(t);
  }

}

decorate(HumanMobilityStore, {
  hourAutoplay: observable,
  mouseResults: observable.ref,
  load: action.bound,
  startAutoplayTime: action.bound,
  stopAutoplayTime: action.bound,
  toggleAutoplayTime: action.bound,
  _onMouseClick: action.bound,
  _onMouseMove: action.bound,
  clearMouseResults: action.bound,
  selectedDays: computed,
  selectedHours: computed
})


export default HumanMobilityStore;