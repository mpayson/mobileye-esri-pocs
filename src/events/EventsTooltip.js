import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import { Col, Button } from 'antd';
import eventConfig from './EventsConfig';
import { ReactComponent as ClockIcon} from '../resources/svg/schedule-24px.svg';
import { ReactComponent as TimerIcon} from '../resources/svg/timer-24px.svg';
import { ReactComponent as SpeedIcon} from '../resources/svg/speed-24px.svg';
import { ReactComponent as NoIcon } from '../resources/svg/not_interested-24px.svg';

const TAG_TO_SVG = {
  'speed': SpeedIcon,
  'timer': TimerIcon,
}

const DATE_TIME = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short', 
  timeStyle: 'short'
});

const EventsTooltip = observer(({store}) => {

  if(!store.tooltipResults && !store.mouseResults){
    return null;
  }

  let graphics, title, extra;
  if(store.mouseResults){
    graphics = store.mouseResults.graphics;
    title = store.mouseResults.title;
    extra= <Button type="link" onClick={store.clearMouseResults}>X</Button>
  } else {
    graphics = [store.tooltipResults.graphic]
    const eventType = graphics[0].attributes['eventType'];
    if (eventType) {
      const eventInfo = store.renderers['eventType'].uniqueValueInfos
        .find(event => event.value === eventType);
      title = eventInfo ? eventInfo.label : eventType;
    } else {
      title = 'Average speed:'
    }
  }
  title = <span style={{fontSize: '16px'}}>{title}</span>

  const style = {
    display: 'block',
    position: 'absolute',
    top: '15px',
    right: '55px',
    width: '290px',
    height: 'auto',
    overflow: 'auto',
    zIndex: '99',
    // pointerEvents: 'none'
  }
  if (!graphics || graphics.length < 1) style.display = 'none';
  
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
  const eventType = last.attributes['eventType'];

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
    <Card className="antd-esri-widget" style={style} size="small" title={title} extra={extra}>
      {infoContent}
      {timeContent}
    </Card>
  )
});

export default EventsTooltip;