import './EventsDetailsPanel.scss';
import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import DetailsPanel from '../components/details/DetailsPanel';
import { Hint } from '../components/details/Hint';
import { findColor, stringifyColor } from '../utils/ui';
import config from './EventsConfig';
import SpeedPng from '../resources/images/gauge_01-01.png';

const EventDetails = observer(({store}) => {
  if(!store.clickResults || !store.clickResults.graphic) {
    return <Hint />;
  }
  const graphic = store.clickResults.graphic
  let extra, eventName, headColor, widgetConfig;
  const attrs = graphic.attributes;
  const field = graphic.layer.renderer.field;
  const eventType = attrs['eventType'];

  if (eventType) {
    const eventInfo = store.renderers['eventType'].uniqueValueInfos
      .find(event => event.value === eventType);
      eventName = eventInfo ? eventInfo.label : eventType;
    headColor = eventInfo.color;
    widgetConfig = config.details['eventType'];
  } else {
    eventName = 'Average speed';
    headColor = stringifyColor(findColor(store, graphic));
    widgetConfig = config.details['averageSpeed'];
  }

  const title = (
    <>
      <div className="event-details__subtitle">Event</div>
      <div className="event-details__title uppercase">
        {eventName}
      </div>
    </>
  );

  let moreDetails;
  if (!eventType) {
    let value = attrs[field];
    value = Math.round(value);
    moreDetails = (
      <li key="avgSpeed">
        <img src={SpeedPng} alt="Speed icon" width={34} height={34} />
        <div>
          <span style={{fontSize: '11px', marginRight: '5px'}}>km/h</span>
          <span style={{fontSize: '25px'}}>{value}</span>
        </div>
      </li>
    );
  }

  return (
    <Card 
      className="details-widget event-details" 
      size="small" 
      title={title} 
      extra={extra}
      headStyle={{background: headColor}}
    >
      <ul className="details-list">
        {moreDetails}
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

export function EventsDetailsPanel({store, onMountOpen, width, onOpen}) {
  return (
    <DetailsPanel 
      store={store} 
      view={store.view}
      onMountOpen={onMountOpen}
      width={width}
      layerInfos={store.legendLayerInfos}
      onOpen={onOpen}
    >
      <EventDetails store={store} />
    </DetailsPanel>  
  );
}
