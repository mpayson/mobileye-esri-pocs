import './SurveyDetailsPanel.scss';
import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import DetailsPanel, { SectionTitle } from '../components/details/DetailsPanel';
import { Hint } from '../components/details/Hint';
import { findColor, stringifyColor, roundTo } from '../utils/ui';
import { getDomainMap } from '../utils/Utils';

const CAT_CODE_TO_QUERY_FIELD = [
  'traffic_sign_category_l3',
  'tfl_category_l3',
  'road_marking_category_l3',
  'pole_category_l3',
  'manhole_category_l3',
];

export const DT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short' , 
  timeStyle: 'short'
});

function findLabel(layer, fieldName, value) {
  const field = layer.fields.find(f => f.name === fieldName);
  if (field) {
    const description = field.domain.codedValues.find(v => v.code === value);
    if (description) {
      return description.name;
    }
  }
  return null;
}

const SurveyDetails = observer(({store}) => {
  const results = store.clickResults;
  window.store = store;

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

  const title = (
    <>
      <div className="survey-details__category uppercase">
        {catName}&nbsp;
      </div>
      <div className="survey-details__subcategory">
        {subcatName}&nbsp;
      </div>
    </>
  );

  return (
    <Card 
      className="details-widget survey-details" 
      size="small" 
      title={title} 
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
      <SectionTitle>More info</SectionTitle>
      <SurveyDetails store={store} />
    </DetailsPanel>  
  );
}
