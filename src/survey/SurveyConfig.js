import { getDomainMap } from '../utils/Utils';

import sign10Image from '../resources/images/SIGN_ICON_10.png'
import sign20Image from '../resources/images/SIGN_ICON_20.png'
import sign30Image from '../resources/images/SIGN_ICON_30.png'
import sign40Image from '../resources/images/SIGN_ICON_40.png'
import sign50Image from '../resources/images/SIGN_ICON_50.png'
import sign60Image from '../resources/images/SIGN_ICON_60.png'
import sign70Image from '../resources/images/SIGN_ICON_70.png'
import sign80Image from '../resources/images/SIGN_ICON_80.png'
import sign90Image from '../resources/images/SIGN_ICON_90.png'
import sign100Image from '../resources/images/SIGN_ICON_100.png'
import sign110Image from '../resources/images/SIGN_ICON_110.png'
import sign120Image from '../resources/images/SIGN_ICON_120.png'
import sign130Image from '../resources/images/SIGN_ICON_130.png'
import sign140Image from '../resources/images/SIGN_ICON_140.png'
import circularSignNoSpeedImage from '../resources/images/CIRCULAR_NO_SPEED.png'
import warningImage from '../resources/images/WARNING.png'
import constructionImage from '../resources/images/CONSTRUCTION.png'
import rectangularSignImage from '../resources/images/RECTANGULAR.png'
import trafficLightImage from '../resources/images/TRAFFIC_LIGHTS.png'
import diamondImage from '../resources/images/DIAMOND.png'
import yieldImage from '../resources/images/YIELD.png'
import roadArrowImage from '../resources/images/ROAD_MARKINGS_ARROWS.png'
import roadStoplineImage from '../resources/images/ROAD_MARKINGS_STOPLINE.png'
import overheadStructureImage from '../resources/images/HORIZONTAL.png'
import reflectorImage from '../resources/images/REFLECTORS.png'
import roadCrossingImage from '../resources/images/CROSSING.png'
import manholeImage from '../resources/images/MANHOLE_COVER.png'
import unrecognizedCircleImage from '../resources/images/UNRECOGNIZED_CIRCLE.png'
import unrecognizedRectImage from '../resources/images/UNRECOGNIZED_RECT.png'


// update to map

