import React from 'react'
import { observer } from "mobx-react";
import {Layout, Menu, Drawer, Icon, Row, Col, Card, Button, Typography} from 'antd';
import LayerFilterIcon from 'calcite-ui-icons-react/LayersIcon';
import BookmarkIcon from 'calcite-ui-icons-react/BookmarkIcon';
import LocationsPanel from '../components/LocationsPanel';

import {
  addSearchWidget,
  addLegendWidget,
} from '../services/MapService';

import Store from './HumanMobilityStore';
import humanMobilityConfig from './HumanMobilityConfig';
import HumanMobilityTooltip from './HumanMobilityTooltip';

import LayerPanel from './LayerPanel';
import LocationsIcon from "calcite-ui-icons-react/LayerZoomToIcon";
import BookmarkPanel from "../components/BookmarkPanel";
import MinMaxSlideFilter from "../components/filters/MinMaxSlideFilter";
import { Logo } from '../components/Logo';
import { moveWidgetsWithPanel } from '../utils/ui';

const { Header, Content, Sider } = Layout;
const Title = Typography.Title;

const MenuFilterIcon = () => (
  <LayerFilterIcon size="18" filled/>
)
const MenuBookmarkIcon = () => (
  <BookmarkIcon size="18" filled/>
)
const MenuLocationsIcon = () => (
  <LocationsIcon size="18" filled/>
)

const PANEL_WIDTH = 300;

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
    this.hourFilter = this.store.hourFilter;
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

    this.store.load(this.mapViewRef.current)
      .then(mapView => {
        this.view = mapView;
        addSearchWidget(this.view, 'top-right', 0, true);
        const layerInfos = this.store.legendLayerInfos;
        addLegendWidget(this.view, 'bottom-right', {layerInfos});
        moveWidgetsWithPanel(this.view, this.state.navKey ? PANEL_WIDTH : 0);
      });
  }

  _onHoursForwardButtonClick = (event) => {
    this.hourFilter.increment();
  }

  _onHoursBackwardsButtonClick = (event) => {
    this.hourFilter.decrement();
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

    if (this.view) {
      moveWidgetsWithPanel(this.view, panel ? PANEL_WIDTH : 0);
    }

    const signin = this.props.appState.displayName
      ? (
        <Menu
          mode="horizontal"
          style={{ lineHeight: '64px', float: "right" }}
        >
          <Menu.Item key="sign in" onClick={this.onSignOutClick}>
            <Icon type="logout"/>
            {this.props.appState.displayName}
          </Menu.Item>
        </Menu>
      )
      : null;

    const tooltip = this.store.hasCustomTooltip
      ? <HumanMobilityTooltip store={this.store}/>
      : null;

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
    const hoursSliderBodyStyle = {
      paddingLeft: '4px', 
      paddingRight: '4px', 
      paddingBottom: '5px', 
      overflowX: 'hidden'
    }

    const autoIcon = this.store.hourAutoplay ? "pause" : "caret-right";

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <Logo/>
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
        <Layout>
          <Header style={{paddingLeft: "1rem", paddingRight: "0rem", background: "white"}}>
            <h1 style={{float: "left"}}>Dynamic Mobility Mapping</h1>
            {signin}
          </Header>
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
                style={{width: "100%", height: "100%", background: '#1E2224'}}/>
              {tooltip}
              <Card
                className="antd-esri-widget"
                style={hoursSliderStyle}
                bodyStyle={hoursSliderBodyStyle}
                size="small"
                title={`Time of day:`}
              >
                <Row gutter={16} type="flex" align="middle" justify="space-around">
                  <Col span={2}>
                    <Button 
                      id="forward" 
                      onClick={this._onHoursBackwardsButtonClick} 
                      type="primary" 
                      icon="left"
                      aria-label="Move timespan back 1 hour"
                    />
                  </Col>
                  <Col span={16}>
                    {hoursSlider}
                  </Col>
                  <Col span={4}>
                    <Button 
                      id="backwards" 
                      onClick={this._onHoursForwardButtonClick} 
                      type="primary" 
                      icon="right"
                      style={{marginRight: '16px'}}
                      aria-label="Move timespan forward 1 hour"
                    />
                    <Button 
                      id="autoplay" 
                      icon={autoIcon} 
                      onClick={this.store.toggleAutoplayTime} 
                      aria-label="Toggle auto-play" 
                    />
                  </Col>
                </Row>
              </Card>
              <Drawer
                // title={this.state.navKey}
                closable={false}
                // onClose={this.onClose}
                placement="left"
                visible={this.state.navKey}
                width={PANEL_WIDTH}
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