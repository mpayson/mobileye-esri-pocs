import React from 'react';
import { observer } from "mobx-react";
import {
  Switch 
} from 'antd';
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';
import './LayerListPanel.css'

const LayerListItem = observer(class ListLayer extends React.Component{

  onToggle = () => {
    this.props.store.toggleLayerVisibility(this.props.layer);
  }

  render(){
    
    const visibleMap = this.props.store.layerVisibleMap;
    const l = this.props.layer;
    const isVisible = visibleMap.has(l.id) && visibleMap.get(l.id);

    return(
      <div>
        <Switch
          defaultChecked={true}
          checked={isVisible}
          onChange={this.onToggle}
          className="layer-list-switch"/>
        <h3 className="layer-list-header">{this.props.layer.title}</h3>
      </div> 
    )
  }
});

const LayerList = observer(({store}) => {
  const layerItems = store.interactiveLayers.map(l => 
    <LayerListItem key={l.id} layer={l} store={store}/>
  );
  return (
    <>
      {layerItems}
    </>
  )
})

const LayerListPanel = observer(({store}) => (
  <PanelCard
    icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
    title="Layer List"
    collapsible={true}
    defaultActive={true}>
    <LayerList store={store}/>
  </PanelCard>
));

export {LayerList};
export default LayerListPanel;
