import './SurveyDetailsPanel.scss';
import React, { useState } from 'react';
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

const SurveyDetails = observer(({store}) => {
  const [subtitle, setSubtitle] = useState("");
  if(!store.clickResults || !store.clickResults.graphic) {
    return <Hint />;
  }
  const graphic = store.clickResults.graphic;
  const attrs = graphic.attributes;
  const field = graphic.layer.renderer.field;
  const value = attrs[field];
  const color = stringifyColor(findColor(store, graphic));

  let category = 'Unknown';
  const layer = store.lyr;
  if (layer) {
    const map = layer.fieldsIndex._fieldsMap.get(field).domain;
    const description = map.codedValues.find(v => v.code === value);
    const queryField = CAT_CODE_TO_QUERY_FIELD[value];

    if (description) {
      category = description.name;
    }

    layer.queryFeatures({
      where: `ObjectId = ${attrs.ObjectId}`,
      outFields: [queryField],
    })
    .then(result => {
      if (result && result.features && result.features[0]) {
        const feature = result.features[0];
        const code = feature.attributes[queryField];

        const field = result.fields.find(f => f.name === queryField);
        const domainMap = getDomainMap(field.domain);

        if (domainMap.has(code)) {
          return domainMap.get(code);
        }
      }
      return "unknown";
    }).then(setSubtitle, () => setSubtitle('error'));
  }

  const title = (
    <>
      <div className="survey-details__category uppercase">
        {category}
      </div>
      <div className="survey-details__subcategory">
        {subtitle}
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
