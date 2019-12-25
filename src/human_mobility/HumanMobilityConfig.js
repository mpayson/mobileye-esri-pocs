// update to map

import NYCImage from "../resources/images/NYC.jpg";
import BarcelonaImage from "../resources/images/Barcelona.jpg";
import TokyoImage from "../resources/images/Tokyo.jpg";

//var webmapIdEnv = '0fa7af7958504e2380da22f2c6df6d02';
var webmapIdEnv = '3753b5bcbce7434398023cb7f74fd454';



if (process.env.WEBMAP_ID){
    webmapIdEnv = process.env.WEBMAP_ID;
}

const getClassBreakRenderer = (field,stops,labels,colors) => ({
    _type: "jsapi",
    type: 'class-breaks',
    field: field,
    classBreakInfos: [{
      minValue: stops[0],
      maxValue: stops[1],
      symbol: {type: "simple-line", width: "2.5px", color: colors[0]},
      label: labels[0]
    }, {
      minValue: stops[1],
      maxValue: stops[2],
      symbol: {type: "simple-line", width: "2.5px", color: colors[1]},
      label: labels[1]
    }, {
      minValue: stops[2],
      maxValue: stops[3],
      symbol: {type: "simple-line", width: "2.5px", color: colors[2]},
      label: labels[2]
    }, {
      minValue: stops[3],
      maxValue: stops[4],
      symbol: {type: "simple-line", width: "2.5px", color: colors[3]},
      label: [3]
    }]
})
const humanMobilityConfig = {
  webmapId: webmapIdEnv,
  //layerRefreshIntervalMin: 1,
  defaultRenderersList: {0:'average_speed',1:'pedestrian_density',2:'bicycles_density'},
  initialRendererField: 'average_speed',
  renderers : {
    'average_speed': {
      _type: "jsapi",
      type: 'class-breaks',
      field: 'average_speed',
      classBreakInfos: [{
        minValue: 0,
        maxValue: 50,
        symbol: {type: "simple-line", width: "2.5px", color: [171,217,233,255]},
        label: "Low"
      }, {
        minValue: 50,
        maxValue: 80,
        symbol: {type: "simple-line", width: "2.5px", color: [255,255,191,255]},
        label: "Average"
      }, {
        minValue: 80,
        maxValue: 120,
        symbol: {type: "simple-line", width: "2.5px", color: [253,174,97,255]},
        label: "High"
      }, {
        minValue: 120,
        maxValue: 1000,
        symbol: {type: "simple-line", width: "2.5px", color: [215,25,28,255]},
        label: "Very High"
      }]
    },
    'pedestrian_density': getClassBreakRenderer('pedestrian_density',[0,1,2,3,4],['Low','Medium','High','Very High'],[[171,217,233,255],[255,255,191,255],[253,174,97,255],[215,25,28,255]]),
    'bicycles_density': getClassBreakRenderer('bicycles_density',[0,1,2,3,4],['Low','Medium','High','Very High'],[[171,217,233,255],[255,255,191,255],[253,174,97,255],[215,25,28,255]]),
  }
  ,
  filters: [
    {name: 'day_of_week', type: 'multiselect'},
    {name: 'hour', type: 'minmax', 
          params:{'lowerBoundLabel':0, 'upperBoundLabel':24, 'lowerBound':0, 'upperBound':24, 'numBins':23,
          marks : {
            0:'0',3:'3',6:'6',9:'9',12:'12',15:'15',18:'18',21:'21',24:'24'
          },
        step: 1, min:2, max:4}},

  ],
  popupTemplate: {
    title: "Event information:",
    content: "Project: <b>{project}</b><br>" +
        "Year: {year}<br>" +

        "Month: {month}<br>" +
        "Day of week: {day_of_week}<br>" +
        "Hour: {hour}<br>" +
        "Segment Id: {segment_id}<br>" +

        "Average speed: {average_speed}<br>" +
        "Pedestrians density: {pedestrian_density}<br>" +
        "Bicycle density: {bicycles_density}<br>" 
  },
  viewConfig: {
    //center: [-74.00157, 40.71955],
    //center: [128.608705, 35.862483],
    center: [2.1732,41.3842],
    zoom: 12
  },
  locationsByArea: [
    { areaName : 'North America',
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

export default humanMobilityConfig;


