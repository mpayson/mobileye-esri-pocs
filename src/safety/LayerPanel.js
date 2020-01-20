import React from 'react';
import { observer } from "mobx-react";
import { Radio } from 'antd';
import FilterPanel from '../components/FilterPanel';
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';


const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const LayerPanel = observer(class LayerPanel extends React.Component{

  state = {
    filterActiveKeys: [],
    filterPanelOpen: false
  }

  _updateAccordionForRender = (rendererField) => {
    if(this.state.filterActiveKeys.includes(rendererField)) return;
    const nextKeys = this.state.filterActiveKeys.slice();
    nextKeys.push(rendererField);
    this.setState({
      filterActiveKeys: nextKeys,
      filterPanelOpen: true
    })
  }

  onRadioChange = (e) => {
    const renderer = e.target.value;
    this.props.store.setRendererField(renderer);
    this._updateAccordionForRender(renderer);
  }

  onFilterAccordionClick = (keys) => {
    this.setState({
      filterActiveKeys: keys
    });
  }

  onFilterToggleAllClick = () => {
    if(this.state.filterActiveKeys.length > 0){
      this.setState({
        filterActiveKeys: []
      });
    } else {
      const keys = this.props.store.filters.map(f => f.field);
      this.setState({
        filterActiveKeys: keys
      })
    }
  }

  onFilterPanelChange = () => {
    const isOpen = !this.state.filterPanelOpen;
    this.setState({
      filterPanelOpen: isOpen
    })
  }

  render(){

    let radioOptions;
    if(this.props.store.aliasMap){
      radioOptions = this.props.store.rendererOptions
        .map(o => 
          <Radio value={o} key={o} style={radioStyle}>{this.props.store.aliasMap.get(o)}</Radio>
        )
    }

    const radioValue = this.props.store.rendererField;

    return (
      <>
        <PanelCard
          icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
          title="GIS Layers"
          collapsible={true}
          defaultActive={true}>
          <Radio.Group
            onChange={this.onRadioChange}
            value={radioValue}>
            {radioOptions}
          </Radio.Group>
        </PanelCard>
        <FilterPanel
          store={this.props.store}
          panelOpen={this.state.filterPanelOpen}
          onPanelChange={this.onFilterPanelChange}
          activeFilterKeys={this.state.filterActiveKeys}
          onFilterAccordionChange={this.onFilterAccordionClick}
          onFilterToggleAllClick={this.onFilterToggleAllClick}/>
      </>
    )
  }

});

export default LayerPanel;
