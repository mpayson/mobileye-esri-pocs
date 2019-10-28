import { getDomainMap } from '../utils/Utils';

// import sign5Image from '../resources/images/SIGN_ICON_5.png'
// import sign10Image from '../resources/images/SIGN_ICON_10.png'
// import sign15Image from '../resources/images/SIGN_ICON_15.png'
// import sign20Image from '../resources/images/SIGN_ICON_20.png'
// import sign25Image from '../resources/images/SIGN_ICON_25.png'
// import sign30Image from '../resources/images/SIGN_ICON_30.png'
// import sign35Image from '../resources/images/SIGN_ICON_35.png'
// import sign40Image from '../resources/images/SIGN_ICON_40.png'
// import sign45Image from '../resources/images/SIGN_ICON_45.png'
// import sign50Image from '../resources/images/SIGN_ICON_50.png'
// import sign55Image from '../resources/images/SIGN_ICON_55.png'
// import sign60Image from '../resources/images/SIGN_ICON_60.png'
// import sign65Image from '../resources/images/SIGN_ICON_65.png'
// import sign70Image from '../resources/images/SIGN_ICON_70.png'
// import sign75Image from '../resources/images/SIGN_ICON_75.png'
// import sign80Image from '../resources/images/SIGN_ICON_80.png'
// import sign85Image from '../resources/images/SIGN_ICON_85.png'
// import sign90Image from '../resources/images/SIGN_ICON_90.png'
// import sign95Image from '../resources/images/SIGN_ICON_95.png'
// import sign100Image from '../resources/images/SIGN_ICON_100.png'
// import sign105Image from '../resources/images/SIGN_ICON_105.png'
// import sign110Image from '../resources/images/SIGN_ICON_110.png'
// import sign115Image from '../resources/images/SIGN_ICON_115.png'
// import sign120Image from '../resources/images/SIGN_ICON_120.png'
// import sign125Image from '../resources/images/SIGN_ICON_125.png'
// import sign130Image from '../resources/images/SIGN_ICON_130.png'
// import sign135Image from '../resources/images/SIGN_ICON_135.png'
// import sign140Image from '../resources/images/SIGN_ICON_140.png'
// import sign145Image from '../resources/images/SIGN_ICON_145.png'
// import circularSignNoSpeedImage from '../resources/images/CIRCULAR_NO_SPEED.png'
// import warningImage from '../resources/images/WARNING.png'
// import constructionImage from '../resources/images/CONSTRUCTION.png'
// import rectangularSignImage from '../resources/images/RECTANGULAR.png'
// import trafficLightImage from '../resources/images/TRAFFIC_LIGHTS.png'
// import diamondImage from '../resources/images/DIAMOND.png'
// import yieldImage from '../resources/images/YIELD.png'
// import roadArrowImage from '../resources/images/ROAD_MARKINGS_ARROWS.png'
// import roadStoplineImage from '../resources/images/ROAD_MARKINGS_STOPLINE.png'
// import overheadStructureImage from '../resources/images/HORIZONTAL.png'
// import reflectorImage from '../resources/images/REFLECTORS.png'
// import roadCrossingImage from '../resources/images/CROSSING.png'
// import manholeImage from '../resources/images/MANHOLE_COVER.png'
// import unrecognizedCircleImage from '../resources/images/UNRECOGNIZED_CIRCLE.png'
// import unrecognizedRectImage from '../resources/images/UNRECOGNIZED_RECT.png'
import NYCImage from '../resources/images/NYC.png'
import AtlantaImage from '../resources/images/Atlanta.jpg'


