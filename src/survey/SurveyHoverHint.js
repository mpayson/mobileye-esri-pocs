import './SurveyHoverHint.scss';
import React from 'react';
import { observer } from 'mobx-react';
import { findColor, stringifyColor, roundTo } from '../utils/ui';
import { CAT_CODE_TO_QUERY_FIELD, findLabel } from './survey-utils';


export const SurveyHoverHint = observer(({store}) => {
  if (!store.hoverResults) {
    return null;
  }

  const {graphic} = store.hoverResults;
  const attrs = graphic.attributes;
  const cat = graphic.layer.renderer.field;
  const catValue = attrs[cat];
  const subcat = CAT_CODE_TO_QUERY_FIELD[catValue];

  const subcatName = findLabel(store.lyr, subcat, attrs[subcat]);

  const color = stringifyColor(findColor(store, graphic));
  const lat = roundTo(graphic.geometry.latitude, 5);
  const long = roundTo(graphic.geometry.longitude, 5);

  return (
    <>
      <div 
        className="survey-tooltip__title uppercase" 
        style={{color}}
      >
        {subcatName}
      </div>
      <div className="survey-tooltip__coordinates gray">
        latitude: {lat}, longitude: {long}
      </div>
    </>
  );
});
