import { getDomainMap } from '../utils/Utils';

import sign5Image from '../resources/images/SIGN_ICON_5.png'
import sign10Image from '../resources/images/SIGN_ICON_10.png'
import sign15Image from '../resources/images/SIGN_ICON_15.png'
import sign20Image from '../resources/images/SIGN_ICON_20.png'
import sign25Image from '../resources/images/SIGN_ICON_25.png'
import sign30Image from '../resources/images/SIGN_ICON_30.png'
import sign35Image from '../resources/images/SIGN_ICON_35.png'
import sign40Image from '../resources/images/SIGN_ICON_40.png'
import sign45Image from '../resources/images/SIGN_ICON_45.png'
import sign50Image from '../resources/images/SIGN_ICON_50.png'
import sign55Image from '../resources/images/SIGN_ICON_55.png'
import sign60Image from '../resources/images/SIGN_ICON_60.png'
import sign65Image from '../resources/images/SIGN_ICON_65.png'
import sign70Image from '../resources/images/SIGN_ICON_70.png'
import sign75Image from '../resources/images/SIGN_ICON_75.png'
import sign80Image from '../resources/images/SIGN_ICON_80.png'
import sign85Image from '../resources/images/SIGN_ICON_85.png'
import sign90Image from '../resources/images/SIGN_ICON_90.png'
import sign95Image from '../resources/images/SIGN_ICON_95.png'
import sign100Image from '../resources/images/SIGN_ICON_100.png'
import sign105Image from '../resources/images/SIGN_ICON_105.png'
import sign110Image from '../resources/images/SIGN_ICON_110.png'
import sign115Image from '../resources/images/SIGN_ICON_115.png'
import sign120Image from '../resources/images/SIGN_ICON_120.png'
import sign125Image from '../resources/images/SIGN_ICON_125.png'
import sign130Image from '../resources/images/SIGN_ICON_130.png'
import sign135Image from '../resources/images/SIGN_ICON_135.png'
import sign140Image from '../resources/images/SIGN_ICON_140.png'
import sign145Image from '../resources/images/SIGN_ICON_145.png'
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
import dotImage from '../resources/images/dot.png'
import NYCImage from '../resources/images/NYC.jpg'
import AtlantaImage from '../resources/images/Atlanta.jpg'
import SanFranImage from '../resources/images/SanFran.jpg'
import HeathrowImage from '../resources/images/Heathrow.jpg'
import ObaidaImage from '../resources/images/Obaida.jpg'



