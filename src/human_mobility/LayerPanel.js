import React from 'react';
import { observer } from "mobx-react";
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';
import MinMaxSlideFilter from '../components/filters/MinMaxSlideFilter';
import {Switch, Radio} from "antd";


const LayerPanel = observer(class LayerPanel extends React.Component{

  // constructor(props, context){
  //   super(props, context);
  // }

  state = {
    layersActiveKeys: [],
    layersListLoaded: false,
    selectedDaysRadio: null,
  }

  layerDetail = new Map([
    [0,{'name':"average_speed", 'title':'Average Speed'}],
    [1,{'name':"pedestrian_density", 'title':'Pedestrians Density'}],
    [2,{'name':"bicycles_density", 'title':'Bicycles Density'}],
  ])

  days = new Map([['Weekend',[5,6]],['Weekdays',[0,1,2,3,4]],['Monday',[0]],['Tuesday',[1]],['Wednesday',[2]]
  ,['Thursday',[3]],['Friday',[4]],['Saturday',[5]],['Sunday',[6]]]);


  _onDaysRadioClick = (event) => {
    console.log('radio checked', event.target.value);
    this.setState({
      selectedDaysRadio: event.target.value,
    });
    this.dayOfWeekFilter = this.props.store.filters.find(f => f.field === 'day_of_week');
    const newValues = this.days.get(event.target.value);
    this.dayOfWeekFilter.onValueChange(newValues);
  }


  _onLayerSwitchClick = (checked, event, id) => {
    const switchId = event.target.id;
    let nextKeys = null;
    nextKeys = this.state.layersActiveKeys.slice();
    if (checked) {
      if (!this.state.layersActiveKeys.includes(switchId)){
        nextKeys.push(switchId);
        
        let layerIndexClicked = 0;
        this.layerDetail.forEach((value,index)=>{
          if (value.name === switchId){
            layerIndexClicked = index;
          }

        });
        console.log(layerIndexClicked)

        this.props.store.mapLayers.getItemAt(layerIndexClicked).visible = true;
      }
    }
    else {
      if (this.state.layersActiveKeys.includes(switchId)) {
        nextKeys.splice(nextKeys.indexOf(switchId), 1);
        let layerIndexClicked = 0;
        this.layerDetail.forEach((value,index)=>{
          if (value.name === switchId)
            layerIndexClicked = index;

        });
        this.props.store.mapLayers.getItemAt(layerIndexClicked).visible = false;
      }
    }
    this.setState({
      layersActiveKeys: nextKeys,
    })
    console.log(nextKeys)

  }

  componentDidUpdate(prevProps) {
    //this.state.selectedDaysRadio = "Weekdays";
    //this._onDaysRadioClick({target:{value:"Weekdays"}});
    // Typical usage (don't forget to compare props):
    if (this.props.store.mapLayers && this.props.store.mapLayers.length > 0 && !this.state.layersListLoaded) {
      this._onDaysRadioClick({target:{value:"Weekdays"}});
      this.props.store.mapLayers.items.forEach((layer, index) => {
        if (index !== 0)
          layer.visible = false;
        else{
          var nextKeys = this.state.layersActiveKeys.slice();
          nextKeys.push(this.layerDetail.get(index).name);
          this.setState({
            layersActiveKeys: nextKeys,
            layersListLoaded: true
          })      
        }
      });
    }
  }

  render(){

    let layers = null
    if (this.props.store.mapLayers && this.props.store.mapLayers.length > 0) {
  
      layers = this.props.store.mapLayers.map((layer, index) => {
        let label = this.layerDetail.get(index).title;
        const name = this.layerDetail.get(index).name
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
      }).items;
    }

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    let daysOptions;
    let radios = []
    this.days.forEach((value,key) => {
      radios.push(        <Radio value={key} key={key} style={radioStyle}>{key}</Radio>        )
    });

    daysOptions = (
    <Radio.Group onChange={this._onDaysRadioClick} value={this.state.selectedDaysRadio}>

    {radios}
      </Radio.Group>
    )
    
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
          {daysOptions}
          <br/>
        </PanelCard>
      </>
    )
  }

});

export default LayerPanel;
