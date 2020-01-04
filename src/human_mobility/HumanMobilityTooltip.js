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
    width: '270px',
    height: '250px',
    overflow: 'auto',
    zIndex: '99',
    pointerEvents: 'none'
  }
  if(!graphic) style.display = 'none';
  const attrs = graphic.attributes;

  var results = {};
  for (let prefix of Object.keys(humanMobilityConfig.statisticsFieldsInfo)) {
    results[prefix] = {count:0,sum:0}
  }

  for (let day of store.selectedDays)
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
    <Card className="antd-esri-widget" style={style} size="small" title={`Mobility Data:`}>
        {infoContent}
    </Card>
  )
});

export default HumanMobilityTooltip;