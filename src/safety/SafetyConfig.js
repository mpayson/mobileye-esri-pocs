import NYCImage from '../resources/images/NYC.jpg'
import AtlantaImage from '../resources/images/Atlanta.jpg'
import TokyoImage from '../resources/images/Tokyo.jpg'
import BarcelonaImage from '../resources/images/Barcelona.jpg'

// for now expect exactly 5 stops that map to the same color ramp
const getRenderer = (field, stops,labels) => ({
  _type: "jsapi",
  type: "simple",
  symbol: { type: "simple-line" ,width: "2.5px"},
  label: "Road segment",
  visualVariables: [{
    type: "color",
    field,
    stops: [
      { value: stops[0], color: [44,123,182,255], label: `${labels[0]}` },
      { value: stops[1], color: [171,217,233,255], label: null },
      { value: stops[2], color: [255,255,191,255], label: `${labels[1]}` },
      { value: stops[3], color: [253,174,97,255], label: null },
      { value: stops[4], color: [215,25,28,255], label: `${labels[2]}`},
    ]
  }]
})

//var webmapIdEnv = 'c54f0d3d4555429fa8e4a4250ed12164';
var webmapIdEnv = '906b58f399944774a29e05d3d24a939b';

if (process.env.WEBMAP_ID){
    webmapIdEnv = process.env.WEBMAP_ID;
}


const safetyConfig = {
  //layerItemId: '534f26d211154527b31c976ea6b5eafe',
  //layerItemId: 'e37cc788804e4303b6e7898481798691',
  // webmapId: '906b58f399944774a29e05d3d24a939b',
  // updating for now to vector, it's cleaner
  webmapId: webmapIdEnv,
  //webmapId: 'c54f0d3d4555429fa8e4a4250ed12164',

  // webmapId: '58d18243967d40e9a25db1f02d3652b0',
  initialRendererField: 'eventvalue',
  renderers: {
    'eventvalue': {
      _type: "jsapi",
      type: 'class-breaks',
      field: 'eventvalue',
      classBreakInfos: [{
        minValue: 0,
        maxValue: 2.499,
        symbol: {type: "simple-line", width: "2.5px", color: [171,217,233,255]},
        label: "Low"
      }, {
        minValue: 2.5,
        maxValue: 5.6453,
        symbol: {type: "simple-line", width: "2.5px", color: [255,255,191,255]},
        label: "Average"
      }, {
        minValue: 5.6454,
        maxValue: 12.499,
        symbol: {type: "simple-line", width: "2.5px", color: [253,174,97,255]},
        label: "High"
      }, {
        minValue: 12.5,
        maxValue: 1000,
        symbol: {type: "simple-line", width: "2.5px", color: [215,25,28,255]},
        label: "Very High"
      }]
    },
    'harsh_acc_ratio': getRenderer('harsh_acc_ratio', [0,3.5,7,10.5,14],['Low','Medium','High']),
    'harsh_cornering_ratio': getRenderer('harsh_cornering_ratio', [0,1.86,3.7,5.56,7.4],['Low','Medium','High']),
    'pedestrians_density': getRenderer('pedestrians_density', [0,0.3,0.61,0.9,1.2],['Low','Medium','High']),
    'bicycles_density': getRenderer('bicycles_density', [0,0.056,0.112,0.166,0.22],['Low','Medium','High']),
    'speeding_ratio': getRenderer('speeding_ratio', [0,3.7,7.5,11.2,15],['Low','Medium','High']),
    'avarge_speed': getRenderer('avarge_speed',[28,38,48,58,68],['< 25','50','> 70']),
    'pcw': getRenderer('pcw', [0,0.01181361,0.02357791,0.03498221,0.05745235],['Low','Medium','High']),
     'fcw': getRenderer('fcw', [0,1.35499499,2.66894309,6.03785078,8.2561676],['Low','Medium','High'])
  },
  filters: [{
    name:'eventvalue',
    type: 'quantile',
    params: {
      quantiles: [{
        min: 0,
        max: 2.5,
        // label: "Low (30%)",
        label: "Low"
      }, {
        min: 2.5,
        max: 5.6453,
        // label: "Average (40%)",
        label: "Average"
      }, {
        min: 5.6453,
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
      style: "buttons"
    }
  },{
    name: 'harsh_acc_ratio',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Percentage of cars that brake harshly in the segment."
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
    name: 'avarge_speed',
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
  hasCustomTooltip: true,
  outFields: [
    'eventvalue', 'harsh_cornering_ratio', 'harsh_acc_ratio', 'pedestrians_density',
    'bicycles_density', 'speeding_ratio', 'avarge_speed','pcw','fcw'
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
  //       fieldName: 'harsh_acc_ratio',
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
  //       fieldName: 'avarge_speed',
  //       label: 'Average speed (Km/H)',
  //       format: {
  //         places: 2,
  //         digitSeparator: true
  //       },
  //     }]
  //   }],
  //   expressionInfos: [{
  //     name: "round_score",
  //     expression: "Round($feature.eventvalue,2)"
  //   }]
  // },
  viewConfig: {
    center: [-74.00157, 40.71955],
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
      content: 'Ed Koch Bridge - in this interchange we can see harsh breaking and cornering as drivers go off the highway and into narrower and slower city roads.'
    },
    'Bay PKWY - Harsh braking between traffic lights': {
      title: 'Bay PKWY',
      content: 'Two sections of Bay PKWY have higher rate of harsh breaking then the other sections of the road. This might indicate a need for a change in road marking or road traffic signs.'
     },
    '33rd and 6th Harsh breaking': {
      title: '33rd and 6th',
      content: 'The middle section of the map shows one section that has extreme harsh breaking. there is a park and a subway exit next to it which might be the cause for the harsh breaking.'
     },
    'HW 95 - Harsh Cornering': {
      title: 'HW 95',
      content: 'Most highway ramps have high harsh cornering rate, this section has extremely high rate and might require special slow down signage.'
     },
    'Canal St - Combination of risk factors': {
      title: 'Canal st',
      content: 'The red section shows a combination of risk scores in one location, pedestrians, cyclists, speeding and harsh breaking.'
     }
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
export default safetyConfig;