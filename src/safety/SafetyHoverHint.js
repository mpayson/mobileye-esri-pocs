import './SafetyHoverHint.scss';
import React, { useRef, useEffect, useState } from 'react';
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

  const content = store.filters
    .filter(f => f.field === store.rendererField)
    .map(f => (
      <div className="gray" key={f.field}>
        {f.alias}: {Math.round(attrs[f.field] * 1000) / 1000}
      </div>
  ));

  const {x, y} = store.hoverResults.screenPoint;

  return (
    <>
      <span className="details-tooltip__title uppercase">
        {aM.get('risk_score')}{': '}
      </span>
      <span className="details-tooltip__value uppercase" style={{color}}>
        {quantile.label}
      </span>
      <span>{content}</span>
    </>
  );
});


export const Tooltip = observer(({children, store, xMin=0, xMax=window.innerWidth}) => {
  const results = store.hoverResults;
  let x, y;
  if (results) {
    const p = results.screenPoint
    x = p.x;
    y = p.y;
  } else {
    x = -1000;
    y = -1000;
  }
  console.log(xMin, xMax);

  let left, right;
  if (x > xMin + 120) {
    if (x + 120 < xMax) {
      left = x - 110;
      right = null;
    } else {
      left = null;
      right = 10;
    }
  } else {
    left = xMin + 10;
    right = null;
  }

  // const left = x > xMin + 120 ? x + 120 < xMax ? x - 110 : xMax - 250 : xMin + 10;
  const top = y > 67 ? y - 65 : y + 10;

  return (
    <>
      <div className="details-overlay" />
      <div className="details-tooltip" style={{left, right, top}} >
        {children}
      </div>
    </>
  );
});