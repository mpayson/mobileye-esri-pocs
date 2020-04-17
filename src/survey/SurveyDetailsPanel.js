import './SurveyDetailsPanel.scss';
import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import DetailsPanel from '../components/details/DetailsPanel';
import { Hint } from '../components/details/Hint';
import { findColor, stringifyColor, roundTo } from '../utils/ui';
import { CAT_CODE_TO_QUERY_FIELD, findLabel } from './survey-utils';
import { category_l22image } from './SurveyConfig';

export const DT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short' , 
  timeStyle: 'short'
});

const Title = ({cat, subcat}) => (
  <>
    <div className="survey-details__category uppercase">
      {cat}&nbsp;
    </div>
    <div className="survey-details__subcategory">
      {subcat}&nbsp;
    </div>
  </>
);

const Dimension = ({value, className}) => (
  <div className={className}>
    <span className="survey-details__dim-value">
      {roundTo(value, 3)}
    </span>&nbsp;
    <span className="survey-details__measure-unit">m</span>
  </div>
);

const Dimensions = ({imgSrc, width, height}) => (
    <div className="survey-details__dimensions">
      <hr className="survey-details__separator" />
      <div className="survey-details__caption">Dimensions</div>
      <div className="survey-details__image">
        {Number.isFinite(width) && (
          <Dimension className="survey-details__width" value={width}/>
        )}
        {imgSrc ? <img src={imgSrc} alt="asset" /> : <div className="no-image" />}
        {Number.isFinite(height) && (
          <Dimension className="survey-details__height" value={height}/>
        )}
      </div>
    </div>
);

const SurveyDetails = observer(({store}) => {
  const results = store.clickResults;
  if(!results || !results.graphic) {
    return <Hint/>;
  }

  const graphic = results.graphic;
  const attrs = graphic.attributes;
  const cat = graphic.layer.renderer.field;
  const catValue = attrs[cat];
  const subcat = CAT_CODE_TO_QUERY_FIELD[catValue];

  const catName = findLabel(store.lyr, cat, catValue);
  const subcatName = findLabel(store.lyr, subcat, attrs[subcat]);
  const color = stringifyColor(findColor(store, graphic));

  const l2 = attrs['category_l2'];
  const imgSrc = category_l22image[l2];
  const width = attrs['width'];
  const height = attrs['height'];

  const hasDimsInfo = Boolean(imgSrc) || Number.isFinite(width) || Number.isFinite(height);

  return (
    <Card 
      className="details-widget survey-details" 
      size="small" 
      title={<Title cat={catName} subcat={subcatName} />} 
      headStyle={{background: color}}
    >
      <ul className="details-list">
        <li>
          <div>Latitude</div>
          <div>{roundTo(graphic.geometry.latitude, 5)}</div>
        </li>
        <li>
          <div>Longitude</div>
          <div>{roundTo(graphic.geometry.longitude, 5)}</div>
        </li>
        <li>
          <div>Last update</div>
          <div>{DT.format(attrs['publish_date'])}</div>
        </li>
      </ul>
      {hasDimsInfo && (
        <Dimensions imgSrc={imgSrc} width={width} height={height} />
      )}
    </Card>
  )
});

export function SurveyDetailsPanel({store, onMountOpen, width, onOpen}) {
  return (
    <DetailsPanel 
      store={store} 
      view={store.view}
      onMountOpen={onMountOpen}
      width={width}
      onOpen={onOpen}
      className="survey-details-panel"
    >
      <SurveyDetails store={store} />
    </DetailsPanel>  
  );
}
