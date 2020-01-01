import React from 'react'
import { observer } from "mobx-react";
import {Layout, Menu, Drawer, Icon, Row, Col, Card, Button} from 'antd';
import LayerFilterIcon from 'calcite-ui-icons-react/LayersIcon';
import BookmarkIcon from 'calcite-ui-icons-react/BookmarkIcon';
import LocationsPanel from '../components/LocationsPanel';

import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import Store from './HumanMobilityStore';
import humanMobilityConfig from './HumanMobilityConfig';
import HumanMobilityTooltip from './HumanMobilityTooltip';

import LayerPanel from './LayerPanel';
import LocationsIcon from "calcite-ui-icons-react/LayerZoomToIcon";
import BookmarkPanel from "../components/BookmarkPanel";
import MinMaxSlideFilter from "../components/filters/MinMaxSlideFilter";

const { Header, Content, Sider } = Layout;

const MenuFilterIcon = () => (
  <LayerFilterIcon size="18" filled/>
)
const MenuBookmarkIcon = () => (
  <BookmarkIcon size="18" filled/>
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
      .then(([[Search, Legend, Expand], mapView]) => {
        this.view = mapView;
        const search = new Search({view: this.view});

        const searchExpand = new Expand({
          view: this.view,
          content: search,
          expandIconClass: 'esri-icon-search'
        });

        const layerInfos = this.store.mapLayers.filter((l,index) => this.store._getLayerConigById(index).showLegend)
            .map((layer, index) => ({layer:layer, title:  this.store._getLayerConigById(index).customLegendTitle?
                  this.store._getLayerConigById(index).customLegendTitle:""}));
        layerInfos.forEach(l=>console.log(l.layer));
        const legend = new Legend({view: this.view, layerInfos: layerInfos});
        //this.view.ui.add(slider, "bottom-right");

        this.view.ui.add(searchExpand, "top-right");
        this.view.ui.add(legend, "bottom-right");
        this.view.ui.move("zoom", "top-right");

      });
  }

  _onHoursForwardButtonClick = (event) => {
    if (this.hourFilter.max !== 24) {
      this.hourFilter.max = this.hourFilter.max + this.hourFilter.step;
      this.hourFilter.min = this.hourFilter.min + this.hourFilter.step;
    }
  }

  _onHoursBackwardsButtonClick = (event) => {
    if (this.hourFilter.min !== 0) {
      this.hourFilter.min = this.hourFilter.min - this.hourFilter.step;
      this.hourFilter.max = this.hourFilter.max - this.hourFilter.step;
    }
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

    const tooltip = this.store.hasCustomTooltip
      ? <HumanMobilityTooltip store={this.store}/>
      : null;

    this.hourFilter = this.store.filters.find(f => f.field === 'agg_hour');
    const hoursSlider = <MinMaxSlideFilter store={this.hourFilter} key={this.hourFilter.field} lowerBoundLabel={this.hourFilter.lowerBoundLabel} upperBoundLabel={this.hourFilter.upperBoundLabel}/>
    const hoursSliderStyle = {
      display: 'bloc',
      position: "absolute",
      width: "600px",
      height: 'auto',
      overflow: 'auto',
      bottom: "30px",
      left: "50%",
      marginLeft: "-300px",
    }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{paddingLeft: "1rem", paddingRight: "0rem"}}>
          <h1 style={{color: "rgba(255,255,255,0.8)", float: "left"}}>Mobility</h1>
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
              {tooltip}
              <Card className="antd-esri-widget" style={hoursSliderStyle} size="small" title={`Hours of the day:`}>
                 <Row gutter={16}>
                 <Col span={3}>
                <Button id="forward" onClick={this._onHoursBackwardsButtonClick} type="primary">
                  <Icon type="left" />
                </Button>
                </Col>
                <Col span={18}>
                {hoursSlider}
                </Col>
                <Col span={3}>
                <Button id="backwards" onClick={this._onHoursForwardButtonClick} type="primary">
                  <Icon type="right" />
                </Button>
                </Col>
                </Row>
              </Card>
              <Drawer
                // title={this.state.navKey}
                closable={false}
                // onClose={this.onClose}
                placement="left"
                visible={this.state.navKey}
                width={300}
                mask={false}
                getContainer={false}
                style={{ position: 'absolute', background: "#f5f5f5"}}
                bodyStyle={{ padding: "10px", background: "#f5f5f5",height: "100%" }}
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