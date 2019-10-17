import React from 'react';
import { observer } from "mobx-react";
import MinMaxSlideFilter from './MinMaxSlideFilter';
import HistMinMaxSlideFilter from '../components/HistMinMaxSlideFilter';
import SelectFilter from '../components/SelectFilter';
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
      return <SelectFilter store={f} key={f.field} mode="multiple"/>
    case 'select':
      return <SelectFilter store={f} key={f.field}/>
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
        ? <span style={{color: '#1890ff'}}><b>{f.alias}</b></span>
        : f.alias;
      let header = f.infoText
        ? <> 
            <Popover content={f.infoText}>
              <Icon type="info-circle" style={{marginRight: "3px"}}/>
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

    const toggleButtonText = this.state.activeKeys.length > 0
      ? 'Close all'
      : 'Open all';

    return (
      <PanelCard
        title="Filters"
        icon={<LayerFilterIcon size="20" style={{position: "relative", top: "3px", left: "0px"}}/>}
        collapsible={true}>
          <Collapse
            activeKey={this.state.activeKeys}
            bordered={false}
            expandIconPosition='right'
            onChange={this.onAccordionChange}>
            {filterViews}
          </Collapse>
          <div style={{display: "inline-block", width: "100%", padding: "10px 15px 0px 5px"}}>
            <Button type="danger" size="small" ghost  onClick={this.props.store.clearFilters}>Clear</Button>
            <Button size="small" onClick={this.onToggleClick} style={{float: "right"}}>{toggleButtonText}</Button>
          </div>
      </PanelCard>

    )
  }
  
});

export default FilterPanel;