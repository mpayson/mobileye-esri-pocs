import React from 'react';
import { observer } from "mobx-react";
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';
import MinMaxSlideFilter from '../components/filters/MinMaxSlideFilter';
import {getFilterView} from '../components/FilterPanel';
import {Switch} from "antd";


const LayerPanel = observer(class LayerPanel extends React.Component{

  constructor(props, context){
    super(props, context);
    this.dayOfWeekFilter = props.store.filters.find(f => f.field === 'day_of_week');
  }

  state = {
    layersActiveKeys: [],
    layersListLoaded: false,
  }


  _onLayerSwitchClick = (checked, event, id) => {
    const switchId = event.target.id;
    let nextKeys = null;
    nextKeys = this.state.layersActiveKeys.slice();
    if (checked) {
      if (!this.state.layersActiveKeys.includes(switchId)){
        nextKeys.push(switchId);
        
        let layerIndexClicked = 0;
        this.props.store.layersConfig.forEach((value,index)=>{
          if (value.name === switchId){
            layerIndexClicked = index;
          }

        });
        this.props.store.mapLayers.getItemAt(layerIndexClicked).visible = true;
      }
    }
    else {
      if (this.state.layersActiveKeys.includes(switchId)) {
        nextKeys.splice(nextKeys.indexOf(switchId), 1);
        let layerIndexClicked = 0;
        this.props.store.layersConfig.forEach((value,index)=>{
          if (value.name === switchId)
            layerIndexClicked = index;

        });
        this.props.store.mapLayers.getItemAt(layerIndexClicked).visible = false;
      }
    }
    this.setState({
      layersActiveKeys: nextKeys,
    })
  }

  componentDidUpdate(prevProps) {
    //this.state.selectedDaysRadio = "Weekdays";
    //this._onDaysRadioClick({target:{value:"Weekdays"}});
    // Typical usage (don't forget to compare props):
    if (this.props.store.mapLayers && this.props.store.mapLayers.length > 0 && !this.state.layersListLoaded) {
      this.dayOfWeekFilter.onValueChange('Weekdays');
      var nextKeys = this.state.layersActiveKeys.slice();
      this.props.store.mapLayers.items.forEach((layer, index) => {
        const layerConfig = this.props.store._getLayerConfigById(index);
        if (!["average_speed","bicycles_lanes"].includes(layerConfig.name))
          layer.visible = false;
        else{
          nextKeys.push(layerConfig.name);
        }
      });
      console.log(nextKeys);
      if (nextKeys.length > 0) {
        this.setState({
          layersActiveKeys: nextKeys,
          layersListLoaded: true
        })
      }

    }
  }

  render(){

    let layers = null
    if (this.props.store.mapLayers && this.props.store.mapLayers.length > 0) {
  
      layers = this.props.store.mapLayers.map((layer, index) => {
       let label = this.props.store._getLayerConfigById(index).title;
       const name = this.props.store._getLayerConfigById(index).name;
       const showFilter = this.props.store._getLayerConfigById(index).showFilter;
        if(showFilter){
        return (
          <div key={name}>
            <Switch
                key={name}
                id={name}
                onChange={this._onLayerSwitchClick}
                checked={this.state.layersActiveKeys.includes(name)}
                style={{float: "left", marginTop: "1px"}}/>
            <h3 style={{display: "inline-block", margin: "0px 0px 2px 10px"}}>{label}</h3>
          
          </div>
        )
        }
      }).items;
    }

    this.hourFilter = this.props.store.filters.find(f => f.field === 'agg_hour');
    const hoursSlider = (<MinMaxSlideFilter store={this.hourFilter} key={this.hourFilter.field} lowerBoundLabel={this.hourFilter.lowerBoundLabel} upperBoundLabel={this.hourFilter.upperBoundLabel}/>)
    return (
      <>
        <PanelCard
          icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
          title="Layer Selection"
          collapsible={true}
          defaultActive={true}>
          {layers}
          <br/>
          <h3 style={{display: "inline-block", margin: "0px 0px 10px 0px"}}>Days of week:</h3>
            {getFilterView(this.dayOfWeekFilter)}
          <br/>
        </PanelCard>
      </>
    )
  }

});

export default LayerPanel;
