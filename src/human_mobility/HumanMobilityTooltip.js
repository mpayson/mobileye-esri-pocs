import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import { Col, Button } from 'antd';
import humanMobilityConfig from './HumanMobilityConfig';
import { ReactComponent as BikeIcon} from '../resources/svg/directions_bike-24px.svg';
import { ReactComponent as WalkIcon} from '../resources/svg/directions_walk-24px.svg';
import { ReactComponent as SpeedIcon} from '../resources/svg/speed-24px.svg';
import { ReactComponent as NoIcon } from '../resources/svg/not_interested-24px.svg';

const TAG_TO_SVG = {
  'bike': BikeIcon,
  'walk': WalkIcon,
  'speed': SpeedIcon,
  'none': NoIcon,
}

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
    width: '290px',
    height: 'auto',
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
  
  const iconStyle = {display: 'inline-block', marginRight: '6px'}
  const colStyle = {
    lineHeight: 1.1, 
    marginTop: '12px',
    padding: '0 2px',
    display: 'flex', 
    alignItems: 'center', 
    height: '30px'
  }
  const infoContent = Object.entries(humanMobilityConfig.statisticsFieldsInfo).map(entry => {
    const IconSvg = TAG_TO_SVG[entry[1].iconTag] || TAG_TO_SVG['none']
    const value = Math.round(results[entry[0]].count != 0 ? results[entry[0]].sum / results[entry[0]].count : 0);
    return (
        <Col key={entry[0]} span={12} style={colStyle}>
          <IconSvg 
            style={iconStyle} 
            width={28} 
            height={28} 
            fill="#6e6e6e"
            title={entry[1].title} 
          />
          <span>
            <span style={{fontSize: '24px'}}>
              {value}  
            </span>
            {' '}{entry[1].postText}
          </span>
        </Col>
    );
  })
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