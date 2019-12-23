// update to map

import bicycleImage from '../resources/images/ET_BICYCLE.png'
import pedImage from '../resources/images/ET_PED_ON_HW.png'
import NYCImage from "../resources/images/NYC.jpg";
import BarcelonaImage from "../resources/images/Barcelona.jpg";
import TokyoImage from "../resources/images/Tokyo.jpg";

const eventsConfig = {
  //layerItemId: 'baf1358ce8d74342af3340f621688e21',
  //webmapId: '54d46b14f5f74e59a523e0ae46ef8736',
  webmapId: '37f6876be7dc4d7e8166c3ef0df0c3aa',
  //layerRefreshIntervalMin: 1,
  initialRendererField: 'eventType',
  renderers : {
    'eventType': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "eventType",
      //defaultSymbol: {type: "simple-marker", color: "blue"},
      uniqueValueInfos: [
      {
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
      },

      {
        value: "ET_PHYSICAL_OBJECT",
        symbol: {
          type: "picture-marker",
          url: pedImage
        }
      },
      {
        value: "ET_CONSTRUCTION_AREA",
        symbol: {
          type: "simple-line",
          width: "8.5px",
          color: [253,174,97,255]

        }
      }

      ]
    }
  }
  ,
  filters: [
//    {name: 'eventvalue', type: 'minmax', params: {lowerBound: 0, upperBound: 20, log: true}},
//    {name: 'eventtype', type: 'multiselect'},
    {name: 'eventType', type: 'multiselect', params: {mode:'multiple-radios'}},
//    {name: 'project', type: 'multiselect', params: {lowerBound: 0, upperBound: 100, log: true}},
//    {name: 'eventtimestamp', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
  ],
  popupTemplate: {
    title: "Event information:",
    content: "Event type: <b>{eventType}</b><br>" +
        "Project: {project}<br>" +
        "Event value: {eventValue}<br>" +
        "Event timestamp: {eventTimestamp}"
  },
  viewConfig: {
    //center: [-74.00157, 40.71955],
    center: [128.608705, 35.862483],
    zoom: 12
  },
  locationsByArea: [
    { areaName : 'Americas',
      locations: [{
      'name' : 'New York City',
      'image' : NYCImage,
      'extent' : {
                  "xmin":-74.243003,"ymin":40.60381,"xmax":-73.795653,"ymax":40.828901,
                  "spatialReference":{"wkid":4326}
                }
          }]},
      { areaName : 'Europe',
        locations: [{
                      'name' : 'Barcelona',
                      'image' : BarcelonaImage,
                      'extent' : {
                                  "xmin":1.990109,"ymin":41.32895,"xmax":2.356434,"ymax":41.468276,
                                  "spatialReference":{"wkid":4326}
                                }
                    },
                  ]
                },
      { areaName : 'APAC',
        locations: [{           
        'name' : 'Tokyo',
        'image' : TokyoImage,
        'extent' : {
                    "xmin":15537201.84,"ymin":4246841.30,"xmax":15583828.48,"ymax":4290869.07,
                    "spatialReference":{"wkid":102100}
                  }
        },
        {            
          'name' : 'Daegu',
          'image' : null,
          'extent' : {
                      "xmin":14303307.736117812,"ymin":4274406.414936752,"xmax":14330003.368246375,"ymax":4289024.996596272,
                      "spatialReference":{"wkid":102100}
                    }
          }
        ]
      }
      ]
}

export default eventsConfig;


