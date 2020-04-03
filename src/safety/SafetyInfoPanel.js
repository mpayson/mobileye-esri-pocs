import React from 'react';
import DetailsPanel, { SectionTitle } from '../components/details/DetailsPanel';
import {Hint} from '../components/details/Hint';
import { observer } from 'mobx-react';
import { Card, Progress } from 'antd';
import { stringifyColor, findColor } from '../utils/ui';
import { getQuantile } from './safety-utils';


const SafetyInfoWidget = observer(({store}) => {
  if (!store.clickResults) {
    return <Hint />;
  }

  const {graphic} = store.clickResults;
  if (!graphic) {
    return <Hint />;
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
    <div key={f.field} style={{fontSize: '12px'}}>
      {f.alias}
      <Progress
        percent={Math.round((attrs[f.field]/f.upperBound) * 100)}
        status="normal"
        showInfo={false}
        strokeColor={color}
        size="small"
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


export function SafetyInfoPanel({store, onMountOpen, width, onOpen}) {
  return (
    <DetailsPanel 
      store={store} 
      view={store.view}
      onMountOpen={onMountOpen}
      width={width}
      onOpen={onOpen}
    >
      <SectionTitle>More info</SectionTitle>
      <SafetyInfoWidget store={store} />
    </DetailsPanel>  
  );
}
