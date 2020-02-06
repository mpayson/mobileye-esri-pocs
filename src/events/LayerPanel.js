import React from 'react';
import { observer } from "mobx-react";
import PanelCard from '../components/PanelCard';
import LayerFilterIcon from 'calcite-ui-icons-react/LayerFilterIcon';
import SelectFilter from '../components/filters/SelectFilter';
import {Radio, Switch} from "antd";
const RadioGroup = Radio.Group;


const LayerPanel = observer(class LayerPanel extends React.Component{

  constructor(props, context){
    super(props, context);
    this.eventFilter = props.store.filters.find(f => f.field === 'eventType');
    this.expirationFilter = props.store.filters.find(f => f.field === 'eventExpirationTimestamp');
    this.state = this._initState(props);
  }

  _initState(props) {
    const speedLayer = props.store.layers.find(l => l.id === 'speed');
    const speedLayerView = props.store.layerViewsMap.get('speed');

    return {
      eventsLifeSpanHours: this._parseExpirationHours(),
      speedRendererField: speedLayer ? speedLayer.renderer.field : 'avg_last_hour',
      showSpeed: speedLayerView ? speedLayerView.visible : true,
    };
  }

  _parseExpirationHours() {
    const daysBack = this.expirationFilter.min.match(/(\d+.?\d*)$/);
    return daysBack && daysBack[0] ? Math.round(daysBack[0] * 24).toString() : '0';
  }

  _onShowSpeedToggle = e => {
    this.setState({
      showSpeed: e,
    });
    this.props.store.layerViewsMap.forEach(lV => {
      const id = lV.layer.id;
      if (id === "speed") {
          lV.visible = e;
      }
    });

  }
  _onSpeedRadioClick = e => {
    const rendererField = e.target.value;
    this.setState({
      speedRendererField: rendererField
    });

    this.props.store.layers.forEach(layer => {
        if (layer.id === "speed") {
            layer.renderer.field = rendererField;
        }
    })
    this._updateSpeedLayerFilter(rendererField);
  }

  _updateSpeedLayerFilter(rendererField){
    this.props.store.layerViewsMap.forEach(lV => {
      const id = lV.layer.id;
      if (id === "speed") {
          lV.filter = {where: rendererField + " > 0"};
      }
    });
  }

  _onRadioClick = e => {
    const hoursBack = e.target.value;
    this.setState({
      eventsLifeSpanHours: hoursBack,
    });
    const daysForward = hoursBack === '0' ? 3 : 0;
    const daysBack = parseInt(hoursBack) / 24;
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

    const speedOptions = {
      'avg_last_15_min':  'Last 15 minutes',
      'avg_last_hour':    'Last hour',
      'avg_last_3_hours': 'Last 3 hours',
    }
    const speedOptionsRadios = Object.entries(speedOptions).map(([value, label]) =>
        <Radio value={value} key={value} style={radioStyle}>{label}</Radio>
    )
    const speedListGroup =
      <RadioGroup onChange={this._onSpeedRadioClick} value={this.state.speedRendererField}>
        {speedOptionsRadios}
      </RadioGroup>;

    const expirationOptions = {
      '0':  'Live',
      '1':  'Last hour',
      '5':  'Last 5 hours',
      '24': 'Last 24 hours',
    }
    const expirationOptionsRadios = Object.entries(expirationOptions).map(([value, label]) =>
        <Radio value={value} key={value} style={radioStyle}>{label}</Radio>
    )
    const statsListGroup =
      <RadioGroup onChange={this._onRadioClick} value={this.state.eventsLifeSpanHours}>
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
