import React from 'react';
import { observer } from "mobx-react";
import { Card, Progress } from 'antd';

import safetyConfig from './SafetyConfig';

// This is really lazy, should be a method in the store but need to adjust config too so
// quantiles only get defined once
const quantiles = safetyConfig.filters.find(f => f.name === 'risk_score').params.quantiles;

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
  //const {x,y} = screenPoint;

  const isSubsetFields = store.rendererField && store.rendererField !== 'risk_score';

  const style = {
    display: 'block',
    position: 'absolute',
    // top: isSubsetFields ? `${y - 115}px` :`${y - 405}px`,
    // left: `${x - 220/2}px`,
    top: '15px',
    right: '55px',
    width: '260px',
    height: isSubsetFields ? '110px' : '400px',
    overflow: 'auto',
    zIndex: '99',
    pointerEvents: 'none'
  }
  if(!graphic) style.display = 'none';
  const attrs = graphic.attributes;

  const aM = store.aliasMap;
  // this is weird, but the filter objects will all have queried attribute metadata
  // to define information in the tooltip, and we want to show them all
  // longer term may want to move this out of the filters

  const infoContent = store.filters.filter(f => {
    const defaultBool = attrs.hasOwnProperty(f.field) && f.type === 'minmax' && f.field !== 'risk_score';
    return isSubsetFields
      ? defaultBool && store.rendererField === f.field
      : defaultBool;
  }).map(f => 
    // <tr key={f.field}>
    //   <td style={{height: "20px"}}>{f.alias}</td>
    //   <td style={{height: "20px"}}>
    //     <Progress
    //       percent={Math.round((attrs[f.field]/f.upperBound) * 100)}
    //       status="normal"
    //       showInfo={false}/>
    //   </td>
    // </tr>
    <div key={f.field}>
      {f.alias}
      <Progress
        percent={Math.round((attrs[f.field]/f.upperBound) * 100)}
        status="normal"
        showInfo={false}/>
    </div>
  )

  return (
    <Card className="antd-esri-widget" style={style} size="small" title={`${aM.get('risk_score')}: ${getQuantileLabel(attrs['risk_score'])}`}>
      {/* <table style={{width: "100%", tableLayout: 'fixed'}}>
      <tbody> */}
        {infoContent}
      {/* </tbody>
      </table> */}
    </Card>
  )
});

export default SafetyTooltip;