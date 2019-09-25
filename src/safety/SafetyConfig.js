const getRenderer = (field) => ({
  _type: "jsapi",
  type: "simple",
  symbol: { type: "simple-line" },
  visualVariables: [{
    type: "color",
    field,
    stops: [
      { value: 0, color: [13,38,68,255], label: '0' },
      { value: 2, color: [56,98,122,255], label: null },
      { value: 4, color: [98,158,176,255], label: '4' },
      { value: 6, color: [177,205,194,255], label: null },
      { value: 8, color: [255,252,212,255], label: '8'},
    ]
  }]
})

const safetyConfig = {
  layerItemId: '66021d7914de457c95a9349a5d1edfab',
  initialRendererField: 'eventvalue',
  renderers: {
    'eventvalue': getRenderer('eventvalue'),
    'harsh_cornering_ratio': getRenderer('harsh_cornering_ratio'),
    'harsh_acc_ratio': getRenderer('harsh_acc_ratio'),
    'pedestrians_density': getRenderer('pedestrians_density'),
    'bicycles_density': getRenderer('bicycles_density')
  },
  filters: [
    {name: 'eventvalue', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
    {name: 'harsh_cornering_ratio', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
    {name: 'harsh_acc_ratio', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
    {name: 'pedestrians_density', type: 'minmax', params: {log: true}},
    {name: 'bicycles_density', type: 'minmax', params: {log: true}},
  ],
  popupTemplate: {
    title: "Hello world!",
    content: "Road safety score: <b>{eventvalue}</b>"
  }
}

export default safetyConfig;