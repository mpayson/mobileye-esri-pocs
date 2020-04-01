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

  const content = store.filters
    .filter(f => f.field === store.rendererField)
    .map(f => (
      <div className="gray" key={f.field}>
        {f.alias}: {Math.round(attrs[f.field] * 1000) / 1000}
      </div>
  ));

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


