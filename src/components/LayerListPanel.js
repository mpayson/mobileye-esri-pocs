import React from 'react';
import { observer } from "mobx-react";
import {
  Typography,
  Icon,
  Switch } from 'antd';
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';
import './LayerListPanel.css'

const { Text } = Typography;

let data = [{
  layer: "Hello"
},{
  layer: "World",
  sublayers: [{
    layer: "It's!"
  },{
    layer: "Max!"
  }]
}]

class ListLayer extends React.Component{

  onToggle = () => {
    this.props.onLayerToggle(this.props.layer);
  }

  render(){
    return(
      <div>
        <Switch
          onChange={this.onSwitchChange}
          className="layer-list-switch"/>
        <h3 className="layer-list-header">{this.props.layer}</h3>
      </div>
    )
  }
}

class ListSubLayer extends React.Component{
  
  onToggle = () => {
    this.props.onSubLayerToggle(this.props.sublayer, this.props.layer);
  }

  render(){
    return(
      <div>
        <Switch
          onChange={this.onSwitchChange}
          className="layer-list-switch layer-list-subswitch"
          size="small"/>
        <Text>{this.props.sublayer}</Text>
      </div>
    )
  }
}

const LayerPanel = observer(class LayerPanel extends React.Component{

  render(){
    const layerList = data;

    const layerListViews = layerList.map(l => {
      const view = <ListLayer layer={l.layer}/>
      if(!l.sublayers) return view;
      const subViews = l.sublayers.map(s => 
        <ListSubLayer layer={l} sublayer={s.layer}/>
      )
      return <>
        {view}
        {subViews}
      </>
    })

    return (
      <>
        <PanelCard
          icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
          title="Data"
          collapsible={true}
          defaultActive={true}>
          {layerListViews}
        </PanelCard>
      </>
    )
  }

});

export default LayerPanel;
