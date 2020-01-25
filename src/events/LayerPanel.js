import React from 'react';
import { observer } from "mobx-react";
import PanelCard from '../components/PanelCard';
import LayerFilterIcon from 'calcite-ui-icons-react/LayerFilterIcon';
import SelectFilter from '../components/filters/SelectFilter';
import eventsConfig from "../events/EventsConfig";
import {Radio, Switch} from "antd";
const RadioGroup = Radio.Group;


const LayerPanel = observer(class LayerPanel extends React.Component{

  constructor(props, context){
    super(props, context);
    this.eventFilter = props.store.filters.find(f => f.field === 'eventType');
    this.expirationFilter = props.store.filters.find(f => f.field === 'eventExpirationTimestamp');
    this.speedValueFilter = props.store.filters.find(f => f.field === this.state.speedRendererField);
  }

  state = {
    selectedExpirationRadio: 'Live',
    selectedSpeedRadio: 'Last hour',
    speedRendererField: 'avg_last_hour',
    showSpeed: true,
  };

  _onShowSpeedToggle = e => {
    console.log(e)
    this.setState({
      showSpeed: e,
    });
    this.props.store.layerViewsMap.forEach(lV => {
      const id = lV.layer.id;
      if (id == "speed") {
          lV.visible = e;
      }
    });

  }
  _onShowSpeedRadioClick = e => {
    var rendererField = "";
    switch(e.target.value) {
        case 'Last 15 minutes':
            rendererField = 'avg_last_15_min';
            break;
        case 'Last hour':
            rendererField = 'avg_last_hour';
            break;
        case 'Last 3 hours':
            rendererField = 'avg_last_3_hours';
            break;
        default:
    }
    this.setState({
      selectedSpeedRadio: e.target.value,
      speedRendererField: rendererField
    });

    this._updateSpeedLayerFilter(rendererField);

  }

  _updateSpeedLayerFilter(rendererField){
    this.props.store.layerViewsMap.forEach(lV => {
      const id = lV.layer.id;
      if (id == "speed") {
          lV.filter = {where: rendererField + " > 0"};
      }
    });
  }

  _onRadioClick = e => {
    this.setState({
      selectedExpirationRadio: e.target.value,
    });
    var hoursBack;
    var daysForward = 0;
    switch(e.target.value) {
        case 'Live':
            hoursBack = 0;
            daysForward = 3;
            break;
        case 'Last hour':
            hoursBack = 1;
            break;
        case 'Last 5 hours':
            hoursBack = 5;
            break;
        case 'Last 24 hours':
            hoursBack = 24;
            break;
        default:
    }
    const daysBack = hoursBack / 24;
    this.expirationFilter.max = "CURRENT_TIMESTAMP + " + daysForward.toString();
    this.expirationFilter.min = "CURRENT_TIMESTAMP - " + daysBack.toString();
  }

  render(){

    const eventOptions =  (
      <SelectFilter 
          store={this.eventFilter} 
          mode={this.eventFilter.mode} 
          style= {this.eventFilter.style} 
          key={this.eventFilter.field} 
          id={this.eventFilter.field}
      />
    );

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }

    const speedOptions = ['Last 15 minutes','Last hour','Last 3 hours']
    const speedOptionsRadios = speedOptions.map(entry =>
        <Radio value={entry} key={entry} style={radioStyle}>{entry}</Radio>
    )
    const speedListGroup =
      <RadioGroup onChange={this._onShowSpeedRadioClick} value={this.state.selectedSpeedRadio}>
        {speedOptionsRadios}
      </RadioGroup>;


    const expirationOptions = ['Live','Last hour','Last 5 hours', 'Last 24 hours']
    const expirationOptionsRadios = expirationOptions.map(entry =>
        <Radio value={entry} key={entry} style={radioStyle}>{entry}</Radio>
    )
    const statsListGroup =
      <RadioGroup onChange={this._onRadioClick} value={this.state.selectedExpirationRadio}>
        {expirationOptionsRadios}
      </RadioGroup>;

    const wrapperStyles = {display: "flex", alignItems: "center", height: "32px"}
    const showSpeedSwitch =
        <div style={wrapperStyles} key="showSpeed">
          <Switch
              id="showSpeed"
              onChange={this._onShowSpeedToggle}
              checked={this.state.showSpeed}
              style={{marginRight: "10px"}}
              size="small"
          />
          <div style={{lineHeight: 1.15}}>Average Speed:</div>
        </div>
    return (

      <>
        <PanelCard
          title="Filters"
          icon={<LayerFilterIcon size="20" style={{position: "relative", top: "3px", left: "0px"}}/>}
          collapsible={false}
          defaultActive={true}>
          {showSpeedSwitch}
          {speedListGroup}
          <br/>
          <br/>
          <h3 style={{display: "inline-block", margin: "0px 0px 10px 0px"}}>Events expiration:</h3>
          {statsListGroup}
          <br/>
          <br/>
          <h3 style={{display: "inline-block", margin: "0px 0px 10px 0px"}}>Event type:</h3>
          {eventOptions}
        </PanelCard>
      </>
    )
  }

});

export default LayerPanel;
