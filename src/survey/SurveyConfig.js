import { getDomainMap } from '../utils/Utils';

import sign5USImage from '../resources/images/speedlimit_5_us.png'
import sign10USImage from '../resources/images/speedlimit_10_us.png'
import sign15USImage from '../resources/images/speedlimit_15_us.png'
import sign20USImage from '../resources/images/speedlimit_20_us.png'
import sign25USImage from '../resources/images/speedlimit_25_us.png'
import sign30USImage from '../resources/images/speedlimit_30_us.png'
import sign35USImage from '../resources/images/speedlimit_35_us.png'
import sign40USImage from '../resources/images/speedlimit_40_us.png'
import sign45USImage from '../resources/images/speedlimit_45_us.png'
import sign50USImage from '../resources/images/speedlimit_50_us.png'
import sign55USImage from '../resources/images/speedlimit_55_us.png'
import sign60USImage from '../resources/images/speedlimit_60_us.png'
import sign65USImage from '../resources/images/speedlimit_65_us.png'
import sign70USImage from '../resources/images/speedlimit_70_us.png'
import sign75USImage from '../resources/images/speedlimit_75_us.png'
import sign80USImage from '../resources/images/speedlimit_80_us.png'
import sign85USImage from '../resources/images/speedlimit_85_us.png'
import sign10EruopeImage from '../resources/images/speedlimit_10_europe.png'
import sign20EruopeImage from '../resources/images/speedlimit_20_europe.png'
import sign30EruopeImage from '../resources/images/speedlimit_30_europe.png'
import sign40EruopeImage from '../resources/images/speedlimit_40_europe.png'
import sign50EruopeImage from '../resources/images/speedlimit_50_europe.png'
import sign60EruopeImage from '../resources/images/speedlimit_60_europe.png'
import sign70EruopeImage from '../resources/images/speedlimit_70_europe.png'
import sign80EruopeImage from '../resources/images/speedlimit_80_europe.png'
import sign90EruopeImage from '../resources/images/speedlimit_90_europe.png'
import sign100EruopeImage from '../resources/images/speedlimit_100_europe.png'
import sign110EruopeImage from '../resources/images/speedlimit_110_europe.png'
import sign120EruopeImage from '../resources/images/speedlimit_120_europe.png'
import sign130EruopeImage from '../resources/images/speedlimit_130_europe.png'
import sign140EruopeImage from '../resources/images/speedlimit_140_europe.png'
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
import NYCImage from '../resources/images/NYC.jpg';
import LAImage from '../resources/images/LA.jpg';
// import AtlantaImage from '../resources/images/Atlanta.jpg'
import SanFranImage from '../resources/images/SanFran.jpg'
import HeathrowImage from '../resources/images/Heathrow.jpg'
import ObaidaImage from '../resources/images/Obaida.jpg'
import BarcelonaImage from '../resources/images/Barcelona.jpg'
import RomeImage from '../resources/images/Rome.jpg'
import FrankfurtImage from "../resources/images/frankfurt-am-main.jpg"
import MunichImage from "../resources/images/Munich.jpg"
import BerlinImage from "../resources/images/Berlin.jpg"
import LasVegasImage from "../resources/images/Las Vegas.jpg"
import HanoverImage from "../resources/images/hanover.jpg"
import ParisImage from "../resources/images/Paris.png"
import SingaporeImage from "../resources/images/Singapore.jpg"

const newSymbol = (...rgba) => {
  const rgbStr = rgba.slice(0, 3).join(',');
  const rgbaStr = rgba.join(',');
  return {
    type: "simple-marker", 
    color: `rgb(${rgbStr})`, 
    size: "9px", 
    outline: { 
      color: `rgba(${rgbaStr})`, 
      width: 2.5
    },
    onHoverScale: 3.0,
  }
};

