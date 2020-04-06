// import './EventsDetailsPanel.scss';
import React from 'react';
import { observer } from "mobx-react";
import { Card } from 'antd';
import DetailsPanel, { SectionTitle } from '../components/details/DetailsPanel';
import { Hint } from '../components/details/Hint';
import { findColor, stringifyColor } from '../utils/ui';

const HumanMobilityDetails = observer(({store}) => {
  if(!store.clickResults || !store.clickResults.graphic) {
    return <Hint />;
  }
  const graphic = store.clickResults.graphic
  let headColor;
  const attrs = graphic.attributes;
  const field = graphic.layer.renderer.field;

  const title = (
    <>
      <div className="event-details__subtitle">Event</div>
      <div className="event-details__title uppercase">
        kek
      </div>
    </>
  );

  return (
    <Card 
      className="details-widget event-details" 
      size="small" 
      title={title} 
      headStyle={{background: headColor}}
    >
      <ul className="details-list">
        <li>
          <div>dummy</div>
          <div>0.0</div>
        </li>
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
      <SectionTitle>More info</SectionTitle>
      <HumanMobilityDetails store={store} />
    </DetailsPanel>  
  );
}