const surveyConfig = {
  
  // Production
  // layerItemId: '3d218196cda94e2eacf86994f9bbd4e4',
  // webmapId: 'e89e13f2f6174777bcd81073c4158ce6',
  // Test
  layerItemId: '3fd4485bb8ca45bfa90e0e143c2cd7c2',
  webmapId: 'aabc5fa9e96045eaa0968702fd33e6d9',
  initialRendererField: 'all',
  renderers: {
    'all': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "icon",
      //field: "system_type_group",
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
      
      ],
      uniqueValueInfos: [
        {value: 'sign5', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign5Image}},
        {value: 'sign10', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign10Image}},
        {value: 'sign15', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign15Image}},
        {value: 'sign20', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign20Image}},
        {value: 'sign25', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign25Image}},
        {value: 'sign30', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign30Image}},
        {value: 'sign35', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign35Image}},
        {value: 'sign40', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign40Image}},
        {value: 'sign45', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign45Image}},
        {value: 'sign50', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign50Image}},
        {value: 'sign55', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign55Image}},
        {value: 'sign60', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign60Image}},
        {value: 'sign65', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign65Image}},
        {value: 'sign70', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign70Image}},
        {value: 'sign75', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign75Image}},
        {value: 'sign80', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign80Image}},
        {value: 'sign85', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign85Image}},
        {value: 'sign90', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign90Image}},
        {value: 'sign95', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign95Image}},
        {value: 'sign100', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign100Image}
        {value: 'sign105', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign105Image}},},
        {value: 'sign110', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign110Image}
        {value: 'sign115', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign115Image}},},
        {value: 'sign120', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign120Image}
        {value: 'sign125', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign125Image}},},
        {value: 'sign130', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign130Image}},
        {value: 'sign135', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign135Image}},
        {value: 'sign140', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign140Image}},
        {value: 'sign145', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, //{type: "picture-marker", url: sign145Image}},
        {value: 'CIRCULAR_NO_SPEED', symbol: {type: "simple-marker", size:6.0, color: "red"}}, //{type: "picture-marker", url: circularSignNoSpeedImage}},
        {value: 'WARNING', symbol: {type: "simple-marker", size:6.0, color: "red"}}, //{type: "picture-marker", url: warningImage}},
        {value: 'CONSTRUCTION', symbol: {type: "simple-marker", size:6.0, color: "red"}}, //{type: "picture-marker", url: constructionImage}},
        {value: 'RECTANGULAR', symbol: {type: "simple-marker", size:6.0, color: "red"}}, //{type: "picture-marker", url: rectangularSignImage}},
        {value: 'TRAFFIC_LIGHTS', symbol: {type: "simple-marker", size:6.0, color: "purple"}}, //{type: "picture-marker", url: trafficLightImage}},
        {value: 'DIAMOND', symbol: {type: "simple-marker", size:6.0, color: "red"}}, //{type: "picture-marker", url: diamondImage}},
        {value: 'YIELD', symbol: {type: "simple-marker", size:6.0, color: "red"}}, //{type: "picture-marker", url: yieldImage}},
        {value: 'ROAD_MARKINGS_ARROWS', symbol: {type: "simple-marker", size:6.0, color: "blue"}}, //{type: "picture-marker", url: roadArrowImage}},
        {value: 'ROAD_MARKINGS_STOPLINE', symbol: {type: "simple-marker", size:6.0, color: "blue"}}, //{type: "picture-marker", url: roadStoplineImage}},
        {value: 'DOT1', symbol: {type: "simple-marker", size:6.0, color: "blue"}}, //{type: "simple-marker",color: "white"}},
        {value: 'HORIZONTAL', symbol: {type: "simple-marker", size:6.0, color: "blue"}}, //{type: "picture-marker", url: overheadStructureImage}},
        {value: 'REFLECTORS', symbol: {type: "simple-marker", size:6.0, color: "green"}}, //{type: "picture-marker", url: reflectorImage}},
        {value: 'CROSSING', symbol: {type: "simple-marker", size:6.0, color: "blue"}}, //{type: "picture-marker", url: roadCrossingImage}},
        {value: 'MANHOLE_COVER', symbol: {type: "simple-marker", size:6.0, color: "yellow"}}, //{type: "picture-marker", url: manholeImage}},
        {value: 'DOT2', symbol: {type: "simple-marker", size:6.0, color: "blue"}}, //{type: "simple-marker",color: "black"}},
        {value: 'UNRECOGNIZED_CIRCLE', symbol: {type: "simple-marker", size:3.0, color: "black"}}, // {type: "picture-marker", url: unrecognizedCircleImage}},
        {value: 'UNRECOGNIZED_RECRANGLE', symbol:  {type: "simple-marker", size:3.0, color: "black"}} //{type: "picture-marker", url: unrecognizedRectImage}}
        // {value: 0, symbol: {type: "simple-marker", size:6.0, color: "orange"}},
        // {value: 1, symbol: {type: "simple-marker", size:6.0, color: "purple"}},
        // {value: 2, symbol: {type: "simple-marker", size:6.0, color: "blue"}},
        // {value: 3, symbol: {type: "simple-marker", size:6.0, color: "green"}},
        // {value: 4, symbol: {type: "simple-marker", size:6.0, color: "yellow"}},
    ]
  }
  },
  filters: [
    {name: 'system_type', type: 'multiselect', params: {dynamic: true}},
    {name: 'comparsion_to_prev_map', type: 'multiselect', params: {dynamic: true}},
    {name: 'map_version', type: 'select', params: {dynamic: true}},
  ],
  charts: [
  {
    id: 'system_type_group_label',
    type: 'bar',
    title: 'Landmark Type',
    xField: 'system_type_group_label',
    yField: 'countOFsystem_type_group',
    // see here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html
    // and here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-StatisticDefinition.html
    // use "order by" parameter or "resultTransform" to sort
   queryDefinition: {
        where: "1=1",
        outFields: "*",
        orderByFields: "countOFsystem_type_group",
        groupByFieldsForStatistics: "system_type_group",
        outStatistics: [{
          "onStatisticField":"system_type_group",
          "outStatisticFieldName":"countOFsystem_type_group",
          "statisticType":"count"
      }]
    },
    resultTransform: result => {
      if(!result || !result.features || result.features.length < 1) return result;
      const field = result.fields.find(f => f.name === 'system_type_group');
      const domainMap = getDomainMap(field.domain);
      const newFeatures = result.features.map(f => {  
        const attributes = f.attributes;
        const fieldValue = f.attributes['system_type_group'];
        const fieldDomain = domainMap.has(fieldValue) ? domainMap.get(fieldValue) : fieldValue;
        return {
          attributes: {
            ...attributes,
            system_type_group_label: fieldDomain
          }
        }
      });
      result.features = newFeatures;
      return result;
    }
  },
  {
    id: 'system_type_label',
    type: 'bar',
    title: 'Specific Landmark type',
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
  },], 
  popupTemplate: {
    title: "{expression/title-prefix} {system_type} {expression/title_suffix}",
    content: [
      
      {
      type: "text",
      text: "Type: <b>{expression/type-expr}</b> <br>" +
             "Detected at {publish_date} (version {map_version})<br>" +
             "Size: {height} X {width} m<br>",
    }, 
    {
      type: "media", // MediaContentElement
      mediaInfos: [
        {
          title: "",
          type: "image",
          caption: "sign icon",
          value: {
            sourceURL: "{expression/sign-icon}"
          }
        },
      ]
    },
    ],
    expressionInfos: [
      {
        name: "type-expr",
        title: "Type",
        expression: "When($feature.system_type_group == 0, DomainName($feature, 'traffic_sign_type', $feature.traffic_sign_type)," +
                        "$feature.system_type_group == 1, 'Traffic Light'," +
                        "$feature.system_type_group == 2, DomainName($feature, \"road_marking_type\", $feature.road_marking_type)," +
                       "$feature.system_type_group == 3, DomainName($feature, \"pole_type\", $feature.pole_type)," +
//                        "$feature.system_type_group == 4, DomainName($feature, \"manhole_type\", $feature.manhole_type)," +
                        "'')"

      },
      {
        name: "title-prefix",
        title: "Title Prefix",
        expression: "When($feature.comparsion_to_prev_map == 2, 'Missing', $feature.comparsion_to_prev_map == 1, 'New',  '')"
      },
      {
        name: "title-suffix",
        title: "Title Suffix",
        expression: "When(($feature.comparsion_to_prev_map == 2) ||  ($feature.comparsion_to_prev_map == 1), '',  'information')"
      },
      // {
      //   name: "sign-icon",
      //   expression: sign5Image
      // }
    ],
  },
  
  bookmarkInfos: {
   'ORK': {
       title: '61st on 1st',
        content: 'The most beutiful traffic light in all of NYC.'
    },
  },

  geocenters: [{
    'name' : 'NYC',
    'image' : NYCImage,
    'extent' : {
                 "xmin":-8233752.069196624,"ymin":4976855.35232054,"xmax":-8232870.057549805,"ymax":4977349.2071830435,
                 "spatialReference":{"wkid":102100}
               }
  }, 
  {
    'name' : 'Atlanta, GA',
    'image' : AtlantaImage,
    'extent' : {
                 "xmin":-9396266.79940966,"ymin":3995212.652711483,"xmax":-9391637.581884017,"ymax":3997367.2214463283
                 ,
                 "spatialReference":{"wkid":102100}
               }
  }],
  
  viewConfig: { 
    // center: [-73.974051, 40.762746],
    center: [-84.386330, 33.753746],
    zoom: 16
  }
}

export default surveyConfig;