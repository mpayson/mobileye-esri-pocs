// update to map

import bicycleImage from '../resources/images/ET_BICYCLE.png'
import pedImage from '../resources/images/ET_PED_ON_HW.png'

const eventsConfig = {
  layerItemId: '31cafff739334c648e2908ce2be1f048',
  initialRendererField: 'eventsubtype',
  renderers : {
    'eventsubtype': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "eventsubtype",
      defaultSymbol: {type: "simple-marker", color: "blue"},
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
    {name: 'eventvalue', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
    {name: 'eventtype', type: 'multiselect'},
    {name: 'eventsubtype', type: 'multiselect'},
    {name: 'project', type: 'multiselect', params: {lowerBound: 0, upperBound: 100, log: true}},
//    {name: 'eventtimestamp', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
  ],
  popupTemplate: {
    title: "Event information:",
    content: "Event type: <b>{eventsubtype}</b><br>" +
        "Project: {project}<br>" +
        "Event value: {eventvalue}<br>" +
        "Event timestamp: {eventtimestamp}"
  }
  // ,
  // timeInfo: {
  //   startField: "eventtimestamp", // name of the date field
  //   interval: {
  //     // set time interval to one day
  //     unit: "days",
  //     value: 1
  //   }
  // }

}

export default eventsConfig;


