import './SurveyDetailsPanel.scss';
import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import DetailsPanel, { SectionTitle } from '../components/details/DetailsPanel';
import { Hint } from '../components/details/Hint';
import { findColor, stringifyColor } from '../utils/ui';

const SurveyDetails = observer(({store}) => {
  if(!store.clickResults || !store.clickResults.graphic) {
    return <Hint />;
  }
  const graphic = store.clickResults.graphic
  let extra, eventName, headColor;
  const attrs = graphic.attributes;
  const field = graphic.layer.renderer.field;
  console.log(attrs);
  console.log(store);

  // if (eventType) {
  //   const eventInfo = store.renderers['eventType'].uniqueValueInfos
  //     .find(event => event.value === eventType);
  //     eventName = eventInfo ? eventInfo.label : eventType;
  //   headColor = eventInfo.color;
  //   console.log(attrs);
  //   widgetConfig = config.details['eventType'];
  // } else {
  //   eventName = 'Average speed';
  //   headColor = stringifyColor(findColor(store, graphic));
  //   widgetConfig = config.details['averageSpeed'];
  // }

  const title = (
    <>
      <div className="event-details__subtitle">Event</div>
      <div className="event-details__title uppercase">
        {eventName}
      </div>
    </>
  );

  return (
    <Card 
      className="details-widget event-details" 
      size="small" 
      title={title} 
      extra={extra}
      headStyle={{background: headColor}}
    >
      <ul className="details-list">
        {[1].map((val, i) => {
          return (
            <li key={field+i}>
              <div>{title}</div>
              <div>{val}</div>
            </li>
          );
        })}
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
    >
      <SectionTitle>More info</SectionTitle>
      <SurveyDetails store={store} />
    </DetailsPanel>  
  );
}
