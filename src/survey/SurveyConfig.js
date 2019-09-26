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


// update to map

const surveyConfig = {
  layerItemId: '8560701bf1b44bccb3da5bb876e7f625',
  initialRendererField: 'signs',
  renderers: {
    'signs': {
      _type: "jsapi",
      type: "unique-value",  // autocasts as new UniqueValueRenderer()
      field: "sign_type",
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
        field: "edge_length_or_diameter",
          minDataValue: 0.0,
          maxDataValue: 2.0,
          minSize: 0,
          maxSize: 30
      }],
      uniqueValueInfos: [
        {value: '0', symbol: {type: "picture-marker", url: sign10Image}},
        {value: '1', symbol: {type: "picture-marker", url: sign20Image}},
        {value: '2', symbol: {type: "picture-marker", url: sign30Image}},
        {value: '3', symbol: {type: "picture-marker", url: sign40Image}},
        {value: '4', symbol: {type: "picture-marker", url: sign50Image}},
        {value: '5', symbol: {type: "picture-marker", url: sign60Image}},
        {value: '6', symbol: {type: "picture-marker", url: sign70Image}},
        {value: '7', symbol: {type: "picture-marker", url: sign80Image}},
        {value: '8', symbol: {type: "picture-marker", url: sign90Image}},
        {value: '9', symbol: {type: "picture-marker", url: sign100Image}},
        {value: '10', symbol: {type: "picture-marker", url: sign110Image}},
        {value: '11', symbol: {type: "picture-marker", url: sign120Image}},
        {value: '12', symbol: {type: "picture-marker", url: sign130Image}},
        {value: '13', symbol: {type: "picture-marker", url: sign140Image}},
        {value: '28', symbol: {type: "picture-marker", url: sign10Image}},
        {value: '29', symbol: {type: "picture-marker", url: sign20Image}},
        {value: '30', symbol: {type: "picture-marker", url: sign30Image}},
        {value: '31', symbol: {type: "picture-marker", url: sign40Image}},
        {value: '32', symbol: {type: "picture-marker", url: sign50Image}},
        {value: '33', symbol: {type: "picture-marker", url: sign60Image}},
        {value: '34', symbol: {type: "picture-marker", url: sign70Image}},
        {value: '35', symbol: {type: "picture-marker", url: sign80Image}},
        {value: '36', symbol: {type: "picture-marker", url: sign90Image}},
        {value: '37', symbol: {type: "picture-marker", url: sign100Image}},
        {value: '38', symbol: {type: "picture-marker", url: sign110Image}},
        {value: '39', symbol: {type: "picture-marker", url: sign120Image}},
        {value: '40', symbol: {type: "picture-marker", url: sign130Image}},
        {value: '41', symbol: {type: "picture-marker", url: sign140Image}}
    ]
  }
  },
  filters: [
    {name: 'sign_type', type: 'multiselect', params: {}},
    {name: 'comparsion_to_prev_map', type: 'multiselect', params: {}},
    {name: 'landmark_type', type: 'multiselect', params: {}},
    {name: 'map_version', type: 'select', params: {}},
    
  ],
  histograms: [
    {name: 'display_text', withFilter : true, params: {isLogarithmic: false, log: true, numBins: 14}},
    {name: 'edge_length_or_diameter', withFilter : true, params: {isLogarithmic: false, log: true}},
  ],
  popupTemplate: {
    title: "{expression/title-expression}",
    content: "Sign type: <b>{sign_type}{expression/speed-units}{expression/landmark_type}</b><br>" +
             "Detected at {publish_date} (version {map_version})<br>" +
             "{expression/size_marker}: {edge_length_or_diameter} m<br>",
    expressionInfos: [{
          name: "speed-units",
          title: "Speed units",
          expression: "When(($feature.sign_type >= 0 && $feature.sign_type <= 13) || ($feature.sign_type >= 28 && $feature.sign_type <= 41), ' KM/h speed limit', '')"
    } ,
    {
      name: "size_marker",
      title: "Size marker",
      expression: "When ($feature.landmark_type == 1, 'Diameter', 'Edge size')"
    },
    {
      name: "landmark_type",
      title: "Landmark type",
      expression: "When($feature.landmark_type == 2, ' (electronic)', '')"
    },
    {
      name: "title-expression",
      title: "Title Expression",
      expression: "When($feature.edge_length_or_diameter == 2, '<b>Missing<\b> Sign', $feature.edge_length_or_diameter == 1, '<b>New<\b> Sign',  'Sign information')"
    }]
  },
  viewConfig: { 
    center: [11.432656,48.194704],
    zoom: 12
  }
}

export default surveyConfig;