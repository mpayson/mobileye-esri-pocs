import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import HistMinMaxSlideFilter from '../components/HistMinMaxSlideFilter';
import MultiSelectFilter from "../components/MultiSelectFilter";

const LayerPanel = observer(class LayerPanel extends React.Component{

  render(){

    const FilterViews = this.props.store.filters.map(f => {
      switch(f.type){
        case 'minmax':
          return <HistMinMaxSlideFilter store={f} key={f.field}/>

        case 'multiselect':
          return <MultiSelectFilter store={f} key={f.field}/>

        default:
          throw new Error("Unknown filter type!");
      }
    })

    return (
      <>
        <Card size="small">
          <h1>Explore</h1>
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
