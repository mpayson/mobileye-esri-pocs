import './EventsHoverHint.scss';
import React from 'react';
import { observer } from 'mobx-react';
import GaugePng from '../resources/images/gauge-01.png';
import ClockPng from '../resources/images/hour-01.png';
import {DATE, TIME} from './EventsConfig';


export const EventsHoverHint = observer(({store}) => {
  if (!store.hoverResults) {
    return null;
  }

  const {graphic} = store.hoverResults;
  const attrs = graphic.attributes;
  const field = graphic.layer.renderer.field;
  const eventType = attrs['eventType'];

  if (eventType) {
    const eventInfo = store.renderers['eventType'].uniqueValueInfos
      .find(event => event.value === eventType);
    const name = eventInfo ? eventInfo.label : eventType;
    return <EventHint name={name} timestamp={attrs['eventTimestamp']} />
  } else {
    return <SpeedHint value={attrs[field]} />
  }
});


function EventHint({name, timestamp}) {
  const date = DATE.format(timestamp);
  const time = TIME.format(timestamp);
  return (
    <>
      <div className="event-title uppercase" style={{marginBottom: '8px'}}>
        {name}
      </div>
      <div className="event-time gray">
        <img 
          src={ClockPng} 
          alt="clock icon" 
          width={9.5} 
          height={9.5} 
          style={{marginRight: '5px'}} 
        />
        First detected: {date} Hour: {time}
      </div>
    </>
  );
}


function SpeedHint({value}) {
  const wrapperStyles = {
    display: 'flex',
    justifyContent: 'space-between',
  }

  return (
    <div style={wrapperStyles}>
      <div className="event-title speed-title uppercase">
        Average speed
        <img src={GaugePng} alt="speed icon" width={18.5} height={15} />
      </div>
      <div className="details-tooltip__value gray">
        <span style={{fontSize: '25px'}}>
          {Math.round(value)}
        </span>
        <span style={{fontSize: '11px'}}> km/h</span>
      </div>
    </div>
  )
}
