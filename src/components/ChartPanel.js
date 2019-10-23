import React from 'react';
import { observer } from "mobx-react";
import BarChart from './charts/BarChart';
import PanelCard from './PanelCard';
import GraphHistogramIcon from 'calcite-ui-icons-react/GraphHistogramIcon';
import './FilterPanel.css';

const getChartView = (chart, store) => {
  const c = chart;
  switch(c.type){
    case 'bar':
      return <BarChart config={c} store={store}/>
    default:
      throw new Error("Unknown chart type!");
  }
}

const FilterPanel = observer(class FilterPanel extends React.Component{

  render(){
    const charts = this.props.store.charts;
    const chartViews = charts.map(c => 
      <div key={c.id}>
        <h4>{c.title}</h4>
        {getChartView(c, this.props.store)}
      </div>
    );

    return (
      <PanelCard
        title="Charts"
        icon={<GraphHistogramIcon size="20" style={{position: "relative", top: "3px", left: "0px"}}/>}
        collapsible={true}
        defaultActive={true}>
        {chartViews}
      </PanelCard>

    )
  }
  
});

export default FilterPanel;