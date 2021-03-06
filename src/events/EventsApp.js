import React from 'react'
import { observer } from "mobx-react";
import { Layout, Menu, Drawer, Icon, Row, Col } from 'antd';
import LayerFilterIcon from 'calcite-ui-icons-react/LayersIcon';
import LocationsPanel from '../components/LocationsPanel';

import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import Store from './EventsStore';
import eventsConfig from './EventsConfig';
import LayerPanel from './LayerPanel';
import LocationsIcon from "calcite-ui-icons-react/LayerZoomToIcon";
import { Logo } from '../components/Logo';
import './Legend.css';
import EventTooltip from './EventsTooltip';
import { moveWidgetsWithPanel } from '../utils/ui';

const { Header, Content, Sider } = Layout;

const MenuFilterIcon = () => (
  <LayerFilterIcon size="18" filled/>
)
const MenuLocationsIcon = () => (
  <LocationsIcon size="18" filled/>
)

const PANEL_WIDTH = 300;

const EventsApp = observer(class App extends React.Component {

  state = {
    collapsed: true,
    loaded: false,
    navKey: "Layers"
  };

  constructor(props, context){
    super(props, context);
    this.mapViewRef = React.createRef();
    this.sliderRef = React.createRef();
    this.store = new Store(props.appState, eventsConfig);
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  onSelect = item => {
    const navKey = this.state.navKey === item.key
      ? null
      : item.key;
    this.setState({navKey});
  }

  onClose = () => {
    this.setState({
      navKey: null,
    });
  };

  componentDidMount = () => {

    const modulePromise = loadModules([
      'esri/widgets/Search',
      'esri/widgets/Legend',
      'esri/widgets/Expand'
    ], options);
    const loadPromise = this.store.load(this.mapViewRef.current);

    Promise.all([modulePromise, loadPromise])
      .then(([[Search, Legend, Expand], mapView]) => {
        this.view = mapView;
        const search = new Search({view: this.view});

        const searchExpand = new Expand({
          view: this.view,
          content: search,
          expandIconClass: 'esri-icon-search'
        })

        const legend = new Legend({
          view: this.view, 
          layerInfos: this.store.legendLayerInfos,
          style: 'card',
          layout: 'stack',
        });
        this.view.ui.add(searchExpand, "top-right");
        this.view.ui.add(legend, "bottom-right");
        this.view.ui.move("zoom", "bottom-left");
        moveWidgetsWithPanel(this.view, this.state.navKey ? PANEL_WIDTH : 0);
      });
  }

  render() {
    let panel;
    switch (this.state.navKey) {
      case 'Layers':
        panel = <LayerPanel store={this.store}/>;
        break;
      case 'Locations':
        panel = <LocationsPanel store={this.store}/>
        break;
      default:
        panel = null;
    }

    if (this.view) {
      moveWidgetsWithPanel(this.view, panel ? PANEL_WIDTH : 0);
    }

    const signin = this.props.appState.displayName
      ? (
        <Menu
          mode="horizontal"
          style={{ lineHeight: '64px', float: "right" }}
        >
          <Menu.Item key="sign in">{this.props.appState.displayName}</Menu.Item>
        </Menu>
      )
      : null;

    const tooltip = this.store.hasCustomTooltip
      ? <EventTooltip store={this.store}/>
      : null;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <Logo />
          <Menu
            defaultSelectedKeys={['0']}
            mode="inline"
            theme="dark"
            selectedKeys={[this.state.navKey]}
            onClick={this.onSelect}>
            <Menu.Item key="Layers">
              <Icon component={MenuFilterIcon} />
              <span>Layers</span>
            </Menu.Item>
            <Menu.Item key="Locations">
              <Icon component={MenuLocationsIcon} />
              <span>Locations</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{paddingLeft: "1rem", paddingRight: "0rem", background: "white"}}>
            <h1 style={{float: "left"}}>Live Traffic</h1>
            {signin}
          </Header>
          <Content>
            <Row>
              <Col span={24} style={{height: "calc(100vh - 64px)"}}>
              <div
                style={{ position: 'absolute', left: '30%', right: '15px', bottom: '30px'}}
                ref={this.sliderRef}
              />
              <div
                ref={this.mapViewRef}
                style={{width: "100%", height: "100%"}}
              />
              {tooltip}
              <Drawer
                // title={this.state.navKey}
                closable={false}
                // onClose={this.onClose}
                placement="left"
                visible={this.state.navKey}
                mask={false}
                getContainer={false}
                style={{ position: 'absolute', background: "#f5f5f5"}}
                bodyStyle={{ padding: "10px", background: "#f5f5f5", height: "100%" }}
                width={PANEL_WIDTH}
              >
                {panel}
              </Drawer>
            </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
});

export default EventsApp;