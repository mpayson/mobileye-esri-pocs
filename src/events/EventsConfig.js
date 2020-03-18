// update to map

import bikeSvg from '../resources/svg/events/bike.svg';
import pedSvg from '../resources/svg/events/pedestrian-01.svg';
import carSvg from '../resources/svg/events/parking-01.svg';
import hazardSvg from '../resources/svg/events/hazard-01.svg';
import fogSvg from '../resources/svg/events/fog-01.svg';

import bikeLegendSvg from '../resources/svg/events/bike_legend-01.svg';
import pedLegendSvg from '../resources/svg/events/ped_legend-01.svg';
import carLegendSvg from '../resources/svg/events/car_legend-01.svg';
import hazardLegendSvg from '../resources/svg/events/hazard_legend-01.svg';
import fogLegendSvg from '../resources/svg/events/fog_legend-01.svg';

import NYCImage from "../resources/images/NYC.jpg";
import BarcelonaImage from "../resources/images/Barcelona.jpg";
import TokyoImage from "../resources/images/Tokyo.jpg";
import TelAvivImage from '../resources/images/tel-aviv-yafo.jpg';
import DaeguImage from '../resources/images/Daegu.jpg';

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
      symbol: {type: "simple-line", width: width[0], color: colors[0], onHoverScale: 4.0},
      label: labels[0]
    }, {
      minValue: stops[1],
      maxValue: stops[2],
      symbol: {type: "simple-line", width: width[1], color: colors[1], onHoverScale: 4.0},
      label: labels[1]
    }, {
      minValue: stops[2],
      maxValue: stops[3],
      symbol: {type: "simple-line", width: width[2], color: colors[2], onHoverScale: 4.0},
      label: labels[2]
    }, {
      minValue: stops[3],
      maxValue: stops[4],
      symbol: {type: "simple-line", width: width[3], color: colors[3], onHoverScale: 4.0},
      label: labels[3]
    }]
})
const speedRenderer = (field) =>
     getClassBreakRenderer(field, [0, 15, 50, 100, 1000], ['0-15 km/h','15-50 km/h','50-100 km/h','100+ km/h '],
      [[230,74,25,255],[255,128,0,255],[255,255,0,255],[51,255,51,255]], ["2.3px","2.3px","2.3px","2.3px"], "Average speed");

//const eventsBaselineWhereCondition = 'eventExpirationTimestamp >= CURRENT_TIMESTAMP - 1 AND eventExpirationTimestamp <= CURRENT_TIMESTAMP + 3'
//                                      eventExpirationTimestamp <= CURRENT_TIMESTAMP + 3 AND eventExpirationTimestamp >= CURRENT_TIMESTAMP
const eventsBaselineWhereCondition = '1=1'

var webmapIdEnv = '2031e577726743ad86e9391f14209ccb';
//var webmapIdEnv = '8654f5c608384b9eb7e06fd566643afc';

if (process.env.EVENTS_WEBMAP_ID){
    webmapIdEnv = process.env.EVENTS_WEBMAP_ID;
}

