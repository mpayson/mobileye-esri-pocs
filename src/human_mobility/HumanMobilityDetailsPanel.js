import './HumanMobilityDetailsPanel.scss';
import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import DetailsPanel from '../components/details/DetailsPanel';
import { Hint } from '../components/details/Hint';
import config from './HumanMobilityConfig';

const HumanMobilityDetails = observer(({store}) => {
  if ((!store.mouseResults) && 
      (!store.clickResults || !store.clickResults.graphic)) {
    return <Hint />;
  }

  let graphics, title;
  if (store.mouseResults){
    graphics = store.mouseResults.graphics;
    title = store.mouseResults.title;
  } else {
    graphics = [store.clickResults.graphic]
    title = 'Mobility Data'
  }

  let headColor;

  const results = {};
  for (const prefix of Object.keys(config.statisticsFieldsInfo)) {
    results[prefix] = { count: 0, sum: 0 }
  }

  for (const graphic of graphics) {
    const attrs = graphic.attributes;
    for (const day of store.selectedDays) {
      for (const hour of store.selectedHours) {
        for (const prefix of Object.keys(config.statisticsFieldsInfo)) {
          const value = attrs[[prefix,day.toString(),hour.toString()].join("_")]
          const count = attrs[['count',day.toString(),hour.toString()].join("_")]
  
          if (value !== null && value > 0) {
            results[prefix].count = results[prefix].count + count;
            results[prefix].sum += value;
          }
        }
      }
    }
  }

  title = <div className="mobility-details__subtitle">{title}</div>;

  return (
    <Card 
      className="details-widget mobility-details" 
      size="small" 
      title={title} 
      headStyle={{background: headColor}}
    >
      <ul className="details-list">
        {Object.entries(config.statisticsFieldsInfo).map(([key, settings]) => {
          const r = results[key];
          const value = Math.round(r.sum / Math.max(r.count, 1));
          return (
            <li key="avgSpeed">
              <img src={settings.image} alt={settings.title} width={37} height={36.5} />
              <div>
                <span style={{fontSize: '11px', marginRight: '5px'}}>
                  {settings.postText}
                </span>
                <span style={{fontSize: '25px'}}>{value}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  )
});

export function HumanMobilityDetailsPanel({store, onMountOpen, width, onOpen}) {
  return (
    <DetailsPanel 
      store={store} 
      view={store.view}
      onMountOpen={onMountOpen}
      width={width}
      layerInfos={store.legendLayerInfos}
      onOpen={onOpen}
    >
      <HumanMobilityDetails store={store} />
    </DetailsPanel>  
  );
}
