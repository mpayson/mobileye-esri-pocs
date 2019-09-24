// update to map
const safetyConfig = {
  layerItemId: '9524ea255f4e452bb1e79d951ed65a5f',
  initialRendererField: 'eventvalue',
  renderers: {
    'eventvalue': {"visualVariables":[{"type":"colorInfo","field":"eventvalue","valueExpression":null,"stops":[{"value":0,"color":[255,252,212,255],"label":"0"},{"value":2,"color":[177,205,194,255],"label":null},{"value":4,"color":[98,158,176,255],"label":"4"},{"value":6,"color":[56,98,122,255],"label":null},{"value":8,"color":[13,38,68,255],"label":"8"}]}],
                 "authoringInfo":{
                   "visualVariables": [{"type":"colorInfo","minSliderValue":-9,"maxSliderValue":10,"theme":"high-to-low"}]},
                 "type":"simple", 
                 "symbol":{"color":[170,170,170,255],"width":1.5,"type":"esriSLS","style":"esriSLSSolid"}}
  },
  filters: [
    {name: 'eventvalue', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
    {name: 'pedestrians_density', type: 'minmax', params: {log: true}},
    {name: 'bicycles_density', type: 'minmax', params: {log: true}},
    {name: 'harsh_cornering_ratio', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
    {name: 'harsh_acc_ratio', type: 'minmax', params: {lowerBound: 0, upperBound: 100, log: true}},
  ],
  popupTemplate: {
    title: "Hello world!",
    content: "Road safety score: <b>{eventvalue}</b>"
  }
}

export default safetyConfig;