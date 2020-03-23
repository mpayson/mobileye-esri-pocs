import React from 'react';
import LegendPanel from '../components/LegendPanel';
import { observer } from 'mobx-react';
import { Card, Progress } from 'antd';
import safetyConfig from './SafetyConfig';

// This is really lazy, should be a method in the store but need to adjust config too so
// quantiles only get defined once
const quantiles = safetyConfig.filters.find(
  f => f.name === 'risk_score').params.quantiles;
const getQuantileLabel = value => {
  for(let i=0; i < quantiles.length; i++){
    if(value < quantiles[i].max){
      return quantiles[i].label;
    }
  }
  return ''
}

const NothingSelected = () => (
  <div style={{marginBottom: '15px'}}>
    Select an object/road segment to see more
  </div>
)

const SafetyInfoWidget = observer(({store}) => {
  if (!store.tooltipResults) {
    return <NothingSelected />;
  }

  const {graphic} = store.tooltipResults;
  if (!graphic) {
    return <NothingSelected />;
  }

  const isSubsetFields = store.rendererField && store.rendererField !== 'risk_score';

  const style = {
    display: 'block',
    width: 'auto', // '220px',
    height: 'auto', // isSubsetFields ? '110px' : '400px',
    overflow: 'hidden',
    marginBottom: '26px',
  }
  if(!graphic) style.display = 'none';
  const attrs = graphic.attributes;

  const aM = store.aliasMap;
  // this is weird, but the filter objects will all have queried attribute metadata
  // to define information in the tooltip, and we want to show them all
  // longer term may want to move this out of the filters

  const infoContent = store.filters.filter(f => {
    const defaultBool = (attrs.hasOwnProperty(f.field) && 
      f.type === 'minmax' && f.field !== 'risk_score');
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

  const title = `${aM.get('risk_score')}: ${getQuantileLabel(attrs['risk_score'])}`;
  const card = (
    <Card 
      className="antd-esri-widget" 
      style={style} 
      size="small" 
      title={title}>
      {infoContent}
    </Card>
  )
  return card;
});


export function SafetyInfoPanel({store, onMountOpen}) {
  return (
    <LegendPanel 
      store={store} 
      view={store.view}
      onMountOpen={onMountOpen}
      width={260}
    >
      <h3>More info</h3>
      <SafetyInfoWidget store={store} />
    </LegendPanel>  
  );
}
