import React from 'react';
import { observer } from "mobx-react";
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';
import MinMaxSlideFilter from '../components/filters/MinMaxSlideFilter';

import {LayerList} from '../components/LayerListPanel';
import {getFilterView} from '../components/FilterPanel';

const LayerPanel = observer(class LayerPanel extends React.Component{

  constructor(props, context){
    super(props, context);
    this.dayOfWeekFilter = this.props.store.filters.find(f => f.field === 'day_of_week');
  }

  render(){

    const dayFilterView = getFilterView(this.dayOfWeekFilter);

    return (
      <>
        <PanelCard
          icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
          title="Layer Selection"
          collapsible={true}
          defaultActive={true}>
          <LayerList store={this.props.store}/>
          <br/>
          <h3 style={{display: "inline-block", margin: "0px 0px 10px 0px"}}>Days of week:</h3>
          {dayFilterView}
          <br/>
        </PanelCard>
      </>
    )
  }

});

export default LayerPanel;
