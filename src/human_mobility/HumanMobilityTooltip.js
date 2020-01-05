import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import { Statistic, Col, Button } from 'antd';
import humanMobilityConfig from './HumanMobilityConfig';

const HumanMobilityTooltip = observer(({store}) => {

  if(!store.tooltipResults && !store.mouseResults){
    return null;
  }

  let graphics, title, extra;
  if(store.mouseResults){
    graphics = store.mouseResults.graphics;
    title = store.mouseResults.title;
    extra= <Button type="link" onClick={store.clearMouseResults}>X</Button>
  } else {
    graphics = [store.tooltipResults.graphic]
    title = 'Mobility Data:'
  }

  const style = {
    display: 'block',
    position: 'absolute',
    top: '15px',
    right: '55px',
    width: '270px',
    height: '250px',
    overflow: 'auto',
    zIndex: '99',
    // pointerEvents: 'none'
  }
  if(!graphics || graphics.length < 1) style.display = 'none';
  
  var results = {};
  for (let prefix of Object.keys(humanMobilityConfig.statisticsFieldsInfo)) {
    results[prefix] = {count:0,sum:0}
  }


  for(let graphic of graphics){
    const attrs = graphic.attributes;
    for (let day of store.selectedDays) {
      for (let hour of store.selectedHours){
        for (let prefix of Object.keys(humanMobilityConfig.statisticsFieldsInfo)){
          const value = attrs[[prefix,day.toString(),hour.toString()].join("_")]
          const count = attrs[['count',day.toString(),hour.toString()].join("_")]
  
          if (value !== null && value > 0) {
            //results[prefix].count++;
            results[prefix].count = results[prefix].count + count;
            results[prefix].sum += value;
          }
        }
      }
    }
  }
  

  const infoContent =Object.entries(humanMobilityConfig.statisticsFieldsInfo).map(entry=>
        <Col key={entry[0]} span={17}>
          <Statistic title={entry[1].title} value={Math.round(results[entry[0]].count != 0 ? results[entry[0]].sum / results[entry[0]].count : 0)} suffix={entry[1].postText}/>
        </Col>

  )
  // const infoContent = humanMobilityConfig.layers.filter(layer => layer.type !== "static").map(f =>
  //       <Col key={f.name} span={17}>
  //         <Statistic title={f.title} value={Math.round(attrs[f.name])} suffix={f.postText}/>
  //       </Col>
  // )

  return (
    <Card className="antd-esri-widget" style={style} size="small" title={title} extra={extra}>
        {infoContent}
    </Card>
  )
});

export default HumanMobilityTooltip;