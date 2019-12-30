import React from 'react'
import { observer } from "mobx-react";
import AppShell from '../components/AppShell';
import {Menu, Icon} from 'antd';
import {
  addLegendWidget
} from '../services/MapService';

import LayerFilterIcon from 'calcite-ui-icons-react/LayersIcon';
import BookmarkIcon from 'calcite-ui-icons-react/BookmarkIcon';
import RouteFromIcon from 'calcite-ui-icons-react/RouteFromIcon';
import LocationsPanel from '../components/LocationsPanel';
import LayerPanel from './LayerPanel';
import RoutePanel from './RoutePanel';
import SafetyStore from './SafetyStore';
import safetyConfig from './SafetyConfig';
import BookmarkPanel from '../components/BookmarkPanel';
import SafetyTooltip from './SafetyTooltip';
import LocationsIcon from 'calcite-ui-icons-react/LayerZoomToIcon';

const MenuFilterIcon = () => (
  <LayerFilterIcon size="18" filled/>
)
const MenuBookmarkIcon = () => (
  <BookmarkIcon size="18" filled/>
)
const MenuRouteFromIcon = () => (
  <RouteFromIcon size="20" filled/>
)
const MenuLocationsIcon = () => (
  <LocationsIcon size="18" filled/>
)

function humanize(number) {
    if(number % 100 >= 11 && number % 100 <= 13)
        return number + "th";

    switch(number % 10) {
        case 1: return number + "st";
        case 2: return number + "nd";
        case 3: return number + "rd";
        default: return number + "th";
    }
}


const TestApp = observer(class TestApp extends React.Component {

  constructor(props, context){
    super(props, context);
    this.store = new SafetyStore(props.appState, safetyConfig);
    var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var today = new Date();
    this.today_str = months[today.getMonth()] + humanize(today.getDate());
  }

  componentWillUnmount(){
    this.store.destroy();
  }

  onMapViewLoad = mapView => {
    this.view = mapView;
    addLegendWidget(this.view, 'bottom-right', {
      layerInfos: [{layer: this.store.lyr, title: ""}]
    });
  }

  getPanelForNavkey = navKey => {
    switch(navKey){
      case 'Data Layers':
        return <LayerPanel store={this.store}/>;
      case 'Saved Locations':
        return <BookmarkPanel store={this.store}/>
      case 'Route':
        return <RoutePanel store={this.store}/>
      case 'Locations':
        return <LocationsPanel store={this.store}/>
      default:
        return null;
    }
  }

  render() {

    return (
      <AppShell
        appState={this.props.appState}
        store={this.store}
        onMapViewLoad={this.onMapViewLoad}
        getPanel={this.getPanelForNavkey}
        title={
          <>
            <h1 style={{float: "left"}}>Road Risk Score&nbsp;&nbsp;  </h1>
            <div style={{float: "left"}}> (Data presented from Sep 1st - {this.today_str})</div>
          </>
        }
        tooltip={<SafetyTooltip store={this.store}/>}>
        <Menu.Item key="Data Layers">
          <Icon component={MenuFilterIcon} />
          <span>Data Layers</span>
        </Menu.Item>
        <Menu.Item key="Locations">
          <Icon component={MenuLocationsIcon} />
          <span>Locations</span>
        </Menu.Item>
        <Menu.Item key="Route">
          <Icon component={MenuRouteFromIcon} />
          <span>Route</span>
        </Menu.Item>
        <Menu.Item key="Saved Locations">
          <Icon component={MenuBookmarkIcon} />
          <span>Saved Locations</span>
        </Menu.Item>
      </AppShell>
    );
  }
});

export default TestApp;