const category_l42speed = {
               '0': '10', '1': '20', '2': '30', '3': '40', '4': '50', '5': '60',
               '6': '70', '7': '80', '8': '90', '9': '100', '10': '110',
               '11': '120', '12': '130', '13': '140',
               '28': '10', '29': '20', '30': '30', '31': '40', '32': '50', 
               '33': '60', '34': '70', '35': '80', '36': '90', '37': '100',
               '38': '110', '39': '120', '40': '130',
               '100' : '5', '101' : '15', '102': '25', '103': '35', '104': '45',
               '105': '55', '106': '65', '107': '75', '108': '85', '109': '95',
               '110': '105', '111': '115', '112': '125', '113': '135', '114': '145',
               '115': '5', '116': '15', '117': '25', '118': '35', '119': '45', '120': '55',
               '121': '65', '122': '75', '123': '85', '124': '95', '125': '105',
               '126': '115', '127': '125', '128': '135', '129': '145',
};

const speed2image = {
  'Europe' : {'10' : `${sign10EruopeImage}`,
              '20'  : `${sign20EruopeImage}`,
              '30'  : `${sign30EruopeImage}`,
              '40'  : `${sign40EruopeImage}`,
              '50'  : `${sign50EruopeImage}`,
              '60'  : `${sign60EruopeImage}`,
              '70'  : `${sign70EruopeImage}`,
              '80'  : `${sign80EruopeImage}`,
              '90'  : `${sign90EruopeImage}`,
              '100'  : `${sign100EruopeImage}`,
              '110'  : `${sign110EruopeImage}`,
              '120'  : `${sign120EruopeImage}`,
              '130'  : `${sign130EruopeImage}`,
              '140'  : `${sign140EruopeImage}`},
  'US' : {'5' : `${sign5USImage}`,
          '15' : `${sign15USImage}`,
          '25' : `${sign25USImage}`,
          '35' : `${sign35USImage}`,
          '45' : `${sign45USImage}`,
          '55' : `${sign55USImage}`,
          '65' : `${sign65USImage}`,
          '75' : `${sign75USImage}`,
          '85' : `${sign85USImage}`,
          '10' : `${sign10USImage}`,
          '20' : `${sign20USImage}`,
          '30' : `${sign30USImage}`,
          '40' : `${sign40USImage}`,
          '50' : `${sign50USImage}`,
          '60' : `${sign60USImage}`,
          '70' : `${sign70USImage}`,
          '80' : `${sign80USImage}`,
        }
};
const category_l22image = {
    '0' : `${circularSignNoSpeedImage}`,
    '1' : `${warningImage}`,
    '2' : `${constructionImage}`,
    '3' : `${rectangularSignImage}`,
    '4' : `${trafficLightImage}`,
    '5': `${diamondImage}`,
    '6' : `${yieldImage}`,
    '7' : `${roadArrowImage}`,
    '8' : `${roadStoplineImage}`,
    '10' : `${overheadStructureImage}`,
    '11' : `${reflectorImage}`,
    '12' : `${roadCrossingImage}`,
    '13' : `${manholeImage}`
} ;

const speedSignIconsExp = ['Europe', 'US'].map(region => 
  Object.keys(category_l42speed).filter(categoryL4 => 
    category_l42speed[categoryL4] in speed2image[region]
  ).map(categoryL4 => 
     "(($feature.category_l1==0 || $feature.category_l1==3)" +
     " && ($feature.traffic_sign_category_l4 == "+categoryL4+")" + 
            " && ($feature.region == '"+region+"')), '" + 
            speed2image[region][category_l42speed[categoryL4]]+"'").join() 
).join()


const category_l2IconsExp = Object.keys(category_l22image).map(category_l2 => 
  "($feature.category_l2 == " + category_l2 + "), '"+category_l22image[category_l2]+"'"
).join()

// const icons_exp = "When(" + speedSignIconsExp + ", " + category_l2IconsExp + ", '" + `${dotImage}` + "')";
const icons_exp = "When(" + speedSignIconsExp + ", " + category_l2IconsExp + ", '')";

