// update to map

import NYCImage from "../resources/images/NYC.jpg";
import BarcelonaImage from "../resources/images/Barcelona.jpg";
import TokyoImage from "../resources/images/Tokyo.jpg";

var webmapIdEnv = '0b800d1e71d94002b8d2451dcd08155d';
//var webmapIdEnv = '8813ecd31e644560ba01e90a89fd8b3e';



if (process.env.WEBMAP_ID){
    webmapIdEnv = process.env.WEBMAP_ID;
}

const getClassBreakRenderer = (field,stops,labels,colors,width,caption) => ({
    _type: "jsapi",
    type: 'class-breaks',
    //field: field,
    valueExpression: "($feature.avg_spd_0_0 + $feature.avg_spd_1_0 + $feature.avg_spd_2_0 + $feature.avg_spd_3_0)/4",
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

const defaultLayerOutFields = ['average_speed','pedestrian_density','bicycles_density', 'agg_hour', 'day_of_week', 'segment_id'];


const humanMobilityConfig = {
  webmapId: webmapIdEnv,
  //layerRefreshIntervalMin: 1,

//  initialRendererField: 'average_speed',
  renderers : {
    'avg_spd': getClassBreakRenderer('avg_spd',[0,30,50,90,1000],
        ['0-30 km/h','30-50 km/h','50-100 km/h','100+ km/h '],[[206,22,32,255],[255,89,103,255],[241,173,179,255],[254,220,225,255]],["2.3px","2.3px","2.3px","2.3px"],"Average speed"),
    'ped_den': getClassBreakRenderer('ped_den',[0,3,10,20,500],['Low','Medium','High','Very High'],[[0,54,104,255], [0,108,226,255], [129,189,255,255],[248,255,248,255]],["2.3px","2.3px","2.3px","2.3px"],"Average pedestrian volume"),
    'bic_den': getClassBreakRenderer('bic_den',[0,2,5,20,500],['Low','Medium','High','Very High'],[[65,72,51,255], [0,128,0,255], [133,187,101,255], [172,255,175,255]],["2.3px","2.3px","2.3px","2.3px"],"Average cyclist volume"),
  }
  ,
  filters: [
    {name: 'day_of_week', type: 'dayofweek', params: {style: 'radio'}},
    {name: 'hour', type: 'minmax',
          params:{'lowerBoundLabel':0, 'upperBoundLabel':24, 'lowerBound':0, 'upperBound':24, 'numBins':23,
          marks : {
            0:'0',3:'3',6:'6',9:'9',12:'12',15:'15',18:'18',21:'21',24:'24'
          },
        step: 1, min:6, max:18, tooltipVisible:true}},
  ],
  hasCustomTooltip: true,
  hasZoomListener: true,
  initialRendererField: 'avg_spd',
  layers : [
    {id: 0, type: "static", customLegendTitle: "Bus stops", showLegend:true , defaultRendererField: 'ID', name:"bus_stops", title:"Bus stops", showFilter:false},
    {id: 1, type: "static",customLegendTitle: "Bicycle lanes", showLegend:true , defaultRendererField: 'ID', name:"bicycles_lanes", title:"Bike lanes", showFilter:false},
    {
      id: 2,
      type: "live",
      showLegend:true,
      outFields:'*',
      baselineWhereCondition: "project = 'me8'",
      defaultRendererField: 'avg_spd',
      name:"avg_spd",
      title:"Average speed",
      postText:"km/h",
      showFilter:true,
      initialZoomExpression: 'SHAPE__LENGTH > 45', // gets initially added to baseline where
      // applies where corresponding to lowest specified zoom that is greater than map zoom
      zoomExpressions: [
        {zoom: 14, where: 'SHAPE__LENGTH > 45'}, // 50% of data
      ]
    },
//    {id: 3, type: "live", showLegend:true , outFields: defaultLayerOutFields, baselineWhereCondition: " pedestrian_density >= 0",   defaultRendererField: 'pedestrian_density', name:"pedestrian_density", title:"Average pedestrian volume", postText:"per ride", showFilter:true},
//    {id: 4, type: "live", showLegend:true , outFields: defaultLayerOutFields, baselineWhereCondition: " bicycles_density >= 0", defaultRendererField: 'bicycles_density', name:"bicycles_density", title:"Average cyclist volume", postText:"per ride", showFilter:true}

    ],

  statisticsFieldsInfo: { 'avg_spd': {title:"Average speed      " , postText:"km/h"},
                    'ped_den': {title:"Average pedestrian volume" , postText:"per ride"},
                    'bic_den': {title:"Average cyclist volume" , postText:"per ride"},
                },
  liveLayersStartIndex: 2,
  defaultVisibleLayersList: [0,1,2],

  // onMouseOutStatistics:
  // [
  //   {
  //     onStatisticField: 'average_speed',
  //     outStatisticFieldName: 'average_speed',
  //     statisticType: 'avg'
  //   },
  //   {
  //     onStatisticField: 'pedestrian_density',
  //     outStatisticFieldName: 'pedestrian_density',
  //     statisticType: 'avg'
  //   },
  //   {
  //     onStatisticField: 'bicycles_density',
  //     outStatisticFieldName: 'bicycles_density',
  //     statisticType: 'avg'
  //   },
  // ],
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


