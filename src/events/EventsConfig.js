// update to map

import bicycleImage from '../resources/images/ET_BICYCLE.png'
import pedImage from '../resources/images/ET_PED_ON_HW.png'
import NYCImage from "../resources/images/NYC.jpg";
import BarcelonaImage from "../resources/images/Barcelona.jpg";
import TokyoImage from "../resources/images/Tokyo.jpg";

const eventsConfig = {
  //layerItemId: 'baf1358ce8d74342af3340f621688e21',
  //webmapId: '54d46b14f5f74e59a523e0ae46ef8736',
  webmapId: '56edb4effdea4908bf5721fc5f32a08b',
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
    {name: 'eventsubtype', type: 'multiselect', params: {dynamic: true}},
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
  },
  locations: [{
    'name' : 'New York City',
    'image' : NYCImage,
    'extent' : {
                 "xmin":-74.243003,"ymin":40.60381,"xmax":-73.795653,"ymax":40.828901,
                 "spatialReference":{"wkid":4326}
               }
  },
  {
    'name' : 'Barcelona',
    'image' : BarcelonaImage,
    'extent' : {
                 "xmin":1.990109,"ymin":41.32895,"xmax":2.356434,"ymax":41.468276,
                 "spatialReference":{"wkid":4326}
               }
  },
  {
    'name' : 'Tokyo',
    'image' : TokyoImage,
    'extent' : {
                 "xmin":15537201.84,"ymin":4246841.30,"xmax":15583828.48,"ymax":4290869.07,
                 "spatialReference":{"wkid":102100}
               }
  }]

}

export default eventsConfig;


