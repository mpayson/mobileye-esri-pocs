import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import HistMinMaxSlideFilter from './HistMinMaxSlideFilter';

const LayerPanel = observer(class LayerPanel extends React.Component{

  state = {
    renderer: null
  }

  onSelectChange = (v) => {
    this.setState({renderer: v});
  }

  render(){

    return (
      <>
        <Card size="small">
          <h1>Explore</h1>
        </Card>
        <Card size="small" style={{marginTop: "10px"}}>
          <h1>Apply Filters</h1>
          <HistMinMaxSlideFilter
            store={this.props.store.filters[0]}/>
          <HistMinMaxSlideFilter
            store={this.props.store.filters[1]}/>
          <HistMinMaxSlideFilter
            store={this.props.store.filters[2]}/>
          <HistMinMaxSlideFilter
            store={this.props.store.filters[3]}/>
          <HistMinMaxSlideFilter
            store={this.props.store.filters[4]}/>
        </Card>
      </>
    )
  }

});

export default LayerPanel;
