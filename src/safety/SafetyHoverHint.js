import './SafetyHoverHint.scss';
import React from 'react';
import { observer } from 'mobx-react';
import { getQuantile } from './safety-utils';
import { findColor, stringifyColor } from '../utils/ui';


export const SafetyHoverHint = observer(({store}) => {
  if (!store.hoverResults) {
    return null;
  }

  const {graphic} = store.hoverResults;
  const attrs = graphic.attributes;
  let color = findColor(store, graphic);
  color = stringifyColor(color);
  const aM = store.aliasMap;
  const quantile = getQuantile(attrs['risk_score']);

  const point = store.hoverResults.screenPoint;
  const left = point.x - 100;
  const top = point.y - 60;

  return (
    <div className="details-hover" style={{left, top}}>
      <span className="details-hover__title uppercase">
        {aM.get('risk_score')}{': '}
      </span>
      <span className="details-hover__value uppercase" style={{color}}>
        {quantile.label}
      </span>
    </div>
  );
});