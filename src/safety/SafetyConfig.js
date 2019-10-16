const getRenderer = (field) => ({
  _type: "jsapi",
  type: "simple",
  symbol: { type: "simple-line", width: "2.5px" },
  label: "Road segment", 
  visualVariables: [{
    type: "color",
    field,
    stops: [
      { value: 1, color: [44,123,182,255], label: '< 1' },
      { value: 2.26, color: [171,217,233,255], label: null },
      { value: 3.5, color: [255,255,191,255], label: '2.5' },
      { value: 4.9, color: [253,174,97,255], label: null },
      { value: 6.3, color: [215,25,28,255], label: '> 6.3'},
    ]
  }]
})

const safetyConfig = {
  layerItemId: '534f26d211154527b31c976ea6b5eafe',
  initialRendererField: 'eventvalue',
  renderers: {
    'eventvalue': getRenderer('eventvalue'),
    'harsh_cornering_ratio': getRenderer('harsh_cornering_ratio'),
    'harsh_acc_ratio': getRenderer('harsh_acc_ratio'),
    'pedestrians_density': getRenderer('pedestrians_density'),
    'bicycles_density': getRenderer('bicycles_density'),
    'speeding_ratio': getRenderer('speeding_ratio'),
    'avarge_speed': getRenderer('avarge_speed')
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
      info: "ipsum"
    }
  },{
    name: 'harsh_acc_ratio',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "ipsum"
    }
  },{
    name: 'pedestrians_density',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "ipsum"
    }
  },{
    name: 'bicycles_density',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "ipsum"
    }
  },{
    name: 'speeding_ratio',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "ipsum"
    }
  },{
    name: 'avarge_speed',
    type: 'minmax',
    params: {
      isLogarithmic: false,
      hasHistograms: false,
      lowerBoundLabel: 'low',
      upperBoundLabel: 'high',
      info: "ipsum"
    }
  }],
  popupTemplate: {
    title: "Road Segment Information",
    content: [{
      type: "text",
      text: "<b>Road Safety Score: {eventvalue}</b>"
    }, {
      type: "fields",
      fieldInfos: [{
        fieldName: 'harsh_cornering_ratio',
        label: 'Harsh cornering ratio'
      }, {
        fieldName: 'harsh_acc_ratio',
        label: "Harsh acceleration ratio"
      }, {
        fieldName: 'pedestrians_density',
        label: "Pedestrians density"
      }, {
        fieldName: 'bicycles_density',
        label: 'Bicycles density'
      }, {
        fieldName: 'speeding_ratio',
        label: 'Speeding ratio'
      }, {
        fieldName: 'avarge_speed',
        label: 'Average speed'
      }]
    }]
  },
  viewConfig: {
    center: [-74.00157, 40.71955],
    zoom: 12
  }

}

export default safetyConfig;