import React from 'react'
import { observer } from "mobx-react";
import { Layout, Menu, Drawer, Icon, Row, Col } from 'antd';
import LayerFilterIcon from 'calcite-ui-icons-react/LayersIcon';
import BookmarkIcon from 'calcite-ui-icons-react/BookmarkIcon';
import InformationIcon from 'calcite-ui-icons-react/InformationIcon';
import LocationsPanel from '../components/LocationsPanel';

import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import Store from '../stores/Store';
import humanMobilityConfig from './HumanMobilityConfig';
import LayerPanel from './LayerPanel';
import LocationsIcon from "calcite-ui-icons-react/LayerZoomToIcon";
import BookmarkPanel from "../components/BookmarkPanel";

const { Header, Content, Sider } = Layout;

const MenuFilterIcon = () => (
  <LayerFilterIcon size="18" filled/>
)
const MenuBookmarkIcon = () => (
  <BookmarkIcon size="18" filled/>
)
const MenuInformationIcon = () => (
  <InformationIcon size="17" filled/>
)
const MenuLocationsIcon = () => (
  <LocationsIcon size="18" filled/>
)

const HumanMobilityApp = observer(class App extends React.Component {

  state = {
    collapsed: true,
    loaded: false,
    navKey: "Layers"
  };

  constructor(props, context){
    super(props, context);
    this.mapViewRef = React.createRef();
    this.sliderRef = React.createRef();
    this.store = new Store(props.appState, humanMobilityConfig);
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
      'esri/widgets/Expand',
      "esri/widgets/Slider"
    ], options);
    const loadPromise = this.store.load(this.mapViewRef.current);

    Promise.all([modulePromise, loadPromise])
      .then(([[Search, Legend, Expand, Slider], mapView]) => {
        this.view = mapView;
        const search = new Search({view: this.view});

        const searchExpand = new Expand({
          view: this.view,
          content: search,
          expandIconClass: 'esri-icon-search'
        });

        const slider = new Slider({
          
          labelsVisible: true,
          labelInputsEnabled: false,
          rangeLabelsVisible: true,
          rangeLabelInputsEnabled: false,
          layout: "horizontal",  // vertical
          min: 0,
          max: 23,
          values: [3, 5],
          precision: 1,
          tickConfigs: [{
            mode: "count",
            values: 24,
            labelsVisible: true
          }],
          steps: 1,
          container: "sliderDiv"
        });
      
        
        const legend = new Legend({view: this.view, layerInfos: [{layer: this.store.lyr, title: ""}]});
        //this.view.ui.add(slider, "bottom-right");

        this.view.ui.add(searchExpand, "top-right");
        this.view.ui.add(legend, "bottom-right");

        this.view.ui.move("zoom", "top-right");

      });
  }

  render() {
    let panel;
    switch (this.state.navKey) {
      case 'Layers':
        panel = <LayerPanel store={this.store}/>;
        break;
      case 'Bookmarks':
        panel = <BookmarkPanel store={this.store}/>
        break;
      case 'Locations':
        panel = <LocationsPanel store={this.store}/>
        break;
      case 'About':
        panel = <h1>This is a slick app! Thanks Max!</h1>;
        break;
      default:
        panel = null;
    }

    // Init Time Slider
    if (this.store.layerLoaded){
      // set up time slider properties
    }


    const signin = this.props.appState.displayName
      ? (
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px', float: "right" }}
        >
          <Menu.Item key="sign in">{this.props.appState.displayName}</Menu.Item>
        </Menu>
      )
      : null;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{paddingLeft: "1rem", paddingRight: "0rem"}}>
          <h1 style={{color: "rgba(255,255,255,0.8", float: "left"}}>Mobileye City Lab</h1>
          {signin}
        </Header>
        <Layout>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
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
              <Menu.Item key="Bookmarks">
                <Icon component={MenuBookmarkIcon} />
                <span>Bookmarks</span>
              </Menu.Item>
              <Menu.Item key="Locations">
                <Icon component={MenuLocationsIcon} />
                <span>Locations</span>
              </Menu.Item>
              <Menu.Item key="About">
                <Icon component={MenuInformationIcon} />
                <span>About</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Content>
            <Row>
              <Col
                span={24}
                style={{height: "calc(100vh - 64px)"}}>
              <div
                style={{ position: 'absolute', left: '30%', right: '15px', bottom: '30px'}}
                ref={this.sliderRef}/>
              <div
                ref={this.mapViewRef}
                style={{width: "100%", height: "100%"}}/>
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

export default HumanMobilityApp;