import BarcelonaImage from '../resources/images/Barcelona.jpg'
import { getClassBreakInfos } from '../utils/config';

import TelAvivImage from '../resources/images/tel-aviv-yafo.jpg';
export const QUERY_ME8_DATA = "project = 'me8'";
export const QUERY_OEM_DATA = "project <> 'me8'";

const ME8_COLORS = [
 [44,123,182,255], [171,217,233,255], [255,255,191,255], [253,174,97,255], [215,25,28,255],
];

const OEM_COLORS = [
  [0,99,177,1], [0,183,195,1], [255,185,0,1], [247,99,12,1], [232,17,35,1],
];

const onHoverScale = 2.0;
// for now expect exactly 5 stops that map to the same color ramp
const getRenderer = (field, queries, visuals, labels, caption) => {
  const createVisualVariable = (stops, colors) => ({
    type: "color",
    field,
    legendOptions: { 
      title: caption
    },
    stops: stops.map((value, i) => ({
      value, 
      color: colors[i], 
      label: i % 2 ? labels[i/2] : null
    }))
  });

  Object.values(visuals).forEach(vis => vis.stops.sort());
  const visualVariablesByQuery = queries.reduce((out, query, i) => {
    out[query] = createVisualVariable(visuals[i].stops, visuals[i].colors);
    return out;
  }, {});
  const defaults = visualVariablesByQuery[queries[0]];

  return {
    _type: "jsapi",
    type: "simple",
    field,
    symbol: { type: "simple-line", width: "2.3px", onHoverScale },
    label: "Road segment",
    visualVariables: [defaults],
    visualVariablesByQuery,
  }
}

var webmapIdEnv = '6512c324486d4b618ef568bdba6d9dcd';
//var webmapIdEnv = '906b58f399944774a29e05d3d24a939b';

if (process.env.SAFETY_WEBMAP_ID){
    webmapIdEnv = process.env.SAFETY_WEBMAP_ID;
}


