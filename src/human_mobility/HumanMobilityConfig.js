// update to map

import NYCImage from "../resources/images/NYC.jpg";
import BarcelonaImage from "../resources/images/Barcelona.jpg";
import TokyoImage from "../resources/images/Tokyo.jpg";

//var webmapIdEnv = '0fa7af7958504e2380da22f2c6df6d02';
var webmapIdEnv = '8813ecd31e644560ba01e90a89fd8b3e';



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

const defaultLayerOutFields = ['average_speed','pedestrian_density','bicycles_density', 'agg_hour', 'day_of_week', 'segment_id'];


const humanMobilityConfig = {
  webmapId: webmapIdEnv,
  //layerRefreshIntervalMin: 1,

  initialRendererField: 'average_speed',
  renderers : {
    'average_speed': {
      _type: "jsapi",
      type: 'class-breaks',
      field: 'average_speed',
      classBreakInfos: [{
        minValue: 0,
        maxValue: 30,
        symbol: {type: "simple-line", width: "2.8px", color: [215,25,28,255]},
        label: "Low"
      }, {
        minValue: 30,
        maxValue: 50,
        symbol: {type: "simple-line", width: "2.8px", color: [253,174,97,255]},
        label: "Average"
      }, {
        minValue: 50,
        maxValue: 90,
        symbol: {type: "simple-line", width: "2.8px", color: [255,255,191,255]},
        label: "High"
      }, {
        minValue: 100,
        maxValue: 1000,
        symbol: {type: "simple-line", width: "2.8px", color: [171,217,233,255]},
        label: "Very High"
      }]
    },
    'pedestrian_density': getClassBreakRenderer('pedestrian_density',[0,1,2,3,4],['Low','Medium','High','Very High'],[[171,217,233,255],[255,255,191,255],[253,174,97,255],[215,25,28,255]]),
    'bicycles_density': getClassBreakRenderer('bicycles_density',[0,5,8,10,100],['Low','Medium','High','Very High'],[[171,217,233,255],[255,255,191,255],[253,174,97,255],[215,25,28,255]]),
  }
  ,
  filters: [
    {name: 'day_of_week', type: 'multiselect'},
    {name: 'agg_hour', type: 'minmax',
          params:{'lowerBoundLabel':0, 'upperBoundLabel':24, 'lowerBound':0, 'upperBound':24, 'numBins':23,
          marks : {
            0:'0',3:'3',6:'6',9:'9',12:'12',15:'15',18:'18',21:'21',24:'24'
          },
        step: 1, min:7, max:10, tooltipVisible:true}},
  ],
  hasCustomTooltip: true,

  layers : [
    {id: 0, type: "static", defaultRendererField: 'ID', name:"bicycles_lanes", title:"Bicycle lanes", showFilter:false},
    {id: 1, type: "live", outFields: defaultLayerOutFields, baselineWhereCondition: " and average_speed > 0", defaultRendererField: 'average_speed', name:"average_speed", title:"Average speed" , postText:"Km/H", showFilter:true},
    {id: 2, type: "live", outFields: defaultLayerOutFields, baselineWhereCondition: " and pedestrian_density > 0", defaultRendererField: 'pedestrian_density', name:"pedestrian_density", title:"Pedestrian density", postText:"Per ride", showFilter:true},
    {id: 3, type: "live", outFields: defaultLayerOutFields, baselineWhereCondition: " and bicycles_density > 0", defaultRendererField: 'bicycles_density', name:"bicycles_density", title:"Bicycle density", postText:"Per ride", showFilter:true},
    {id: 4, type: "live", outFields: defaultLayerOutFields, baselineWhereCondition: " and average_speed > 0", defaultRendererField: 'average_speed', name:"average_speed_count", title:"Number of rides" , postText:"Rides", showFilter:false},
   ],

  onMouseOutStatistics:
  [
    {
      onStatisticField: 'average_speed',
      outStatisticFieldName: 'average_speed',
      statisticType: 'avg'
    },
    {
      onStatisticField: 'average_speed',
      outStatisticFieldName: 'average_speed_count',
      statisticType: 'count'
    },
                                    {
      onStatisticField: 'pedestrian_density',
      outStatisticFieldName: 'pedestrian_density',
      statisticType: 'avg'
    },
    {
      onStatisticField: 'pedestrian_density',
      outStatisticFieldName: 'pedestrian_density_count',
      statisticType: 'count'
    },
    {
      onStatisticField: 'bicycles_density',
      outStatisticFieldName: 'bicycles_density',
      statisticType: 'avg'
    },
    {
      onStatisticField: 'bicycles_density',
      outStatisticFieldName: 'bicycles_density_count',
      statisticType: 'count'
    },
  ],
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


