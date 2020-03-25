import React from 'react';
import LegendPanel, { SectionTitle } from '../components/LegendPanel';
import { observer } from 'mobx-react';
import { Card, Progress } from 'antd';
import safetyConfig from './SafetyConfig';
import Store from '../stores/Store';
import { stringifyColor } from '../utils/ui';

// This is really lazy, should be a method in the store but need to adjust config too so
// quantiles only get defined once
const quantiles = safetyConfig.filters.find(
  f => f.name === 'risk_score').params.quantiles;
const getQuantile = value => {
  for(let i=0; i < quantiles.length; i++){
    if(value < quantiles[i].max){
      return quantiles[i];
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

  const attrs = graphic.attributes;
  let color = findColor(store, graphic);
  color = stringifyColor(color);
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
        showInfo={false}
        strokeColor={color}
      />
    </div>
  )

  const quantile = getQuantile(attrs['risk_score']);
  const title = (
    <div>
      <div className="flat-widget__title uppercase">
        {aM.get('risk_score')}
      </div>
      <div className="flat-widget__subtitle" style={{color: 'white'}}>
        {quantile.label}
      </div>
    </div>
  );

  const card = (
    <Card 
      className="flat-widget" 
      style={style} 
      headStyle={{background: color}}
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
      <SectionTitle>More info</SectionTitle>
      <SafetyInfoWidget store={store} />
    </LegendPanel>  
  );
}


function findColor(store, graphic) {
  const attrs = graphic.attributes;
  const renderer = store.renderers[store.rendererField];
  const value = attrs[renderer.field];
  const valueInfo = Store._findValueInfo(renderer, value);

  let color;
  const overrideColor = store._findVisVarOverrides(
    graphic.sourceLayer.renderer, 'color', value);
  if (overrideColor) {
    color = overrideColor;
  } else {
    color = valueInfo && valueInfo.symbol && valueInfo.symbol.color;
  }
  return color;
}
