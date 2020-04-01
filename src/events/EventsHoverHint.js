import React from 'react';
import { observer } from 'mobx-react';
import { findColor, stringifyColor } from '../utils/ui';


export const EventsHoverHint = observer(({store}) => {
  if (!store.hoverResults) {
    return null;
  }

  const {graphic} = store.hoverResults;
  const attrs = graphic.attributes;
  const field = graphic.layer.renderer.field;
  const eventType = attrs['eventType'];

  let eventName, color;
  if (eventType) {
    const eventInfo = store.renderers['eventType'].uniqueValueInfos
      .find(event => event.value === eventType);
      eventName = eventInfo ? eventInfo.label : eventType;
    color = eventInfo.color;
    console.log(attrs);

  } else {
    eventName = 'Average speed';
    color = stringifyColor(findColor(store, graphic));
  }

  const content = null;
  return (
    <>
      <div className="details-tooltip__title uppercase">
        {eventName}
      </div>
      <div className="details-tooltip__value uppercase" style={{color}}>
        {attrs[field]}
      </div>
      <span>{content}</span>
    </>
  );
});
