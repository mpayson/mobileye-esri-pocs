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

const safetyConfig = {
  //layerItemId: '534f26d211154527b31c976ea6b5eafe',
  layerItemId: 'e37cc788804e4303b6e7898481798691',
  webmapId: '906b58f399944774a29e05d3d24a939b',
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
      info: "Passenger collusion warning."
    }
  },{
    name: 'fcw',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Forward collusion warning"
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
    'Willamsburg Bridge': {
      title: 'Williamsburg Bridge',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    'Jerusalem': {
      title: 'Jerusalem',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    'Manhattan': {
      title: 'Manhattan',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  }
}

export default safetyConfig;