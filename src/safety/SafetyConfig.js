// for now expect exactly 5 stops that map to the same color ramp
const getRenderer = (field, stops) => ({
  _type: "jsapi",
  type: "simple",
  symbol: { type: "simple-line", width: "2.5px" },
  label: "Road segment", 
  visualVariables: [{
    type: "color",
    field,
    stops: [
      { value: stops[0], color: [44,123,182,255], label: `< ${stops[0]}` },
      { value: stops[1], color: [171,217,233,255], label: null },
      { value: stops[2], color: [255,255,191,255], label: `${stops[2]}` },
      { value: stops[3], color: [253,174,97,255], label: null },
      { value: stops[4], color: [215,25,28,255], label: `> ${stops[4]}`},
    ]
  }]
})

const safetyConfig = {
  //layerItemId: '534f26d211154527b31c976ea6b5eafe',
  layerItemId: 'd7bc274d96324b9885f0f8b45484570c',
  initialRendererField: 'eventvalue',
  renderers: {
    'eventvalue': getRenderer('eventvalue', [1,2.26,3.5,4.9,6.3]),
    'harsh_cornering_ratio': getRenderer('harsh_cornering_ratio', [0,1.86,3.7,5.56,7.4]),
    'harsh_acc_ratio': getRenderer('harsh_acc_ratio', [0,3.5,7,10.5,14]),
    'pedestrians_density': getRenderer('pedestrians_density', [0,0.3,0.61,0.9,1.2]),
    'bicycles_density': getRenderer('bicycles_density', [0,0.056,0.112,0.166,0.22]),
    'speeding_ratio': getRenderer('speeding_ratio', [0,3.7,7.5,11.2,15]),
    'avarge_speed': getRenderer('avarge_speed',[28,38,48,58,68])
  },
  filters: [{
    name:'eventvalue',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "ipsum"
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
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "Average speed of the respective segment. Does not contribute to risk score on its own."
    }
  }],
  popupTemplate: {
    title: "Road Segment Information",
    content: [{
      type: "text",
      text: "<b>Road Safety Score: {expression/round_score}</b>",
    }, {
      type: "fields",
      fieldInfos: [{
        fieldName: 'harsh_cornering_ratio',
        label: 'Harsh cornering',
        format: {
          places: 2,
          digitSeparator: true
        },
      }, {
        fieldName: 'harsh_acc_ratio',
        label: "Harsh breaking",
        format: {
          places: 2,
          digitSeparator: true
        },
      }, {
        fieldName: 'pedestrians_density',
        label: "Pedestrians density",
        format: {
          places: 2,
          digitSeparator: true
        },
      }, {
        fieldName: 'bicycles_density',
        label: 'Bicycles density',
        format: {
          places: 2,
          digitSeparator: true
        },
      }, {
        fieldName: 'speeding_ratio',
        label: 'Speeding ratio',
        format: {
          places: 2,
          digitSeparator: true
        },
      }, {
        fieldName: 'avarge_speed',
        label: 'Average speed',
        format: {
          places: 2,
          digitSeparator: true
        },
      }]
    }],
    expressionInfos: [{
      name: "round_score",
      expression: "Round($feature.eventvalue,2)"
    }]
  },
  viewConfig: {
    center: [-74.00157, 40.71955],
    zoom: 12
  }

}

export default safetyConfig;