const getRenderer = (field) => ({
  _type: "jsapi",
  type: "simple",
  symbol: { type: "simple-line", width: "2.5px" },
  visualVariables: [{
    type: "color",
    field,
    stops: [
      { value: 1, color: [13,38,68,255], label: '1' },
      { value: 2, color: [56,98,122,255], label: null },
      { value: 4, color: [98,158,176,255], label: '4' },
      { value: 8, color: [177,205,194,255], label: null },
      { value: 16, color: [255,252,212,255], label: '16'},
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
    'avarge_speed': {
      _type: "jsapi",
      type: "simple",
      symbol: { type: "simple-line" },
      visualVariables: [{
        type: "color",
        field: 'avarge_speed',
        stops: [
          { value: 0, color: [13,38,68,255], label: '0' },
          { value: 25, color: [56,98,122,255], label: null },
          { value: 50, color: [98,158,176,255], label: '50' },
          { value: 75, color: [177,205,194,255], label: null },
          { value: 100, color: [255,252,212,255], label: '100'},
        ]
      }]
    }
  },
  filters: [
      //lowerBound: 0, upperBound: 100,
    {name: 'eventvalue', type: 'minmax', params: {isLogarithmic: true, log: true}},
    {name: 'harsh_cornering_ratio', type: 'minmax', params: {isLogarithmic: true, log: true}},
    {name: 'harsh_acc_ratio', type: 'minmax', params: {isLogarithmic: true, log: true}},
    {name: 'pedestrians_density', type: 'minmax', params: {isLogarithmic: true, log: true}},
    {name: 'bicycles_density', type: 'minmax', params: {isLogarithmic: true, log: true}},
    {name: 'speeding_ratio', type: 'minmax', params: {isLogarithmic: true, log: true}},
    {name: 'avarge_speed', type: 'minmax', params: {isLogarithmic: true, log: true}}
  ],
  popupTemplate: {
    title: "Hello world!",
    content: "Road safety score: <b>{eventvalue}</b>"
  },
  viewConfig: {
    center: [-74.00157, 40.71955],
    zoom: 12
  }

}

export default safetyConfig;