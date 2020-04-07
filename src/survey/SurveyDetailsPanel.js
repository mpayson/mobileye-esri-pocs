import './SurveyDetailsPanel.scss';
import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import DetailsPanel, { SectionTitle } from '../components/details/DetailsPanel';
import { Hint } from '../components/details/Hint';
import { findColor, stringifyColor, roundTo } from '../utils/ui';

const SurveyDetails = observer(({store}) => {
  if(!store.clickResults || !store.clickResults.graphic) {
    return <Hint />;
  }
  const graphic = store.clickResults.graphic;
  console.log(graphic);
  const attrs = graphic.attributes;
  const field = graphic.layer.renderer.field;
  const value = attrs[field];
  const color = stringifyColor(findColor(store, graphic));

  let category = 'Unknown';
  const layer = store.lyr;
  if (layer) {
    const map = layer.fieldsIndex._fieldsMap.get(field).domain;
    const description = map.codedValues.find(v => v.code === value);

    if (description) {
      category = description.name;
    }
  }

  const title = (
    <>
      <div className="survey-details__category uppercase">
        {category}
      </div>
      <div className="survey-details__subcategory">
        nope
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
          <div>latitude</div>
          <div>{roundTo(graphic.geometry.latitude, 5)}</div>
        </li>
        <li>
          <div>longitude</div>
          <div>{roundTo(graphic.geometry.longitude, 5)}</div>
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
