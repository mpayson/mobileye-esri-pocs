import NYCImage from '../resources/images/NYC.jpg'
//import AtlantaImage from '../resources/images/Atlanta.jpg'
import TokyoImage from '../resources/images/Tokyo.jpg'
import BarcelonaImage from '../resources/images/Barcelona.jpg'

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
    symbol: { type: "simple-line", width: "2.5px", onHoverScale },
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
      classBreakInfos: [{
        minValue: 0,
        maxValue: 0.5,
        symbol: {type: "simple-line", width: "2.5px", color: [171,217,233,255], onHoverScale},
        label: "Low"
      }, {
        minValue: 0.5,
        maxValue: 1,
        symbol: {type: "simple-line", width: "2.5px", color: [255,255,191,255], onHoverScale},
        label: "Average"
      }, {
        minValue: 1,
        maxValue: 12.5,
        symbol: {type: "simple-line", width: "2.5px", color: [253,174,97,255], onHoverScale},
        label: "High"
      }, {
        minValue: 12.5,
        maxValue: 1000,
        symbol: {type: "simple-line", width: "2.5px", color: [215,25,28,255], onHoverScale},
        label: "Very High"
      }]
    },
    'harsh_breaking_ratio': getRenderer('harsh_breaking_ratio', 
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0,0.02,0.1,1.5,14], colors: ME8_COLORS},
        {stops: [0,0.02,0.1,1.5,14], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Harsh braking"),

    'harsh_cornering_ratio': getRenderer('harsh_cornering_ratio', 
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0,0.02,0.1,1.5,14], colors: ME8_COLORS},
        {stops: [0,0.02,0.1,1.5,14], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Harsh cornering"),

    'pedestrians_density': getRenderer('pedestrians_density', 
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0,1,14,20,1.2], colors: ME8_COLORS},
        {stops: [0,1,14,20,1.2], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Average pedestrian volume"),

    'bicycles_density': getRenderer('bicycles_density', 
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0,1,14,20,1.2], colors: ME8_COLORS},
        {stops: [0,1,14,20,1.2], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Average cyclist volume"),

    'speeding_ratio': getRenderer('speeding_ratio',
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0,0.01,0.1,0.5,15], colors: ME8_COLORS},
        {stops: [0,0.01,0.1,0.5,15], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Above average speed"),

    'average_speed': getRenderer('average_speed',
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [28,38,48,58,68], colors: ME8_COLORS},
        {stops: [28,38,48,58,68], colors: OEM_COLORS},
      ], ['< 25','50','> 70'], "Average speed"),

    'pcw': getRenderer('pcw',
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0,0.01181361,0.02357791,0.03498221,0.05745235], colors: ME8_COLORS},
        {stops: [0,0.01181361,0.02357791,0.03498221,0.05745235], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Pedestrian collision warning (PCW)"),

    'fcw': getRenderer('fcw',
      [QUERY_ME8_DATA, QUERY_OEM_DATA], [
        {stops: [0,0.01181361,0.04357791,0.5,1], colors: ME8_COLORS},
        {stops: [0,0.01181361,0.04357791,0.5,1], colors: OEM_COLORS},
      ], ['Low','Medium','High'], "Forward collision warning (FCW)")
  },
  filters: [{
    name:'risk_score',
    type: 'quantile',
    params: {
      quantiles: [{
        min: 0,
        max: 0.5,
        // label: "Low (30%)",
        label: "Low"
      }, {
        min: 0.5,
        max: 1,
        // label: "Average (40%)",
        label: "Average"
      }, {
        min: 1,
        max: 12.5,
        // label: "High (20%)"
        label: "High"
      }, {
        min: 12.5,
        max: 1000,
        // label: "Very High (10%)"
        label: "Very High"
      }],
      info: "Road risk score based on the variables below.",
      style: "button"
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
    name: 'average_speed',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: '0',
      upperBoundLabel: '140',
      info: "Average speed of the respective segment. (Does not contribute to risk score on its own)."
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
    name: 'fcw',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Forward collision warning (FCW)"
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
  //for n
  // popupTemplate: {
  //   title: "Road Segment Information",
  //   content: [{
  //     type: "text",
  //     text: "<b>Road Risk Score: {expression/round_score}</b>",
  //   }, {
  //     type: "fields",
  //     fieldInfos: [{
  //       fieldName: 'harsh_cornering_ratio',
  //       label: 'Harsh cornering (%)',
  //       format: {
  //         places: 2,
  //         digitSeparator: true
  //       },
  //     }, {
  //       fieldName: 'harsh_breaking_ratio',
  //       label: "Harsh braking (%)",
  //       format: {
  //         places: 2,
  //         digitSeparator: true
  //       },
  //     }, {
  //       fieldName: 'pedestrians_density',
  //       label: "Average pedestrian volume",
  //       format: {
  //         places: 2,
  //         digitSeparator: true
  //       },
  //     }, {
  //       fieldName: 'bicycles_density',
  //       label: 'Average cyclist volume',
  //       format: {
  //         places: 2,
  //         digitSeparator: true
  //       },
  //     }, {
  //       fieldName: 'speeding_ratio',
  //       label: 'Above average speeds (%)',
  //       format: {
  //         places: 2,
  //         digitSeparator: true
  //       },
  //     }, {
  //       fieldName: 'average_speed',
  //       label: 'Average speed (Km/H)',
  //       format: {
  //         places: 2,
  //         digitSeparator: true
  //       },
  //     }]
  //   }],
  //   expressionInfos: [{
  //     name: "round_score",
  //     expression: "Round($feature.risk_score,2)"
  //   }]
  // },
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
    },
    'Ed Koch Bridge - Interchange with harsh cornering and braking': {
      title: 'Ed Koch Bridge',
      content: 'Ed Koch Bridge - in this interchange we can see harsh braking and cornering as drivers exit the highway enter into narrower and slower city roads.'
    },
    'Bay Pkwy - Harsh braking between traffic lights': {
      title: 'Bay Pkwy',
      content: 'Two sections of the Bay Parkway have a higher rate of harsh braking when compared to  other sections of the road. This might indicate a need to change the road markings or traffic signs.'
     },
    '33rd and 6th Harsh braking': {
      title: '33rd and 6th',
      content: 'The middle section of the map shows one section that has a very high rate of harsh braking. There is a park and a subway exit near this section, which might be connected to these harsh braking incidents.'
     },
    'HW 95 - Harsh cornering': {
      title: 'HW 95',
      content: 'Most highway ramps have high harsh cornering rate, this section has extremely high rate and might require special signage to ensure drivers slow down.'
     },
    'Canal St - Combination of risk factors': {
      title: 'Canal St',
      content: 'The red section shows a concentration of alerts in one location, pedestrians, cyclists, speeding and harsh braking.'
     }
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
    }]
  }
  ]
}
export default safetyConfig;
