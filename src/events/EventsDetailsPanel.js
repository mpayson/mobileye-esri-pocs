import './EventsDetailsPanel.scss';
import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import { Col, Button } from 'antd';
import eventConfig from './EventsConfig';
import DetailsPanel, { SectionTitle } from '../components/details/DetailsPanel';
import { Hint } from '../components/details/Hint';
import { ReactComponent as ClockIcon} from '../resources/svg/schedule-24px.svg';
import { ReactComponent as TimerIcon} from '../resources/svg/timer-24px.svg';
import { ReactComponent as SpeedIcon} from '../resources/svg/speed-24px.svg';
import { ReactComponent as NoIcon } from '../resources/svg/not_interested-24px.svg';
import { findColor, stringifyColor } from '../utils/ui';

const TAG_TO_SVG = {
  'speed': SpeedIcon,
  'timer': TimerIcon,
}

const DATE_TIME = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short', 
  timeStyle: 'short'
});

const EventDetails = observer(({store}) => {
  if(!store.clickResults || !store.clickResults.graphic) {
    return <Hint />;
  }
  const graphics = [store.clickResults.graphic]
  let extra, eventName, headColor;
  const eventType = graphics[0].attributes['eventType'];
  if (eventType) {
    const eventInfo = store.renderers['eventType'].uniqueValueInfos
      .find(event => event.value === eventType);
      eventName = eventInfo ? eventInfo.label : eventType;
    headColor = eventInfo.color;
  } else {
    eventName = 'Average speed';
    headColor = stringifyColor(findColor(store, graphics[0]));
  }

  const title = (
    <div>
      <div className="event-details__subtitle">Event</div>
      <div className="event-details__title uppercase">
        {eventName}
      </div>
    </div>
  );

  const style = {
    display: 'block',
    marginBottom: '20px',
  }
  if (!graphics || graphics.length < 1) {
    return <Hint />;
  }
  
  const results = {};
  for (const prefix of Object.keys(eventConfig.statisticsFieldsInfo)) {
    results[prefix] = {count: 0, sum: 0}
  }

  for (const graphic of graphics) {
      const attrs = graphic.attributes;
      for (const prefix of Object.keys(results)) {
          const value = attrs[prefix]
          if (value !== null && value > 0) {
              results[prefix].sum += value;
              results[prefix].count++;
          }
      }
  }

  const last = graphics.slice(-1)[0];
  const activeLayer = last.layer;
  const activeFilter = activeLayer.renderer.field;

  const colStyle = {
    lineHeight: 1.1, 
    marginTop: '12px',
    padding: '0 2px',
    display: 'flex', 
    alignItems: 'center', 
    height: '30px'
  }
  const iconProps = {
    style: {
      display: 'inline-block', 
      marginRight: '6px'
    }, 
    width: 28, 
    height: 28, 
    fill: '#6e6e6e'
  };

  const infoContent = Object.entries(eventConfig.statisticsFieldsInfo)
    .filter(([key, _]) => key === activeFilter)
    .map(([key, params]) => { 
      const IconSvg = TAG_TO_SVG[params.iconTag] || NoIcon;
      const value = results[key].count ? Math.round(results[key].sum / results[key].count) : 0;
      return (
          <Col key={key} span={12} style={colStyle}>
            <IconSvg {...iconProps} title={params.title}/>
            <span>
              <span style={{fontSize: '24px'}}>{value}</span>{' '}{params.postText}
            </span>
          </Col>
      );
    })

  let timeFields = eventConfig.timestampFieldsInfo;
  const overrideFields = eventConfig.overrideFieldsInfoByEventType[eventType];
  if (overrideFields) {
    timeFields = {...timeFields, ...overrideFields};
  }

  const timeContent = Object.entries(timeFields).map(entry => { 
    const [key, params] = entry;
    const value = last['attributes'][key];

    let label;
    if (params.noIcon) {
      label = (
        <span style={{marginRight: '6px'}}>
          <b>{params.title}:</b>
        </span>
      )
    } else {
      const IconSvg = TAG_TO_SVG[params.iconTag] || ClockIcon;
      label = <IconSvg {...iconProps} title={params.title}/>
    }
    return value ? (
        <Col key={key} span={24} style={colStyle}>
          {label}
          <span style={{fontSize: '13px'}}>
            {DATE_TIME.format(value)}
          </span>
        </Col>
    ) : null;
  })

  return (
    <Card 
      className="details-widget event-details" 
      style={style} 
      size="small" 
      title={title} 
      extra={extra}
      headStyle={{background: headColor}}
    >
      {infoContent}
      {timeContent}
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
