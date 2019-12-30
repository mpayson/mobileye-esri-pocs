import React from 'react';
import { observer } from "mobx-react";
import MinMaxSlideFilter from './filters/MinMaxSlideFilter';
import HistMinMaxSlideFilter from './filters/HistMinMaxSlideFilter';
import SelectFilter from './filters/SelectFilter';
import LayerFilterIcon from 'calcite-ui-icons-react/LayerFilterIcon';
import PanelCard from './PanelCard';
import { Collapse, Button, Icon, Popover } from 'antd';
import './FilterPanel.css';
const { Panel } = Collapse;

const getFilterView = (filter) => {
  const f = filter;
  switch(filter.type){
    case 'minmax':
      return f.hasHistograms
        ? <HistMinMaxSlideFilter store={f} key={f.field}/>
        : <MinMaxSlideFilter store={f} key={f.field} lowerBoundLabel={f.lowerBoundLabel} upperBoundLabel={f.upperBoundLabel}/>
    case 'multiselect':
      return <SelectFilter store={f} key={f.field} mode="multiple" style={f.style}/>
    case 'select':
      return <SelectFilter store={f} key={f.field} style={f.style}/>
    case 'quantile':
      return <SelectFilter store={f} key={f.field} mode="multiple" style={f.style}/>
    case 'dayofweek':
      return <SelectFilter store={f} key={f.field} style={f.style}/>
    default:
      throw new Error("Unknown filter type!");
  }
}

const customPanelStyle = {
  borderRadius: 4,
  border: 0
};

const FilterPanel = observer(class FilterPanel extends React.Component{

  state = {
    activeKeys: []
  }

  onAccordionChange = (keys) => {
    this.setState({
      activeKeys: keys
    })
  }

  onToggleClick = () => {
    if(this.state.activeKeys.length > 0){
      this.setState({
        activeKeys: []
      });
    } else {
      const keys = this.props.store.filters.map(f => f.field);
      this.setState({
        activeKeys: keys
      })
    }
  }

  render(){
    const filters = this.props.store.filters;
    const filterViews = filters.map(f => {
      const alias = f.isActive
        ? <span style={{color: '#00abbc'}}><b>{f.alias}</b></span>
        : f.alias;
      let header = f.infoText
        ? <>
            <Popover content={f.infoText} placement="topLeft">
              <Icon
                type="info-circle"
                style={{marginRight: "3px", color: f.isActive ? '#00abbc' : undefined}}/>
            </Popover>
            {alias}
          </>
        : alias;
      return (
        <Panel header={header} key={f.field} style={customPanelStyle} className='minimal-padding'>
          {getFilterView(f)}
        </Panel>
      )
    });

    const defaultActive = this.props.defaultActive || false;

    const activeKeys = this.props.activeFilterKeys || this.state.activeKeys;
    const onAccordionChange = this.props.onFilterAccordionChange || this.onAccordionChange;

    const panelOpen = this.props.panelOpen === undefined ? undefined : this.props.panelOpen;
    const onPanelChange = this.props.onPanelChange ? this.props.onPanelChange : undefined;
    const onToggleClick = this.props.onFilterToggleAllClick ? this.props.onFilterToggleAllClick : this.onToggleClick;

    const toggleButtonText = activeKeys.length > 0
    ? 'Close all'
    : 'Open all';

    return (
      <PanelCard
        title="Filter"
        icon={<LayerFilterIcon size="20" style={{position: "relative", top: "3px", left: "0px"}}/>}
        collapsible={true}
        open={panelOpen}
        onChange={onPanelChange}
        defaultActive={defaultActive}>
        <div style={{display: "inline-block", width: "100%", padding: "0px 15px 10px 5px"}}>
          <Button type="danger" size="small" ghost  onClick={this.props.store.clearFilters}>Clear</Button>
          <Button size="small" onClick={onToggleClick} style={{float: "right"}}>{toggleButtonText}</Button>
        </div>
          <Collapse
            activeKey={activeKeys}
            bordered={false}
            expandIconPosition='right'
            onChange={onAccordionChange}>
            {filterViews}
          </Collapse>
      </PanelCard>

    )
  }
  
});


export {getFilterView};
export default FilterPanel;