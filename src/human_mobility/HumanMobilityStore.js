import Store from '../stores/Store';
import {debounce} from "../services/MapService";
import {autorun, decorate, computed, action, observable} from "mobx";
import { getRange } from '../utils/Utils';

class HumanMobilityStore extends Store{

  hourAutoplay = false;

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
  }

  async load(mapViewDiv){
    await super.load(mapViewDiv);
    // don't want any side effects for now, so remove parent renderer handler
    if(this.rendererHandler) this.rendererHandler();
    this._buildMobilityAutoRunEffects();
    return this.view;
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
  load: action.bound,
  startAutoplayTime: action.bound,
  stopAutoplayTime: action.bound,
  toggleAutoplayTime: action.bound,
  selectedDays: computed,
  selectedHours: computed
})


export default HumanMobilityStore;