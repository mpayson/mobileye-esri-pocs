import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import HistogramComponent from '../components/HistogramComponent';

const HistogramPanel = observer(class HistogramPanel extends React.Component{

  render(){

    const HistogramViews = this.props.store.histograms.map(f => 
          <HistogramComponent store={f} key={f.field}/>
        )

    return (
      <>
        <Card size="small" style={{marginTop: "10px"}}>
          <h1>Histograms</h1>
          {HistogramViews}
        </Card>
      </>
    )
  }

});

export default HistogramPanel;
