import React from 'react';
import { observer } from "mobx-react";
import {
  Switch,
  Typography } from 'antd';
import FilterPanel from '../components/FilterPanel';
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';

const { Text } = Typography;


const LayerPanel = observer(class LayerPanel extends React.Component{

  constructor(props, context){
    super(props, context);
    this.eventFilter = props.store.filters.find(f => f.field === 'eventsubtype');
  }

  render(){

    let domainMap = this.eventFilter.domainMap;
    let eventOptions = this.eventFilter.options.map(o => {
      let text = domainMap.has(o) ? domainMap.get(o) : o;
      return (
        <div key={o} style={{margin: "5px 0px 0px 10px"}}>
          <Switch
            size="small"
            style={{float: "left", marginTop: "4px"}}/>
          <Text style={{margin: "0px 0px 0px 5px"}}>{text}</Text>
        </div>
      )
    })

    return (
      <>
        <PanelCard
          icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
          title="Data"
          collapsible={true}
          defaultActive={true}>
          <Switch
            onChange={this.onSwitchChange}
            style={{float: "left", marginTop: "1px"}}/>
          <h3 style={{display: "inline-block", margin: "0px 0px 2px 10px"}}>Road Safety Score</h3>
          {eventOptions}
        </PanelCard>
      </>
    )
  }

});

export default LayerPanel;