const surveyConfig = {
  
  
  layerItemId: 'eb63836cecbb4de0833a6ab13796a2f3',
  webmapId: '13b7762b9e0c4c9996378be956e6bf5c',
  initialRendererField: 'all',
  renderers: {
    'all': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "category_l1",
      
      defaultSymbol: newSymbol(0,0,255,0.3),
      uniqueValueInfos: [
        {value: 0, symbol: newSymbol(255,255,0,0.3)},
        {value: 1, symbol: newSymbol(255,99,71,0.3)},
        {value: 2, symbol: newSymbol(127,255,0,0.3)},
        {value: 3, symbol: newSymbol(64,224,208,0.3)},
        {value: 4, symbol: newSymbol(186,85,211,0.3)},      
      ],

      visualVariables: [
        {
          type: "size",
          field: "category_l1",
          valueExpression: "$view.scale",
          legendOptions: {
            showLegend: false,
          },
          stops: [
            {value: 564,  size: 8},
            {value: 1128, size: 6},
            {value: 2256, size: 4.5},
            {value: 4513, size: 3},
            {value: 9027, size: 2.25},
            {value: 18055, size: 1.5},
            {value: 36111, size: 1},
            {value: 144447, size: 0.5},
          ]
        },
      ],
    }
  },
  filters: [
    // {name: 'category_l1', type: 'nested', params: {
    //   filters: [
    //     {name: 'traffic_sign_category_l3', 
    //      type: 'multiselect', 
    //      params: {dynamic: true, mode:'multiple', nesting_field_value:'0'}},
    //     {name: 'tfl_category_l3', 
    //      type: 'multiselect', 
    //      params: {dynamic: true, mode:'multiple', nesting_field_value:"1"}},
    //     {name: 'road_marking_category_l3', 
    //      type: 'multiselect', 
    //      params: {dynamic: true, mode:'multiple', nesting_field_value:"2"}},
    //     {name: 'pole_category_l3', 
    //      type: 'multiselect', 
    //      params: {dynamic: true, mode:'multiple', nesting_field_value:"3"}},
    //     {name: 'manhole_category_l3', 
    //      type: 'multiselect', 
    //      params: {dynamic: true, mode:'multiple', nesting_field_value:"4"}}
    //   ]}},
    {name: 'traffic_sign_category_l3', 
         type: 'multiselect', 
         params: {dynamic: true, mode:'multiple', subset_query:'category_l1=0'}},
        {name: 'tfl_category_l3', 
         type: 'multiselect', 
         params: {dynamic: true, mode:'multiple', subset_query:"category_l1=1"}},
        {name: 'road_marking_category_l3', 
         type: 'multiselect', 
         params: {dynamic: true, mode:'multiple', subset_query:"category_l1=2"}},
        {name: 'pole_category_l3', 
         type: 'multiselect', 
         params: {dynamic: true, mode:'multiple', subset_query:"category_l1=3"}},
        {name: 'manhole_category_l3', 
         type: 'multiselect', 
         params: {dynamic: true, mode:'multiple', subset_query:"category_l1=4"}},
    {name: 'new_detected_missing', type: 'multiselect', params: {dynamic: true, mode:'multiple'}},
  ],
  charts: [
  {
    id: 'traffic_sign_category_l3_label',
    type: 'bar',
    title: 'Traffic Sign Type',
    xField: 'traffic_sign_category_l3_label',
    yField: 'countOFtraffic_sign_category_l3',
    // see here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html
    // and here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-StatisticDefinition.html
    // use "order by" parameter or "resultTransform" to sort
   queryDefinition: {
        where: "1=1",
        outFields: "*",
        orderByFields: "countOFtraffic_sign_category_l3",
        groupByFieldsForStatistics: "traffic_sign_category_l3",
        outStatistics: [{
          "onStatisticField":"traffic_sign_category_l3",
          "outStatisticFieldName":"countOFtraffic_sign_category_l3",
          "statisticType":"count"
      }]
    },
    resultTransform: result => {
      if(!result || !result.features || result.features.length < 1) return result;
      const field = result.fields.find(f => f.name === 'traffic_sign_category_l3');
      const domainMap = getDomainMap(field.domain);
      const newFeatures = result.features.map(f => {  
        const attributes = f.attributes;
        const fieldValue = f.attributes['traffic_sign_category_l3'];
        const fieldDomain = domainMap.has(fieldValue) ? domainMap.get(fieldValue) : fieldValue;
        return {
          attributes: {
            ...attributes,
            traffic_sign_category_l3_label: fieldDomain
          }
        }
      });
      result.features = newFeatures;
      return result;
    }
  },
  {
    id: 'tfl_category_l3_label',
    type: 'bar',
    title: 'Traffic Light Type',
    xField: 'tfl_category_l3_label',
    yField: 'countOFtfl_category_l3',
    // see here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html
    // and here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-StatisticDefinition.html
    // use "order by" parameter or "resultTransform" to sort
   queryDefinition: {
        where: "1=1",
        outFields: "*",
        orderByFields: "countOFtfl_category_l3",
        groupByFieldsForStatistics: "tfl_category_l3",
        outStatistics: [{
          "onStatisticField":"tfl_category_l3",
          "outStatisticFieldName":"countOFtfl_category_l3",
          "statisticType":"count"
      }]
    },
    resultTransform: result => {
      if(!result || !result.features || result.features.length < 1) return result;
      const field = result.fields.find(f => f.name === 'tfl_category_l3');
      const domainMap = getDomainMap(field.domain);
      const newFeatures = result.features.map(f => {  
        const attributes = f.attributes;
        const fieldValue = f.attributes['tfl_category_l3'];
        const fieldDomain = domainMap.has(fieldValue) ? domainMap.get(fieldValue) : fieldValue;
        return {
          attributes: {
            ...attributes,
            tfl_category_l3_label: fieldDomain
          }
        }
      });
      result.features = newFeatures;
      return result;
    }
  },
  {
    id: 'road_marking_category_l3_label',
    type: 'bar',
    title: 'Road Marking Types',
    xField: 'road_marking_category_l3_label',
    yField: 'countOFroad_marking_category_l3',
    // see here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html
    // and here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-StatisticDefinition.html
    // use "order by" parameter or "resultTransform" to sort
   queryDefinition: {
        where: "1=1",
        outFields: "*",
        orderByFields: "countOFroad_marking_category_l3",
        groupByFieldsForStatistics: "road_marking_category_l3",
        outStatistics: [{
          "onStatisticField":"road_marking_category_l3",
          "outStatisticFieldName":"countOFroad_marking_category_l3",
          "statisticType":"count"
      }]
    },
    resultTransform: result => {
      if(!result || !result.features || result.features.length < 1) return result;
      const field = result.fields.find(f => f.name === 'road_marking_category_l3');
      const domainMap = getDomainMap(field.domain);
      const newFeatures = result.features.map(f => {  
        const attributes = f.attributes;
        const fieldValue = f.attributes['road_marking_category_l3'];
        const fieldDomain = domainMap.has(fieldValue) ? domainMap.get(fieldValue) : fieldValue;
        return {
          attributes: {
            ...attributes,
            road_marking_category_l3_label: fieldDomain
          }
        }
      });
      result.features = newFeatures;
      return result;
    }
  },
  {
    id: 'pole_category_l3_label',
    type: 'bar',
    title: 'Pole types',
    xField: 'pole_category_l3_label',
    yField: 'countOFpole_category_l3',
    // see here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html
    // and here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-StatisticDefinition.html
    // use "order by" parameter or "resultTransform" to sort
   queryDefinition: {
        where: "1=1",
        outFields: "*",
        orderByFields: "countOFpole_category_l3",
        groupByFieldsForStatistics: "pole_category_l3",
        outStatistics: [{
          "onStatisticField":"pole_category_l3",
          "outStatisticFieldName":"countOFpole_category_l3",
          "statisticType":"count"
      }]
    },
    resultTransform: result => {
      if(!result || !result.features || result.features.length < 1) return result;
      const field = result.fields.find(f => f.name === 'pole_category_l3');
      const domainMap = getDomainMap(field.domain);
      const newFeatures = result.features.map(f => {  
        const attributes = f.attributes;
        const fieldValue = f.attributes['pole_category_l3'];
        const fieldDomain = domainMap.has(fieldValue) ? domainMap.get(fieldValue) : fieldValue;
        return {
          attributes: {
            ...attributes,
            pole_category_l3_label: fieldDomain
          }
        }
      });
      result.features = newFeatures;
      return result;
    }
  },
  {
    id: 'manhole_category_l3_label',
    type: 'bar',
    title: 'Manhole Type',
    xField: 'manhole_category_l3_label',
    yField: 'countOFmanhole_category_l3',
    // see here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-Query.html
    // and here
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-StatisticDefinition.html
    // use "order by" parameter or "resultTransform" to sort
   queryDefinition: {
        where: "1=1",
        outFields: "*",
        orderByFields: "countOFmanhole_category_l3",
        groupByFieldsForStatistics: "manhole_category_l3",
        outStatistics: [{
          "onStatisticField":"manhole_category_l3",
          "outStatisticFieldName":"countOFmanhole_category_l3",
          "statisticType":"count"
      }]
    },
    resultTransform: result => {
      if(!result || !result.features || result.features.length < 1) return result;
      const field = result.fields.find(f => f.name === 'manhole_category_l3');
      const domainMap = getDomainMap(field.domain);
      const newFeatures = result.features.map(f => {  
        const attributes = f.attributes;
        const fieldValue = f.attributes['manhole_category_l3'];
        const fieldDomain = domainMap.has(fieldValue) ? domainMap.get(fieldValue) : fieldValue;
        return {
          attributes: {
            ...attributes,
            manhole_category_l3_label: fieldDomain
          }
        }
      });
      result.features = newFeatures;
      return result;
    }
  },
], 
  popupTemplate: {
    title: "{expression/title-prefix} {category_l1} {expression/title_suffix}",
    content: [
      {
      type: "text",
      text: "Type: <b>{expression/type-expr}</b><br>" +
             "Detected at {publish_date} (version {map_version})<br>" +
             "{expression/size-expr}<br>",
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
        expression: "When($feature.category_l1 == 0, DomainName($feature, 'traffic_sign_category_l4', $feature.traffic_sign_category_l4)," +
                        "$feature.category_l1 == 1, DomainName($feature, 'tfl_category_l4', $feature.tfl_category_l4)," +
                        "$feature.category_l1 == 2, DomainName($feature, 'road_marking_category_l4', $feature.road_marking_category_l4)," +
                        "$feature.category_l1 == 3, DomainName($feature, 'pole_category_l4', $feature.pole_category_l4)," +
//                        "$feature.category_l1 == 4, DomainName($feature, 'manhole_category_l4', $feature.manhole_category_l4)," +
                        "'')"

      },
      {
        name: "title-prefix",
        title: "Title Prefix",
        expression: "When($feature.new_detected_missing == 2, 'Missing', $feature.new_detected_missing == 1, 'New',  '')"
      },
      {
        name: "title-suffix",
        title: "Title Suffix",
        expression: "When(($feature.new_detected_missing == 2) ||  ($feature.new_detected_missing == 1), '',  'detected')"
      },
      {
        name: "sign-icon",
        expression: icons_exp
      },
      {
        name: "size-expr",
        title: "Size",
        expression: "When($feature.category_l1 == 3, '', 'Size: {height} X {width} m'"
      }
    ],
  },
  hasZoomListener: true,
  hasCustomTooltip: true,
  onHoverEffect: 'upscale',
  basemaps: {
    'dark-gray': {minZoom: 0, maxZoom: 16, id: '8654f5c608384b9eb7e06fd566643afc'},
    'satellite': {minZoom: 16, maxZoom: 100, streetNames: true},
  },
  bookmarkInfos: {
  },
  locationsByArea: [
    {areaName : 'USA',
     locations : [
                      {
                        'name' : 'Las Vegas',
                        'image' : LasVegasImage,
                        'extent' : {
                                      "xmin":-115.228211,
                                      "ymin":36.084378,
                                      "xmax":-115.125557,
                                      "ymax":36.116765,
                                      "spatialReference" : { 
                                        "wkid":4326
                                      }
                                    }
                      },
                      {
                        'name' : 'New York City',
                        'image' : NYCImage,
                        'extent' : {
                                      "xmin":-8233752.069196624,
                                      "ymin":4976855.35232054,
                                      "xmax":-8232870.057549805,
                                      "ymax":4977349.2071830435,
                                      "spatialReference" : { 
                                        "wkid":102100
                                      }
                                    }
                      },
                      {
                        'name' : 'Los Angeles',
                        'image' : LAImage,
                        'extent' : {
                          'ymax' : 34.062122, 
                          'xmin' : -118.275700,
                          'ymin' : 34.030624, 
                          'xmax' : -118.214838,
                          'spatialReference' : {
                            'wkid' : 4326
                          }
                        }
                      },
                      {
                        'name' : 'San Francisco',
                        'image' : SanFranImage,
                        'extent' : {
                                    "xmin":-13631513.839310113,"ymin":4547141.554969908,"xmax":-13622150.303345192,"ymax":4551144.944326338
                                    ,
                                    "spatialReference":{"wkid":102100}
                                  }
                      }
                    ]
      },
    { areaName : 'Germany',
      locations : [
        {
          'name' : 'Frankfurt',
          'image' : FrankfurtImage,
          'extent' : {
            'ymax' : 50.123851, 
            'xmin' : 8.656489,
            'ymin' : 50.104365, 
            'xmax' : 8.720233,
            'spatialReference' : {
              'wkid' : 4326
            }
          }
        },
        {
          'name' : 'Munich',
          'image' : MunichImage,
          'extent' : {
            'ymax' :  48.227980, 
            'xmin' : 11.268866,
            'ymin' : 48.065403, 
            'xmax' : 11.790256,
            'spatialReference' : {
              'wkid' : 4326
            }
          }
        },
        {
          'name' : 'Berlin',
          'image' : BerlinImage,
          'extent' : {
            'ymax' : 52.555150, 
            'xmin' : 13.281972,
            'ymin' : 52.480311, 
            'xmax' : 13.544110,
            'spatialReference' : {
              'wkid' : 4326
            }
          }
        },
        // {
        //   'name' : 'Hamburg',
        //   'image' : HamburgImage,
        //   'extent' : {
        //     'ymax' : 53.569513, 
        //     'xmin' : 9.935844,
        //     'ymin' : 53.538964, 
        //     'xmax' : 10.046473,
        //     'spatialReference' : {
        //       'wkid' : 4326
        //     }
        //   }
        // },
        {
          'name' : 'Hanover',
          'image' : HanoverImage,
          'extent' : {
            'ymax' : 52.403986, 
            'xmin' : 9.613037,
            'ymin' : 52.341588, 
            'xmax' : 9.834076,
            'spatialReference' : {
              'wkid' : 4326
            }
          }
        },
      ]},
      { areaName: "Europe",
      locations: [
                    {'name' : 'Rome',
                      'image' : RomeImage,
                      'extent' : {
                        'ymax' : 41.930687, 
                        'xmin' : 12.391691,
                        'ymin' : 41.865653, 
                        'xmax' : 12.579500,
                        'spatialReference' : {
                          'wkid' : 4326
                        }
                      }
                    },  
                    {
                      'name' : 'Barcelona',
                      'image' : BarcelonaImage,
                      'extent' : {
                        'ymax' : 41.432012, 
                        'xmin' : 2.055583,
                        'ymin' : 41.370578, 
                        'xmax' : 2.252006,
                        'spatialReference' : {
                          'wkid' : 4326
                        }
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
                      'name' : "Paris",
                      'image' : ParisImage,
                      extent : {
                        'ymax' : 48.900043, 
                        'xmin' : 2.219860,
                        'ymin' : 48.811833, 
                        'xmax' : 2.461388,
                        'spatialReference' : {
                          'wkid' : 4326
                        }
                      }
                    }
                  ]
    },
    
      {
        areaName : 'APAC',
        locations : [
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
                          'name' : 'Singapore',
                          'image' : SingaporeImage,
                          'extent' : {
                                      'ymax' : 1.429421, 
                                      'xmin' : 103.697668,
                                      'ymin' : 1.241328, 
                                      'xmax' : 104.035841,
                                      'spatialReference' : {
                                          'wkid' : 4326
                                      }
    
                          }
                        },
        ]
      }

  ],
   
  viewConfig: { 
    
    // center: [-122.483311, 37.707744],
    center: [11.577279, 48.137732],
    zoom: 15
  }
}

export default surveyConfig;
