import React from 'react';
import { observer } from "mobx-react";
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';
import SelectFilter from '../components/filters/SelectFilter';
import eventsConfig from "../events/EventsConfig";
import {Radio} from "antd";
const RadioGroup = Radio.Group;


const LayerPanel = observer(class LayerPanel extends React.Component{

  constructor(props, context){
    super(props, context);
    this.eventFilter = props.store.filters.find(f => f.field === 'eventType');
    this.expirationFilter = props.store.filters.find(f => f.field === 'eventExpirationTimestamp');

  }

  state = {
    selectedExpirationRadio: 'Live',
  };

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
    const expirationOptions = ['Live','Last hour','Last 5 hours', 'Last 24 hours']
    const expirationOptionsRadios = expirationOptions.map(entry =>
        <Radio value={entry} key={entry} style={radioStyle}>{entry}</Radio>
    )
    const statsListGroup =
      <RadioGroup onChange={this._onRadioClick} value={this.state.selectedExpirationRadio}>
        {expirationOptionsRadios}
      </RadioGroup>;


    return (
      <>
        <PanelCard
          //icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
          //title="Event type"
          collapsible={false}
          defaultActive={true}>
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
