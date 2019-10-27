import React from 'react';
import { observer } from "mobx-react";
import { Card, Progress } from 'antd';

import safetyConfig from './SafetyConfig';

// This is really lazy, should be a method in the store but need to adjust config too so
// quantiles only get defined once
const quantiles = safetyConfig.filters.find(f => f.name === 'eventvalue').params.quantiles;

const getQuantileLabel = value => {
  for(let i=0; i < quantiles.length; i++){
    if(value < quantiles[i].max){
      return quantiles[i].label;
    }
  }
  return ''
}


const SafetyTooltip = observer(({store}) => {

  if(!store.tooltipResults){
    return null;
  }
  const {
    graphic,
    screenPoint
  } = store.tooltipResults;
  const {x,y} = screenPoint;

  const isSubsetFields = store.rendererField && store.rendererField !== 'eventvalue';

  const style = {
    display: 'block',
    position: 'absolute',
    top: isSubsetFields ? `${y - 110}px` :`${y - 315}px`,
    left: `${x - 220/2}px`,
    width: '220px',
    height: isSubsetFields ? '105px' : '310px',
    overflow: 'auto',
    zIndex: '99',
    pointerEvents: 'none',
  }
  if(!graphic) style.display = 'none';
  const attrs = graphic.attributes;

  const aM = store.aliasMap;
  // this is weird, but the filter objects will all have queried attribute metadata
  // to define information in the tooltip, and we want to show them all
  // longer term may want to move this out of the filters

  const infoContent = store.filters.filter(f => {
    const defaultBool = attrs.hasOwnProperty(f.field) && f.type === 'minmax' && f.field !== 'eventvalue';
    return isSubsetFields
      ? defaultBool && store.rendererField === f.field
      : defaultBool;
  }).map(f => 
    <div key={f.field}>
      {f.alias}
      <Progress
        percent={Math.round((attrs[f.field]/f.upperBound) * 100)}
        status="normal"
        showInfo={false}/>
    </div>
  )

  return (
    <Card className="antd-esri-widget" style={style} size="small" title={`${aM.get('eventvalue')}: ${getQuantileLabel(attrs['eventvalue'])}`}>
      {infoContent}
    </Card>
  )
});

export default SafetyTooltip;