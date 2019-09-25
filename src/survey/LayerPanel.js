import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import HistMinMaxSlideFilter from '../components/HistMinMaxSlideFilter';
import SelectFilter from '../components/SelectFilter';

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
    })

    return (
      <>
        <Card size="small" style={{marginTop: "10px"}}>
          <h1>Apply Filters</h1>
          {FilterViews}
        </Card>
      </>
    )
  }

});

export default LayerPanel;
