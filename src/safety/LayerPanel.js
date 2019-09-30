import React from 'react';
import { observer } from "mobx-react";
import { Card, Select } from 'antd';
import FilterPanel from '../components/FilterPanel';
const { Option, OptGroup } = Select;

const LayerPanel = observer(class LayerPanel extends React.Component{

  render(){

    let parentOptionView, factorOptionView, value;
    if(this.props.store.aliasMap){
      const [
        parentOptions,
        componentOptions
      ] = this.props.store.rendererOptions.reduce((acc, o) => {
        const [p, c] = acc;
        if(o === 'eventvalue'){
          const optComponent = <Option key={o}><b>{this.props.store.aliasMap.get(o)}</b></Option>
          p.push(optComponent);
        } else {
          const optComponent = <Option key={o}>{this.props.store.aliasMap.get(o)}</Option>
          c.push(optComponent);
        }
        return([p, c]);
      }, [[],[]]);
      parentOptionView = parentOptions[0];
      factorOptionView = (
        <OptGroup label="Contributing factors">
          {componentOptions}
        </OptGroup>
      );
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
            size="large"
            value={value}>
            {parentOptionView}
            {factorOptionView}
          </Select>
        </Card>
        <FilterPanel store={this.props.store}/>
      </>
    )
  }

});

export default LayerPanel;