const defaultMapIconSize = {
  width: 35,
  height: 35,
  onHoverScale: 1.4,
};
const defaultLegendIconSize = {
  width: 30,
  height: 30,
};
const eventsConfig = {
  webmapId: webmapIdEnv,
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
        value: "bicycle_aggregation",
        label: "Bicycles",
        symbol: {
          type: "picture-marker",
          url: bikeSvg,
          ...defaultMapIconSize,
        },
        legendSymbol: {
          url: bikeLegendSvg,
          ...defaultLegendIconSize,
        }
      },
      {
        value: "object_on_road",
        label:"Object on road",
        symbol: {
          type: "picture-marker",
          url: hazardSvg,
          ...defaultMapIconSize,
        },
        legendSymbol: {
          url: hazardLegendSvg,
          ...defaultLegendIconSize,
        }
      },
      {
        value: "stopped_car_on_hard_shoulder",
        label:"Stopped car",

        symbol: {
          type: "picture-marker",
          url: carSvg,
          ...defaultMapIconSize,
        },
        legendSymbol: {
          url: carLegendSvg,
          ...defaultLegendIconSize,
        }
      },
      {
        value: "pedestrian_on_high_speed_road",
        label:"Pedestrian/cyclist on high speed road",
        symbol: {
          type: "picture-marker",
          url: pedSvg,
          ...defaultMapIconSize,
        },
        legendSymbol: {
          url: pedLegendSvg,
          ...defaultLegendIconSize,
        }
      },
      {
        value: "fog",
        label: "Fog",
        symbol: {
          type: "picture-marker",
          url: fogSvg,
          ...defaultMapIconSize,
        },
        legendSymbol: {
          url: fogLegendSvg,
          ...defaultLegendIconSize,
        }
      },
      {
        value: "construction",
        label:"Construction areas",
        symbol: {
          type: "simple-line",
          width: 4,
          // style: 'short-dash',
          color: 'rgba(255, 255, 255,0.7)',
          onHoverScale: 3,
          ignoreVisualVariables: true,
        }
      },
      ],
      visualVariables: [
        {
          type: "size",
          valueExpression: "Find('construction', $feature.eventType) * -$view.scale",
          legendOptions: {
            showLegend: false,
          },
          stops: [
            {value: 0, size: defaultMapIconSize.width * 0.12}, // <- construction
            {value: 1, size: defaultMapIconSize.width},       // <- all others
            // {value: 18055, size: defaultMapIconSize.width},
            {value: 36111, size: defaultMapIconSize.width * 0.8},
            {value: 72223, size: defaultMapIconSize.width * 0.6},
            {value: 144447, size: defaultMapIconSize.width * 0.5},
            {value: 288895, size: defaultMapIconSize.width * 0.35},
          ]
        },
      ],
    }
  }
  ,
      //hasZoomListener: true,

  layers : [
    {
      id: 0, 
      type: "live", 
      name: "events0", 
      popupTemplate: popupTemplate,
      showLegend: true, 
      outFields: ['eventType', 'eventTimestamp', 'eventExpirationTimestamp'],
      refreshInterval: 10
    },// baselineWhereCondition:eventsBaselineWhereCondition},
    {
      id: 1, 
      type: "live", 
      name: "events1",
      popupTemplate: popupTemplate,
      showLegend: false,
      outFields: ['eventType', 'eventTimestamp', 'eventExpirationTimestamp'],
      refreshInterval: 10
    },// baselineWhereCondition:eventsBaselineWhereCondition},
    {
      id: 2, 
      type: "live", 
      name: "speed",
      popupTemplate: null,
      showLegend: true,
      defaultRendererField: 'averageSpeed', 
      outFields: ['avg_last_15_min', 'avg_last_hour', 'avg_last_3_hours'],
      customDefaultFilter:"avg_last_hour > 0", 
      refreshInterval: 10,
      ignoreRendererUpdate: true, 
      ignoreFilter: true,
      // initialZoomExpression: 'SHAPE__LENGTH > 45', // gets initially added to baseline where
      // applies where corresponding to lowest specified zoom that is greater than map zoom
      // zoomExpressions: [
      //   {zoom: 14, where: 'SHAPE__LENGTH > 45'}, // 50% of data
      // ]

    },

  ],
  filters: [
    {name: 'eventExpirationTimestamp', type: 'minmax', params:{min:"CURRENT_TIMESTAMP", max:"CURRENT_TIMESTAMP + 3"}},
    {name: 'eventType', type: 'multiselect',
        params: {style: "toggle", mode:'multiple', setSelectedValuesFromDomain:true,
            customFieldDomainMap: new Map([
                                          ['fog', 'Fog'],
                                          ['construction', 'Construction areas'],
                                          ['object_on_road', 'Physical object'],
                                          ['stopped_car_on_hard_shoulder',    'Stopped car'],
                                          ['ped_cycl', 'Pedestrian / cyclist']
                                        ]),
            optionsToRemovePostfix:"_test",
            optionsToMerge: new Map([
                                    ['pedestrian_aggregation', 'ped_cycl'],
                                    ['bicycle_aggregation', 'ped_cycl'],
                                    ['pedestrian_on_high_speed_road', 'ped_cycl']
                                  ]),
        }
    },
//    {name: 'project', type: 'multiselect', params: {lowerBound: 0, upperBound: 100, log: true}},
//    {name: 'eventtimestamp', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
  ],
  customLegendIcons: true,
  renderIconsAboveStreetNames: true,
  hasCustomTooltip: true,
  onHoverEffect: 'upscale',
  statisticsFieldsInfo: { 
    'avg_last_15_min':  {title: 'Average speed for the last 15 minutes',  postText: 'km/h', iconTag: 'speed'},
    'avg_last_hour':    {title: 'Average speed for the last hour',        postText: 'km/h', iconTag: 'speed'},
    'avg_last_3_hours': {title: 'Average speed for the last 3 hours',     postText: 'km/h', iconTag: 'speed'},
  },
  timestampFieldsInfo: {
    'eventTimestamp': {title: 'Detection time'},
  },
  overrideFieldsInfoByEventType: {
    'construction': {
      'eventTimestamp': {title: 'First detected', noIcon: true},
      'eventExpirationTimestamp': {title: 'Expiration', noIcon: true},
    }
  },
  viewConfig: {
    //center: [-74.00157, 40.71955],
    center: [128.608705, 35.862483],
    zoom: 14
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
      {
        areaName: 'Middle East',
        locations: [{
          name: 'Israel',
          image: TelAvivImage,
          extent: {
            xmin: 3757032.8142690174, 
            ymin: 3678761.2973109875, 
            xmax: 3835304.331233021, 
            ymax: 3835304.331238987, 
            spatialReference: {
              wkid: 3857
            }
          }
        }] 
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
          'image' : DaeguImage,
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


