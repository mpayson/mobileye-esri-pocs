// update to map

import bicycleImage from '../resources/images/ET_BICYCLE.png'
import pedImage from '../resources/images/ET_PED_ON_HW.png'

const eventsConfig = {
  layerItemId: '09faf499d6e6475f92bcbd68e68f8bbd',
  //webmapId: '54d46b14f5f74e59a523e0ae46ef8736',
  //layerRefreshIntervalMin: 1,
  initialRendererField: 'eventsubtype',
  renderers : {
    'eventsubtype': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "eventsubtype",
      //defaultSymbol: {type: "simple-marker", color: "blue"},
      uniqueValueInfos: [{
        value: "pedestrians",
        symbol: {
          type: "picture-marker",
          url: pedImage
        }
      }, {
        value: "bicycles",
        symbol: {
          type: "picture-marker",
          url: bicycleImage
        }
      }
      ]
    }
  }
  ,
  filters: [
//    {name: 'eventvalue', type: 'minmax', params: {lowerBound: 0, upperBound: 20, log: true}},
//    {name: 'eventtype', type: 'multiselect'},
    {name: 'eventsubtype', type: 'multiselect'},
//    {name: 'project', type: 'multiselect', params: {lowerBound: 0, upperBound: 100, log: true}},
//    {name: 'eventtimestamp', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
  ],
  popupTemplate: {
    title: "Event information:",
    content: "Event type: <b>{eventsubtype}</b><br>" +
        "Project: {project}<br>" +
        "Event value: {eventvalue}<br>" +
        "Event timestamp: {eventtimestamp}"
  },
  viewConfig: {
    center: [-74.00157, 40.71955],
    zoom: 12
  }

}

export default eventsConfig;