const safetyConfig = {
  //layerItemId: '534f26d211154527b31c976ea6b5eafe',
  //layerItemId: 'e37cc788804e4303b6e7898481798691',
  // webmapId: '906b58f399944774a29e05d3d24a939b',
  // updating for now to vector, it's cleaner
  webmapId: webmapIdEnv,
  //webmapId: 'c54f0d3d4555429fa8e4a4250ed12164',

  // webmapId: '58d18243967d40e9a25db1f02d3652b0',
  initialRendererField: 'risk_score',
  renderers: {
    'risk_score': {
      _type: "jsapi",
      type: 'class-breaks',
      field: 'risk_score',
      legendOptions: {
        title: "Road risk score"
      },
      classBreakInfos: getClassBreakInfos({
        stops: [0, 0.15, 4, 10, 1000],
        labels: ["Low", "Average", "High", "Very High"],
        colors: [[171,217,233,1], [255,255,191,1], [253,174,97,1], [215,25,28,1]],
        type: "simple-line", width: "2.3px", onHoverScale,
      }),
      classBreakInfosByQuery: {
        "project <> 'me8'": getClassBreakInfos({
          stops: [0, 0.2, 0.75, 1.5, 500],
          labels: ["Low", "Average", "High", "Very High"],
          colors: [[171,217,233,1], [255,255,191,1], [253,174,97,1], [215,25,28,1]],
          type: "simple-line", width: "2.3px", onHoverScale,
        })
      }
    },

    'pcw': getRenderer('pcw',
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0, 0.75, 1.5, 3.5, 10], colors: ME8_COLORS},
        {stops: [0,0.011,0.023,0.034,0.057], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Pedestrian collision warning (PCW)"),

    'fcw': getRenderer('fcw',
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0, 0.5, 1.5, 3.5, 10], colors: ME8_COLORS},
        {stops: [0,0.011,0.043,0.5,1], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Forward collision warning (FCW)"),

    'harsh_breaking_ratio': getRenderer('harsh_breaking_ratio',
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0, 0.043, 0.15, 0.25, 1], colors: ME8_COLORS},
        {stops: [0,0.02,0.1,1.5,14], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Harsh braking"),

    'harsh_cornering_ratio': getRenderer('harsh_cornering_ratio', 
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0.0, 0.153, 0.4, 0.666, 1.0], colors: ME8_COLORS},
        {stops: [0,0.02,0.1,1.5,14], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Harsh cornering"),

    'pedestrians_density': getRenderer('pedestrians_density', 
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0, 9.0, 25.375, 49.5, 100], colors: ME8_COLORS},
        {stops: [0,1,14,20,1.2], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Average pedestrian volume"),

    'bicycles_density': getRenderer('bicycles_density', 
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0, 2.2, 5.28, 10.5, 100], colors: ME8_COLORS},
        {stops: [0,1,14,20,1.2], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Average cyclist volume"),

    'speeding_ratio': getRenderer('speeding_ratio',
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0, 0.083, 0.187, 0.33, 1], colors: ME8_COLORS},
        {stops: [0,0.01,0.1,0.5,15], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Above average speed"),

    'average_speed': getRenderer('average_speed',
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0,40,70,100,190], colors: ME8_COLORS},
        {stops: [28,38,48,58,68], colors: OEM_COLORS},
      ],['Low','Medium','High'], "Average speed")
  },
  filters: [{
    name:'risk_score',
    type: 'quantile',
    params: {
      quantiles: [{
        min: 0,
        max: 0.15,
        // label: "Low (30%)",
        label: "Low"
      }, {
        min: 0.15,
        max: 4,
        // label: "Average (40%)",
        label: "Average"
      }, {
        min: 4,
        max: 10,
        // label: "High (20%)"
        label: "High"
      }, {
        min: 10,
        max: 1000,
        // label: "Very High (10%)"
        label: "Very High"
      }],
      info: "Road risk score based on the variables below.",
      style: "button"
    }
  },{
    name: 'fcw',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Forward collision warning (FCW)"
    }
  },{
    name: 'pcw',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Pedestrian and cyclist collision warning (PCW)"
    }
  },{
    name: 'harsh_breaking_ratio',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Percentage of cars that brake harshly in the segment.",
    }
  },{
    name: 'harsh_cornering_ratio',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Percentage of cars that turn the corner with high G-force."
    }
  },{
    name: 'speeding_ratio',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "The percentage of vehicles that drive a standard deviation above the average speed at the segment."
    }
  },{
    name: 'pedestrians_density',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Density of pedestrians over the segment."
    }
  },{
    name: 'bicycles_density',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Density of bicycles over the segment."
    }
  },{
    name: 'average_speed',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: '0',
      upperBoundLabel: '140',
      info: "Average speed of the respective segment. (Does not contribute to risk score on its own)."
    }
  }],
    hasZoomListener: true,

   layers : [
    {
      id: 0,
      type: "live",
      //popupTemplate: null,
      showLegend:true,
      outFields:'*',
      // baselineWhereCondition: "project = 'me8'",
      customDefaultFilter: QUERY_ME8_DATA,
      defaultRendererField: 'risk_score',
      name:"risk_score",
      //ignoreFilter:true,
      initialZoomExpression: 'SHAPE__LENGTH > 45', // gets initially added to baseline where
      // applies where corresponding to lowest specified zoom that is greater than map zoom
       zoomExpressions: [
         {zoom: 14, where: 'SHAPE__LENGTH > 45'}, // 50% of data
       ]
    }],
  hasCustomTooltip: true,
  onHoverEffect: 'upscale',
  outFields: [
    'risk_score', 'harsh_cornering_ratio', 'harsh_breaking_ratio', 'pedestrians_density',
    'bicycles_density', 'speeding_ratio', 'average_speed','pcw','fcw'
  ], 
  popupTemplate: null,

  viewConfig: {
   center: [2.1532,41.3842],
    zoom: 12
  },
  bookmarkInfos: {
    'Israel': {
      title: 'Israel',
      content: ''
    },
    'Manhattan': {
      title: 'Manhattan',
      content: ''
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
  ]
}
export default safetyConfig;
