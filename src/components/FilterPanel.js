import React from 'react';
import { observer } from "mobx-react";
import HistMinMaxSlideFilter from '../components/HistMinMaxSlideFilter';
import SelectFilter from '../components/SelectFilter';
import { Collapse, Card } from 'antd';
const { Panel } = Collapse;

const getFilterView = (filter) => {
  const f = filter;
  switch(filter.type){
    case 'minmax':
      return <HistMinMaxSlideFilter store={f} key={f.field}/>
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
  border: 0,
};

const FilterPanel = observer(class FilterPanel extends React.Component{

  render(){
    const filters = this.props.store.filters;
    const filterViews = filters.map(f => {
      const alias = f.isActive
        ? <span style={{color: '#1890ff'}}><b>{f.alias}</b></span>
        : f.alias;

      return (
        <Panel header={alias} key={f.field} style={customPanelStyle}>
          {getFilterView(f)}
        </Panel>
      )
    });

    return (
      <Card size="small" style={{marginTop: "10px"}}>
        <h1>Apply Filters</h1>
        <Collapse bordered={false} expandIconPosition='right'>
        {filterViews}
        </Collapse>
      </Card>
    )
  }
  
});

export default FilterPanel;