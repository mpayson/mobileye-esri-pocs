// update to map

import NYCImage from "../resources/images/NYC.jpg";
import BarcelonaImage from "../resources/images/Barcelona.jpg";
import TokyoImage from "../resources/images/Tokyo.jpg";
import DaeguImage from '../resources/images/Daegu.jpg';
import TelAvivImage from '../resources/images/tel-aviv-yafo.jpg';


//var webmapIdEnv = '0b800d1e71d94002b8d2451dcd08155d';
var webmapIdEnv = '47c2853d45f94c1eba60266455626792';
//var webmapIdEnv = '3f5bddef8d444030855f6489ae6eca30';

if (process.env.MOBILITY_WEBMAP_ID){
    webmapIdEnv = process.env.MOBILITY_WEBMAP_ID;
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
  renderers : {
    'ped_den': getClassBreakRenderer('ped_den',[0, 9.0, 25.375, 49.5, 900],['Low','Medium','High','Very High'],[[0,54,104,255], [0,108,226,255], [129,189,255,255],[248,255,248,255]],["2.3px","2.3px","2.3px","2.3px"],"Average pedestrian volume"),
    'bic_den': getClassBreakRenderer('bic_den',[0, 2.2, 5.285714285714286, 10.5, 100],['Low','Medium','High','Very High'],[[65,72,51,255], [0,128,0,255], [133,187,101,255], [226,255,246,255]],["2.3px","2.3px","2.3px","2.3px"],"Average cyclist volume"),
    'avg_spd': getClassBreakRenderer('avg_spd',[0,15,50,100,1000],
        ['0-15 km/h','15-50 km/h','50-100 km/h','100+ km/h '],[[230,74,25,255],[255,128,0,255],[255,255,0,255],[51,255,51,255]],["2.3px","2.3px","2.3px","2.3px"],"Average speed"),
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
  initialRendererField: 'ped_den',
  layers : [
    {id: 0, type: "static", popupTemplate: null, customLegendTitle: "Bus stops", outFields: ['FID', 'CODI_CAPA'], showLegend:true, defaultRendererField: 'ID', name:"bus_stops", title:"Bus stops", ignoreFilter:true},
    {id: 1, type: "static", popupTemplate: null, customLegendTitle: "Bicycle lanes", outFields: ['FID', 'TOOLTIP'], showLegend:true , defaultRendererField: 'ID', name:"bicycles_lanes", title:"Bike lanes", ignoreFilter:true},
    {
      id: 2,
      type: "live",
      popupTemplate: null,
      showLegend:true,
      outFields:'*',
      baselineWhereCondition: "project = 'me8'",
      defaultRendererField: 'avg_spd',
      name:"avg_spd",
      title:"Average speed",
      postText:"km/h",
      ignoreFilter:true,
      initialZoomExpression: 'SHAPE__LENGTH > 45', // gets initially added to baseline where
      //applies where corresponding to lowest specified zoom that is greater than map zoom
      zoomExpressions: [
       {zoom: 14, where: 'SHAPE__LENGTH > 45'}, // 50% of data
      ]
    },

    ],

  statisticsFieldsInfo: { 

    'ped_den': {title:"Average pedestrian volume" , postText:"  Average per ride", iconTag: 'walk'},
    'bic_den': {title:"Average cyclist volume" , postText:"  Average per ride", iconTag: 'bike'},
    'avg_spd': {title:"Average speed" , postText:"  km/h", iconTag: 'speed'},
  },
  liveLayersStartIndex: 2,
  defaultVisibleLayersList: [0,1,2],

  viewConfig: {
    //center: [-74.00157, 40.71955],
    //center: [128.608705, 35.862483],
    center: [2.1532,41.3842],
    zoom: 14
  },
  bookmarkInfos: {
    'Canal St - Combination of risk factors': {
      title: 'Canal St',
      content: 'The red section shows a concentration of alerts in one location, pedestrians, cyclists, speeding and harsh braking.'
     }
  },
  locationsByArea: [
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
      }
//      ,{ areaName : 'APAC',
//        locations: [
//        {
//          'name' : 'Daegu',
//          'image' : DaeguImage,
//          'extent' : {
//                      "xmin":14303307.736117812,"ymin":4274406.414936752,"xmax":14330003.368246375,"ymax":4289024.996596272,
//                      "spatialReference":{"wkid":102100}
//                    }
//          }
//        ]
//      }
      ]
}

export default humanMobilityConfig;


