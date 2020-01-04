import Store from '../stores/Store';
import humanMobilityConfig from "./HumanMobilityConfig";
import {debounce} from "../services/MapService";
import {autorun} from "mobx";

class HumanMobilityStore extends Store{
  _getRange(min,max){
    return (new Array(max - min + 1)).fill(undefined).map((_, i) => i + min)
  }
  constructor(appState, storeConfig){
    super(appState, storeConfig);
    this.dayOfWeekFilter = this.filters.find(f => f.field === 'day_of_week');
    this.hourFilter = this.filters.find(f => f.field === 'hour');
    this.dayOfWeekFilter.onValueChange('Weekdays');
    this.selectedDays = this.dayOfWeekFilter.dayMap.get('Weekdays')
    this.selectedHours = this._getRange(this.hourFilter.min, this.hourFilter.max);
  }

  get where() {
      return "1=1";
  }

  _updateValueExpression(id){
    let selectedStatsSumList = this._buildSelectedStatsSumList(id);
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
    console.log(valueExpression);

  }

  _buildSelectedStatsSumList(selectedStatId){
    var results = [];
    for (let day of this.selectedDays)
      for (let hour of this.selectedHours)
        for (let prefix of [selectedStatId]){
          results.push([prefix,day.toString(),hour.toString()].join("_"));
        }
    return results;
  }

  _buildAutoRunEffects() {
    const onApplyFilter = debounce(function (store) {
      store.selectedHours = (new Array(store.hourFilter.max - store.hourFilter.min + 1)).fill(undefined).map((_, i) => i + store.hourFilter.min);
      store.selectedDays = store.dayOfWeekFilter.dayMap.get(store.dayOfWeekFilter.selectValue);
      if ((store.map && store.map.layers.length > 0)) {
          store.mapLayers.forEach((layer,key) => {
            if(store._getLayerConigById(key).type !== 'static') {
              store._updateValueExpression(store.rendererField);
              store._updateRendererFields(layer);
            }
          });



      }

    });
    this.effectHandler = autorun(_ => {
        const where = this.where;
        if (this.mapLayers && this.layerViewsMap && onApplyFilter) {
            onApplyFilter(this);
        }
    });

    this.rendererHandler = autorun(_ => {
        const rendererField = this.rendererField;
        // only interactive layers will have updated renderers
        console.log("updating rendererField");

        if ((this.map && this.map.layers.length > 0)) {
            this.mapLayers.forEach((layer,key) => {
              if(this._getLayerConigById(key).type !== 'static') {
                this._updateRendererFields(layer);
              }
            });
        }
    })


  }
}

export default HumanMobilityStore;