// update to map

import bicycleImage from '../resources/images/ET_BICYCLE.png'
import pedImage from '../resources/images/ET_PED_ON_HW.png'
import NYCImage from "../resources/images/NYC.jpg";
import BarcelonaImage from "../resources/images/Barcelona.jpg";
import TokyoImage from "../resources/images/Tokyo.jpg";
import CarImage from '../resources/svg/svgrepo/sports-car.svg';
import BarrierImage from '../resources/svg/svgrepo/barrier.svg';

const  popupTemplate =  {
    title: "Event information:",
    content: "Event type: <b>{eventType}</b><br>" +
        "Project: {project}<br>" +
        "Event value: {eventValue}<br>" +
        "First seen: {eventTimestamp}<br>" +
        "Expiration timestamp: {eventExpirationTimestamp}"

  }

const getClassBreakRenderer = (field,stops,labels,colors,width,caption) => ({
    _type: "jsapi",
    type: 'class-breaks',
    field: field,
    //valueExpression: "($feature.avg_spd_0_0 + $feature.avg_spd_1_0 + $feature.avg_spd_2_0 + $feature.avg_spd_3_0)/4",
    legendOptions: {
        title:caption
    },
    classBreakInfos: [{
      minValue: stops[0],
      maxValue: stops[1],
      symbol: {type: "simple-line", width: width[0], color: colors[0]},
      label: labels[0]
    }, {
      minValue: stops[1],
      maxValue: stops[2],
      symbol: {type: "simple-line", width: width[1], color: colors[1]},
      label: labels[1]
    }, {
      minValue: stops[2],
      maxValue: stops[3],
      symbol: {type: "simple-line", width: width[2], color: colors[2]},
      label: labels[2]
    }, {
      minValue: stops[3],
      maxValue: stops[4],
      symbol: {type: "simple-line", width: width[3], color: colors[3]},
      label: labels[3]
    }]
})
const speedRenderer = (field) =>
     getClassBreakRenderer(field, [0, 15, 50, 100, 1000], ['0-15 km/h','15-50 km/h','50-100 km/h','100+ km/h '],
      [[230,74,25,255],[255,196,0,255],[255,241,118,255],[212,225,87,255]], ["2.3px","2.3px","2.3px","2.3px"], "Average speed");

//const eventsBaselineWhereCondition = 'eventExpirationTimestamp >= CURRENT_TIMESTAMP - 1 AND eventExpirationTimestamp <= CURRENT_TIMESTAMP + 3'
//                                      eventExpirationTimestamp <= CURRENT_TIMESTAMP + 3 AND eventExpirationTimestamp >= CURRENT_TIMESTAMP
const eventsBaselineWhereCondition = '1=1'

var webmapIdEnv = '37f6876be7dc4d7e8166c3ef0df0c3aa';
//var webmapIdEnv = '8813ecd31e644560ba01e90a89fd8b3e';



if (process.env.EVENTS_WEBMAP_ID){
    webmapIdEnv = process.env.EVENTS_WEBMAP_ID;
}

const eventsConfig = {
  webmapId: '8654f5c608384b9eb7e06fd566643afc',
  initialRendererField: 'eventType',
  renderers : {
    'averageSpeed': speedRenderer('avg_last_hour'),
    'eventType': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "eventType",
      //defaultSymbol: {type: "simple-marker", color: "blue"},
      uniqueValueInfos: [
      {
        value: "pedestrians",
        label:"Pedestrians",

        symbol: {
          type: "picture-marker",
          height: '20px',
          width: '20px',
          url: pedImage
        },
      }, {
        value: "bicycles",
        label:"Bicycles",

        symbol: {
          type: "picture-marker",
          height: '20px',
          width: '20px',
          url: bicycleImage
        }
      },

      {
        value: "ET_PHYSICAL_OBJECT",
        label:"Physical object",
        symbol: {
          type: "picture-marker",
          height: '22px',
          width: '22px',
          url: BarrierImage,
        }
      },
      {
        value: "EID_STOPPED_CAR_ON_HW_SHOULDER",
        label:"Stopped car",

        symbol: {
          type: "picture-marker",
          height: '20px',
          width: '20px',
          url: CarImage,
        }
      },
      {
        value: "EID_VRU_ON_HW",
        label:"Pedestrian/cyclist on high speed road",
        symbol: {
          type: "picture-marker",
          height: '20px',
          width: '20px',
          url: pedImage
        }
      },
      {
        value: "ET_CONSTRUCTION_AREA",
        label:"Construction areas",
        symbol: {
          type: "simple-line",
          width: '4.6px',
          style: 'short-dash',
          color: '#FF6D00',
        }
      },
      ]
    }
  }
  ,
  layers : [
    {id: 0, type: "live", name: "events0", popupTemplate: popupTemplate,showLegend:true},// baselineWhereCondition:eventsBaselineWhereCondition},
    {id: 1, type: "live", name: "events1" ,popupTemplate: popupTemplate,showLegend:false},// baselineWhereCondition:eventsBaselineWhereCondition},
    {id: 2, type: "live", name: "speed",showLegend:true,
        defaultRendererField: 'averageSpeed',
        customDefaultFilter:"avg_last_hour > 0", ignoreRendererUpdate: true, ignoreFilter: true},

  ],
  filters: [
    {name: 'eventExpirationTimestamp', type: 'minmax', params:{min:"CURRENT_TIMESTAMP", max:"CURRENT_TIMESTAMP + 3"}},
    {name: 'eventType', type: 'multiselect',
        params: {style: "toggle", mode:'multiple',
            customFieldDomainMap: new Map([
                                          ['ET_CONSTRUCTION_AREA', 'Construction areas'],
                                          ['ET_PHYSICAL_OBJECT', 'Physical object'],
                                          ['EID_STOPPED_CAR_ON_HW_SHOULDER',    'Stopped car'],
                                          ['ped_cycl', 'Pedestrian / cyclist']
                                        ]),
            optionsToRemovePostfix:"_test",
            optionsToMerge: new Map([
                                    ['pedestrians', 'ped_cycl'],
                                    ['bicycles', 'ped_cycl'],
                                    ['EID_VRU_ON_HW', 'ped_cycl']
                                  ]),
        }
    },
//    {name: 'project', type: 'multiselect', params: {lowerBound: 0, upperBound: 100, log: true}},
//    {name: 'eventtimestamp', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
  ],
  viewConfig: {
    center: [-74.00157, 40.71955],
    //center: [128.608705, 35.862483],
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


