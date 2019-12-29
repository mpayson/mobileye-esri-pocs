import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import { Statistic, Col } from 'antd';
import humanMobilityConfig from './HumanMobilityConfig';

const HumanMobilityTooltip = observer(({store}) => {

  if(!store.tooltipResults){
    return null;
  }
  const {
    graphic,
    queryResults
  } = store.tooltipResults;

  const style = {
    display: 'block',
    position: 'absolute',
    top: '25px',
    right: '55px',
    width: '260px',
    height: '200px',
    overflow: 'auto',
    zIndex: '99',
    pointerEvents: 'none'
  }
  if(!graphic) style.display = 'none';
  const attrs = queryResults[0].attributes;

  const infoContent = humanMobilityConfig.layers.map(f =>
        <Col key={f.name} span={12}>
          <Statistic title={f.title} value={Math.round(attrs[f.name]) +" " +f.postText}/>
        </Col>
  )

  return (
    <Card className="antd-esri-widget" style={style} size="small" title={`Mobility Information:`}>
        {infoContent}
    </Card>
  )
});

export default HumanMobilityTooltip;