const icons_exp = "When(" +
"$feature.icon == 'sign5', '"+`${sign5Image}`+"'," +
"$feature.icon == 'sign10', '"+`${sign10Image}`+"'," +
"$feature.icon == 'sign15', '"+`${sign15Image}`+"'," +
"$feature.icon == 'sign20', '"+`${sign20Image}`+"'," +
"$feature.icon == 'sign25', '"+`${sign25Image}`+"'," +
"$feature.icon == 'sign30', '"+`${sign30Image}`+"'," +
"$feature.icon == 'sign35', '"+`${sign35Image}`+"'," +
"$feature.icon == 'sign40', '"+`${sign40Image}`+"'," +
"$feature.icon == 'sign45', '"+`${sign45Image}`+"'," +
"$feature.icon == 'sign50', '"+`${sign50Image}`+"'," +
"$feature.icon == 'sign55', '"+`${sign55Image}`+"'," +
"$feature.icon == 'sign60', '"+`${sign60Image}`+"'," +
"$feature.icon == 'sign65', '"+`${sign65Image}`+"'," +
"$feature.icon == 'sign70', '"+`${sign70Image}`+"'," +
"$feature.icon == 'sign75', '"+`${sign75Image}`+"'," +
"$feature.icon == 'sign80', '"+`${sign80Image}`+"'," +
"$feature.icon == 'sign85', '"+`${sign85Image}`+"'," +
"$feature.icon == 'sign90', '"+`${sign90Image}`+"'," +
"$feature.icon == 'sign95', '"+`${sign95Image}`+"'," +
"$feature.icon == 'sign100', '"+`${sign100Image}`+"'," +
"$feature.icon == 'sign105', '"+`${sign105Image}`+"'," +
"$feature.icon == 'sign110', '"+`${sign110Image}`+"'," +
"$feature.icon == 'sign115', '"+`${sign115Image}`+"'," +
"$feature.icon == 'sign120', '"+`${sign120Image}`+"'," +
"$feature.icon == 'sign125', '"+`${sign125Image}`+"'," +
"$feature.icon == 'sign130', '"+`${sign130Image}`+"'," +
"$feature.icon == 'sign135', '"+`${sign135Image}`+"'," +
"$feature.icon == 'sign140', '"+`${sign140Image}`+"'," +
"$feature.icon == 'sign145', '"+`${sign145Image}`+"'," +
"$feature.icon == 'CIRCULAR_NO_SPEED', '"+`${circularSignNoSpeedImage}`+"'," +
"$feature.icon == 'WARNING', '"+`${warningImage}`+"'," +
"$feature.icon == 'CONSTRUCTION', '"+`${constructionImage}`+"'," +
"$feature.icon == 'RECTANGULAR', '"+`${rectangularSignImage}`+"'," +
"$feature.icon == 'TRAFFIC_LIGHTS', '"+`${trafficLightImage}`+"'," +
"$feature.icon == 'DIAMOND', '"+`${diamondImage}`+"'," +
"$feature.icon == 'YIELD', '"+`${yieldImage}`+"'," +
"$feature.icon == 'ROAD_MARKINGS_ARROWS', '"+`${roadArrowImage}`+"'," +
"$feature.icon == 'ROAD_MARKINGS_STOPLINE', '"+`${roadStoplineImage}`+"'," +
"$feature.icon == 'DOT1', '"+`${dotImage}` + "'," +
"$feature.icon == 'HORIZONTAL', '"+`${overheadStructureImage}`+"'," +
"$feature.icon == 'REFLECTORS', '"+`${reflectorImage}`+"'," +
"$feature.icon == 'CROSSING', '"+`${roadCrossingImage}`+"'," +
"$feature.icon == 'MANHOLE_COVER', '"+`${manholeImage}`+"'," +
"$feature.icon == 'DOT2', '"+`${dotImage}` + "'," +
"$feature.icon == 'UNRECOGNIZED_CIRCLE', '"+`${unrecognizedCircleImage}`+"'," +
"$feature.icon == 'UNRECOGNIZED_RECRANGLE', '"+`${unrecognizedRectImage}` + "'," +
"'"+`${dotImage}`+"')";