const surveyConfig = {
  
  layerItemId: '442c06a8034b4aba9232bd61bd36f0f9',
  //webmapId: '2a9a1368fa224a239afd92376dab0276',
  webmapId: 'e89e13f2f6174777bcd81073c4158ce6',
  initialRendererField: 'all',
  renderers: {
    'all': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "icon",
      defaultSymbol: {type: "simple-marker", color: "blue"},
      visualVariables: [{
        type: "opacity",
        field: "comparsion_to_prev_map",
        stops: [
              {value: '2', opacity: 0.3},
              {value: '1', opacity: 1},
              {value: '0', opacity: 1}
        ]
      },
      {
        type: "size",
        field: "icon_size",
          minDataValue: 0.0,
          maxDataValue: 1.0,
          minSize: 0,
          maxSize: 30
      }],
      uniqueValueInfos: [
        {value: 'sign10', symbol: {type: "picture-marker", url: sign10Image}},
        {value: 'sign20', symbol: {type: "picture-marker", url: sign20Image}},
        {value: 'sign30', symbol: {type: "picture-marker", url: sign30Image}},
        {value: 'sign40', symbol: {type: "picture-marker", url: sign40Image}},
        {value: 'sign50', symbol: {type: "picture-marker", url: sign50Image}},
        {value: 'sign60', symbol: {type: "picture-marker", url: sign60Image}},
        {value: 'sign70', symbol: {type: "picture-marker", url: sign70Image}},
        {value: 'sign80', symbol: {type: "picture-marker", url: sign80Image}},
        {value: 'sign90', symbol: {type: "picture-marker", url: sign90Image}},
        {value: 'sign100', symbol: {type: "picture-marker", url: sign100Image}},
        {value: 'sign110', symbol: {type: "picture-marker", url: sign110Image}},
        {value: 'sign120', symbol: {type: "picture-marker", url: sign120Image}},
        {value: 'sign130', symbol: {type: "picture-marker", url: sign130Image}},
        {value: 'sign140', symbol: {type: "picture-marker", url: sign140Image}},
        {value: 'CIRCULAR_NO_SPEED', symbol: {type: "picture-marker", url: circularSignNoSpeedImage}},
        {value: 'WARNING', symbol: {type: "picture-marker", url: warningImage}},
        {value: 'CONSTRUCTION', symbol: {type: "picture-marker", url: constructionImage}},
        {value: 'RECTANGULAR', symbol: {type: "picture-marker", url: rectangularSignImage}},
        {value: 'TRAFFIC_LIGHTS', symbol: {type: "picture-marker", url: trafficLightImage}},
        {value: 'DIAMOND', symbol: {type: "picture-marker", url: diamondImage}},
        {value: 'YIELD', symbol: {type: "picture-marker", url: yieldImage}},
        {value: 'ROAD_MARKINGS_ARROWS', symbol: {type: "picture-marker", url: roadArrowImage}},
        {value: 'ROAD_MARKINGS_STOPLINE', symbol: {type: "picture-marker", url: roadStoplineImage}},
        {value: 'DOT1', symbol: {type: "simple-marker",color: "white"}},
        {value: 'HORIZONTAL', symbol: {type: "picture-marker", url: overheadStructureImage}},
        {value: 'REFLECTORS', symbol: {type: "picture-marker", url: reflectorImage}},
        {value: 'CROSSING', symbol: {type: "picture-marker", url: roadCrossingImage}},
        {value: 'MANHOLE_COVER', symbol: {type: "picture-marker", url: manholeImage}},
        {value: 'DOT2', symbol: {type: "simple-marker",color: "black"}},
        {value: 'UNRECOGNIZED_CIRCLE', symbol:  {type: "picture-marker", url: unrecognizedCircleImage}},
        {value: 'UNRECOGNIZED_RECRANGLE', symbol:  {type: "picture-marker", url: unrecognizedRectImage}}

    ]
  }
  },
  filters: [
    {name: 'system_type', type: 'multiselect', params: {}},
    {name: 'comparsion_to_prev_map', type: 'multiselect', params: {}},
    {name: 'map_version', type: 'select', params: {}},
  ],
  charts: [{
    id: 'system_type_label',
    type: 'bar',
    title: 'Landmark type',
    xField: 'system_type_label',
    yField: 'countOFsystem_type',
    // see here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html
    // and here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-StatisticDefinition.html
    // use "order by" parameter or "resultTransform" to sort
    queryDefinition: {
      where: "1=1",
      outFields: "*",
      orderByFields: "countOFsystem_type",
      groupByFieldsForStatistics: "system_type",
      outStatistics: [{
        "onStatisticField":"system_type",
        "outStatisticFieldName":"countOFsystem_type",
        "statisticType":"count"
      }]
      },
    resultTransform: result => {
      if(!result || !result.features || result.features.length < 1) return result;
      const field = result.fields.find(f => f.name === 'system_type');
      const domainMap = getDomainMap(field.domain);
      const newFeatures = result.features.map(f => {  
        const attributes = f.attributes;
        const fieldValue = f.attributes['system_type'];
        const fieldDomain = domainMap.has(fieldValue) ? domainMap.get(fieldValue) : fieldValue;
        return {
          attributes: {
            ...attributes,
            system_type_label: fieldDomain
          }
        }
      });
      result.features = newFeatures;
      return result;
    }
  },
  {
    id: 'specific_type_label',
    type: 'bar',
    title: 'Traffic sign type',
    xField: 'specific_type_label',
    yField: 'countOFspecific_type',
    // see here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html
    // and here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-StatisticDefinition.html
    // use "order by" parameter or "resultTransform" to sort
   queryDefinition: {
        where: "system_type=0 or system_type=1 or system_type=3 or system_type=5 or system_type=6",
        outFields: "*",
        orderByFields: "countOFspecific_type",
        groupByFieldsForStatistics: "specific_type",
        outStatistics: [{
          "onStatisticField":"specific_type",
          "outStatisticFieldName":"countOFspecific_type",
          "statisticType":"count"
      }]
    },
    resultTransform: result => {
      if(!result || !result.features || result.features.length < 1) return result;
      const field = result.fields.find(f => f.name === 'specific_type');
      const domainMap = getDomainMap(field.domain);
      const newFeatures = result.features.map(f => {  
        const attributes = f.attributes;
        const fieldValue = f.attributes['specific_type'];
        const fieldDomain = domainMap.has(fieldValue) ? domainMap.get(fieldValue) : fieldValue;
        return {
          attributes: {
            ...attributes,
            specific_type_label: fieldDomain
          }
        }
      });
      result.features = newFeatures;
      return result;
    }
  }], 
  popupTemplate: {
    title: "{expression/title-prefix} {system_type} {expression/title_suffix}",
    content: "Type: <b>{specific_type}</b><br>" +
             "Detected at {publish_date} (version {map_version})<br>" +
             "Size: {height} X {width} m<br>",
    expressionInfos: [
    {
      name: "size_marker",
      title: "Size marker",
      expression: "When ($feature.landmark_type == 1, 'Diameter', 'Edge size')"
    },
    {
      name: "title-prefix",
      title: "Title Expression",
      expression: "When($feature.comparsion_to_prev_map == 2, '<b>Missing</b>', $feature.comparsion_to_prev_map == 1, '<b>New</b>',  '')"
    },
    {
      name: "title-suffix",
      title: "Title Expression",
      expression: "When($feature.comparsion_to_prev_map == 2, '', $feature.comparsion_to_prev_map == 1, '',  'information')"
    }
]
  },
  viewConfig: { 
    center: [-73.974051, 40.762746],
    zoom: 16
  }
}

export default surveyConfig;