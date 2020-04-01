import './EventsDetailsPanel.scss';
import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import DetailsPanel, { SectionTitle } from '../components/details/DetailsPanel';
import { Hint } from '../components/details/Hint';
import { findColor, stringifyColor } from '../utils/ui';
import config from './EventsConfig';

const EventDetails = observer(({store}) => {
  if(!store.clickResults || !store.clickResults.graphic) {
    return <Hint />;
  }
  const graphics = [store.clickResults.graphic]
  let extra, eventName, headColor, content, widgetConfig;
  const attrs = graphics[0].attributes;
  const eventType = attrs['eventType'];

  if (eventType) {
    const eventInfo = store.renderers['eventType'].uniqueValueInfos
      .find(event => event.value === eventType);
      eventName = eventInfo ? eventInfo.label : eventType;
    headColor = eventInfo.color;
    console.log(attrs);
    widgetConfig = config.details['eventType'];
  } else {
    eventName = 'Average speed';
    headColor = stringifyColor(findColor(store, graphics[0]));
    widgetConfig = config.details['averageSpeed'];
  }

  content = (
    <ul className="details-list">
      {widgetConfig.map(({title, field, format}, i) => {
        let value = attrs[field];
        if (format) {
          value = format(value);
        }
        return (
          <li key={field+i}>
            <div>{title}</div>
            <div>{value}</div>
          </li>
        );
      })}
    </ul>
  )

  const title = (
    <div>
      <div className="event-details__subtitle">Event</div>
      <div className="event-details__title uppercase">
        {eventName}
      </div>
    </div>
  );

  const last = graphics.slice(-1)[0];
  const activeLayer = last.layer;
  const activeFilter = activeLayer.renderer.field;

  return (
    <Card 
      className="details-widget event-details" 
      size="small" 
      title={title} 
      extra={extra}
      headStyle={{background: headColor}}
    >
      <ul className="details-list">
        {widgetConfig.map(({title, field, format}, i) => {
          let value = attrs[field];
          if (format) {
            value = format(value);
          }
          return (
            <li key={field+i}>
              <div>{title}</div>
              <div>{value}</div>
            </li>
          );
        })}
      </ul>
    </Card>
  )
});

export function EventsDetailsPanel({store, onMountOpen}) {
  return (
    <DetailsPanel 
      store={store} 
      view={store.view}
      onMountOpen={onMountOpen}
      width={280}
      layerInfos={store.legendLayerInfos}
    >
      <SectionTitle>More info</SectionTitle>
      <EventDetails store={store} />
    </DetailsPanel>  
  );
}