const surveyConfig = {
  
  // Production
  layerItemId: '3d218196cda94e2eacf86994f9bbd4e4',
  webmapId: 'e89e13f2f6174777bcd81073c4158ce6',
  // Test
  // layerItemId: '3fd4485bb8ca45bfa90e0e143c2cd7c2',
  // webmapId: 'aabc5fa9e96045eaa0968702fd33e6d9',
  initialRendererField: 'all',
  renderers: {
    'all': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "icon",
      valueExpression: "When($feature.icon == 'sign5', 'Speed Sign'," +
                            "$feature.icon == 'sign10', 'Speed Sign'," +
                            "$feature.icon == 'sign15', 'Speed Sign'," +
                            "$feature.icon == 'sign20', 'Speed Sign'," +
                            "$feature.icon == 'sign25', 'Speed Sign'," +
                            "$feature.icon == 'sign30', 'Speed Sign'," +
                            "$feature.icon == 'sign35', 'Speed Sign'," +
                            "$feature.icon == 'sign40', 'Speed Sign'," +
                            "$feature.icon == 'sign45', 'Speed Sign'," +
                            "$feature.icon == 'sign50', 'Speed Sign'," +
                            "$feature.icon == 'sign55', 'Speed Sign'," +
                            "$feature.icon == 'sign60', 'Speed Sign'," +
                            "$feature.icon == 'sign65', 'Speed Sign'," +
                            "$feature.icon == 'sign70', 'Speed Sign'," +
                            "$feature.icon == 'sign75', 'Speed Sign'," +
                            "$feature.icon == 'sign80', 'Speed Sign'," +
                            "$feature.icon == 'sign85', 'Speed Sign'," +
                            "$feature.icon == 'sign90', 'Speed Sign'," +
                            "$feature.icon == 'sign95', 'Speed Sign'," +
                            "$feature.icon == 'sign100', 'Speed Sign'," +
                            "$feature.icon == 'sign105', 'Speed Sign'," +
                            "$feature.icon == 'sign110', 'Speed Sign'," +
                            "$feature.icon == 'sign115', 'Speed Sign'," +
                            "$feature.icon == 'sign120', 'Speed Sign'," +
                            "$feature.icon == 'sign125', 'Speed Sign'," +
                            "$feature.icon == 'sign130', 'Speed Sign'," +
                            "$feature.icon == 'sign135', 'Speed Sign'," +
                            "$feature.icon == 'sign140', 'Speed Sign'," +
                            "$feature.icon == 'sign145', 'Speed Sign'," +
                            "$feature.icon == 'CIRCULAR_NO_SPEED', 'Non-Speed Sign'," +
                            "$feature.icon == 'WARNING', 'Non-Speed Sign'," +
                            "$feature.icon == 'CONSTRUCTION', 'Non-Speed Sign'," + 
                            "$feature.icon == 'RECTANGULAR', 'Non-Speed Sign'," + 
                            "$feature.icon == 'TRAFFIC_LIGHTS', 'Traffic Light'," + 
                            "$feature.icon == 'DIAMOND', 'Non-Speed Sign'," + 
                            "$feature.icon == 'YIELD', 'Non-Speed Sign'," + 
                            "$feature.icon == 'ROAD_MARKINGS_ARROWS', 'Roadmark'," + 
                            "$feature.icon == 'ROAD_MARKINGS_STOPLINE', 'Roadmark'," + 
                            "$feature.icon == 'DOT1', 'Roadmark'," + 
                            "$feature.icon == 'HORIZONTAL', 'Overhead Structure'," + 
                            "$feature.icon == 'REFLECTORS', 'Reflector'," + 
                            "$feature.icon == 'CROSSING', 'Roadmark'," + 
                            "$feature.icon == 'MANHOLE_COVER','Manhole Cover'," + 
                            "$feature.icon == 'DOT2', 'Roadmark'," + 
                            "$feature.icon == 'UNRECOGNIZED_CIRCLE', 'Unidentfied Sign'," + 
                            "$feature.icon == 'UNRECOGNIZED_RECRANGLE', 'Unidentfied Sign'," + 
                            "'other')",
      
      defaultSymbol: {type: "simple-marker", size : 2.0, color: "white"},
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
        {value: 'Speed Sign', symbol: {type: "simple-marker", size:6.0, color: "orange"}}, 
        {value: 'Non-Speed Sign', symbol: {type: "simple-marker", size:6.0, color: "red"}}, 
        {value: 'Traffic Light', symbol: {type: "simple-marker", size:6.0, color: "purple"}}, 
        {value: 'Roadmark', symbol: {type: "simple-marker", size:6.0, color: "blue"}}, 
        {value: 'Overhead Structure', symbol: {type: "simple-marker", size:6.0, color: "light blue"}}, 
        {value: 'Reflector', symbol: {type: "simple-marker", size:6.0, color: "green"}}, 
        {value: 'Unidentfied Sign', symbol: {type: "simple-marker", size:3.0, color: "black"}}
        
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
      text: "Type: <b>{expression/type-expr}</b><br>" +
             "Detected at {publish_date} (version {map_version})<br>" +
             "Size: {height} X {width} m<br>",
    }, 
    {
      type: "media", // MediaContentElement
      mediaInfos: [
        {
          title: "",
          type: "image",
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
      {
        name: "sign-icon",
        expression: icons_exp
      }
    ],
  },
  
  bookmarkInfos: {
   'ORK': {
       title: '61st on 1st',
        content: 'The most beutiful traffic light in all of NYC.'
    },
  },

  locations: [{
    'name' : 'New York City',
    'image' : NYCImage,
    'extent' : {
                 "xmin":-8233752.069196624,"ymin":4976855.35232054,"xmax":-8232870.057549805,"ymax":4977349.2071830435,
                 "spatialReference":{"wkid":102100}
               }
  }, 
  {
    'name' : 'San Francisco, CA',
    'image' : SanFranImage,
    'extent' : {
                 "xmin":-13631513.839310113,"ymin":4547141.554969908,"xmax":-13622150.303345192,"ymax":4551144.944326338
                 ,
                 "spatialReference":{"wkid":102100}
               }
  },
  {
    'name' : 'Heathrow',
    'image' : HeathrowImage,
    'extent' : {
                 "xmin":-57155.730385611794,"ymin":6702392.397662927,"xmax":-43043.54403848015,"ymax":6710294.075461897
                 ,
                 "spatialReference":{"wkid":102100}
               }
  },
  {
    'name' : 'Obaida (Tokyo)',
    'image' : ObaidaImage,
    'extent' : {
                 "xmin":15556162.5889992,"ymin":4246236.971771516,"xmax":15565526.124964122,"ymax":4250240.3611279465
                 ,
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
    center: [-122.483311, 37.707744],
    zoom: 15
  }
}

export default surveyConfig;