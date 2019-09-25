import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import HistMinMaxSlideFilter from '../components/HistMinMaxSlideFilter';
import SelectFilter from '../components/SelectFilter';
import { Select } from 'antd';
const { Option } = Select;

const LayerPanel = observer(class LayerPanel extends React.Component{

  render(){

    const FilterViews = this.props.store.filters.map(f => {
      switch(f.type){
        case 'minmax':
          return <HistMinMaxSlideFilter store={f} key={f.field}/>
        case 'multiselect':
          return <SelectFilter store={f} key={f.field} mode="multiple"/>
        case 'select':
          return <SelectFilter store={f} key={f.field}/>
        default:
          throw new Error("Unknown filter type!");
      }
    });

    let options, value;
    if(this.props.store.aliasMap){
      options = this.props.store.rendererOptions.map(o => {
        return <Option key={o}>{this.props.store.aliasMap.get(o)}</Option>
      });
      value = this.props.store.aliasMap.get(this.props.store.rendererField);
    }

    return (
      <>
        <Card size="small">
          <h1>Explore</h1>
          <Select
            disabled={!this.props.store.aliasMap}
            style={{ width: '100%' }}
            placeholder="Please select"
            onChange={this.props.store.setRendererField}
            value={value}>
            {options}
          </Select>
        </Card>
        <Card size="small" style={{marginTop: "10px"}}>
          <h1>Apply Filters</h1>
          {FilterViews}
        </Card>
      </>
    )
  }

});

export default LayerPanel;
