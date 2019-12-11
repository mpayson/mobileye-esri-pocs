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
import trafficSignDot from '../resources/images/Traffic_Signs.png';
import TrafficLightDot from '../resources/images/Traffic_Lights_dot.png';
import roadMarkingDot from '../resources/images/Road_Markings.png';
import manholeDot from '../resources/images/Manholes.png';
import polesDot from '../resources/images/Poles.png';
import otherDot from '../resources/images/Other.png';
import dotImage from '../resources/images/dot.png';
import NYCImage from '../resources/images/NYC.jpg';
import LAImage from '../resources/images/LA.jpg';
import AtlantaImage from '../resources/images/Atlanta.jpg'
import SanFranImage from '../resources/images/SanFran.jpg'
import HeathrowImage from '../resources/images/Heathrow.jpg'
import ObaidaImage from '../resources/images/Obaida.jpg'
import BarcelonaImage from '../resources/images/Barcelona.jpg'
import FrankfurtImage from "../resources/images/frankfurt-am-main.jpg"
import MunichImage from "../resources/images/Munich.jpg"
import BerlinImage from "../resources/images/Berlin.jpg"
import HamburgImage from "../resources/images/hamburg.jpg"
import HanoverImage from "../resources/images/hanover.jpg"

const trafficSignType2speed = {
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
const groupType2image = {
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
  Object.keys(trafficSignType2speed).filter(signType => 
    trafficSignType2speed[signType] in speed2image[region]
  ).map(signType => 
     "(($feature.system_type_group==0 || $feature.system_type_group==3)" +
     " && ($feature.traffic_sign_type == "+signType+")" + 
            " && ($feature.region == '"+region+"')), '" + 
            speed2image[region][trafficSignType2speed[signType]]+"'").join() 
).join()


const groupTypeIconsExp = Object.keys(groupType2image).map(system_type => 
  "($feature.system_type == " + system_type + "), '"+groupType2image[system_type]+"'"
).join()

const icons_exp = "When(" + speedSignIconsExp + ", " + groupTypeIconsExp + ", '" + `${dotImage}` + "')";
//const icons_exp = "When(" + groupTypeIconsExp + ", '" + `${dotImage}` + "')";

console.log(icons_exp)

const surveyConfig = {
  
  // layerItemId: '3d218196cda94e2eacf86994f9bbd4e4',
  // webmapId: 'e89e13f2f6174777bcd81073c4158ce6',
  
  layerItemId: '8454a5c3867b4133aeedfd00352272e2',
  webmapId: 'aabc5fa9e96045eaa0968702fd33e6d9',
  initialRendererField: 'all',
  renderers: {
    'all': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "system_type_group",
      
      defaultSymbol: {type: "picture-marker", url: otherDot, width: "10px", height: "10px"},
      uniqueValueInfos: [
        {value: 0, symbol: {type: "picture-marker", url: trafficSignDot, width: "10px", height: "10px"}}, 
        {value: 1, symbol: {type: "picture-marker", url: TrafficLightDot, width: "10px", height: "10px"}}, 
        {value: 2, symbol: {type: "picture-marker", url: roadMarkingDot, width: "10px", height: "10px"}}, 
        {value: 3, symbol: {type: "picture-marker", url: polesDot, width: "10px", height: "10px"}}, 
        {value: 4, symbol: {type: "picture-marker", url: manholeDot, width: "10px", height: "10px"}}        
      ],
  }
  },
  filters: [
    {name: 'system_type', type: 'multiselect', params: {dynamic: true,mode:'multiple'}},
    {name: 'comparsion_to_prev_map', type: 'multiselect', params: {dynamic: true}},
    {name: 'identified', type: 'select', params: {dynamic: true}},
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
  locationsByArea: [
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
      { areaName: "Other Europe",
      locations: [
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
                  ]
    },
    {areaName : 'USA',
     locations : [
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
                        'name' : 'San Francisco, CA',
                        'image' : SanFranImage,
                        'extent' : {
                                    "xmin":-13631513.839310113,"ymin":4547141.554969908,"xmax":-13622150.303345192,"ymax":4551144.944326338
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
                      }
                    ]
      },
      {
        areaName : 'Japan',
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
        ]
      }

  ],
   
  viewConfig: { 
    // center: [-73.974051, 40.762746],
    center: [-122.483311, 37.707744],
    zoom: 15
  }
}

export default surveyConfig;
