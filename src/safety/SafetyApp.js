import React from 'react'
import { observer } from "mobx-react";
import { Layout, Menu, Drawer, Icon, Row, Col, Card, Button } from 'antd';
import {addSearchWidget} from '../services/MapService';

import LayerFilterIcon from 'calcite-ui-icons-react/LayersIcon';
import BookmarkIcon from 'calcite-ui-icons-react/BookmarkIcon';
import RouteFromIcon from 'calcite-ui-icons-react/RouteFromIcon';
import LocationsPanel from '../components/LocationsPanel';
import LayerPanel from './LayerPanel';
import RoutePanel from './RoutePanel';
import SafetyStore from './SafetyStore';
import safetyConfig from './SafetyConfig';
import BookmarkPanel from '../components/BookmarkPanel';
import LocationsIcon from 'calcite-ui-icons-react/LayerZoomToIcon';
import { Logo } from '../components/Logo';
import { moveWidgetsWithPanel } from '../utils/ui';
import { SafetyInfoPanel } from './SafetyInfoPanel';
import { SafetyHoverHint, Tooltip } from './SafetyHoverHint';

const { Header, Content, Sider } = Layout;

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

const PANEL_WIDTH = 340;

const SafetyApp = observer(class App extends React.Component {

  state = {
    collapsed: true,
    loaded: false,
    navKey: null,
    detailsOpen: false,
  };

  constructor(props, context){
    super(props, context);
    this.mapViewRef = React.createRef();
    this.store = new SafetyStore(props.appState, safetyConfig);
    var months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var today = new Date();

    this.today_str = months[today.getMonth()] + humanize(today.getDate());
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  onSelect = item => {
    const navKey = this.state.navKey === item.key
      ? null
      : item.key;
    this.setState({navKey});
    if(!this.store.autoplay) this.store.clearBookmark();
  }

  onClose = () => {
    this.setState({
      navKey: null,
    });
    if(!this.store.autoplay) this.store.clearBookmark();
  };

  onSignOutClick = () => {
    this.props.appState.logout();
  }

  componentWillUnmount(){
    this.store.destroy();
    // this is throwing errors, need to figure out why
    // for now memory leak when switching apps but shouldn't be big issue
    // if(this.view){
    //   this.view.container = null;
    //   delete this.view;
    // }
  }

  clearBookmark = () => {
    this.store.clearBookmark();
    if(this.store.autoplay) this.store.stopAutoplayBookmarks();
  }

  componentDidMount = () => {

    this.store.load(this.mapViewRef.current)
      .then(mapView => {
        this.view = mapView;
        addSearchWidget(this.view, 'top-left', 0, true);
        // addLegendWidget(this.view, 'bottom-right', {
        //   layerInfos: [{layer: this.store.lyr, title: ""}]
        // });
        moveWidgetsWithPanel(this.view, this.state.navKey ? PANEL_WIDTH : 0);
        this.forceUpdate();
      })
  }

  onDetailsOpen = open => {
    console.log(open);
    this.setState({detailsOpen: open})
  };

  render() {

    let panel;
    switch(this.state.navKey){
      case 'Data Layers':
        panel = <LayerPanel store={this.store}/>;
        break;
      case 'Saved Locations':
        panel = <BookmarkPanel store={this.store}/>
        break;
      case 'Route':
        panel = <RoutePanel store={this.store}/>
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
          // theme="dark"
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
    
    let bookmarkCard;
    if(this.store.bookmarkInfo){
      bookmarkCard = (
        <Card
          title={this.store.bookmarkInfo.title}
          className="antd-esri-widget"
          style={{
            position: "absolute",
            bottom: "30px",
            width: "400px",
            left: "50%",
            marginLeft: "-200px",
          }}
          size="small"
          extra={<Button type="link" onClick={this.clearBookmark}>X</Button>}
          >
          {this.store.bookmarkInfo.content}
        </Card>
      )
    }
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
          </Menu>
        </Sider>
        <Layout>
          <Header style={{paddingLeft: "1rem", paddingRight: "0rem", background: "white"}}>
            <h1 style={{float: "left"}}>Road Risk Score&nbsp;&nbsp;  </h1>
            {signin}
          </Header>
          <Content>
            <Row>
              <Col span={24} style={{height: "calc(100vh - 64px)"}}>
                <div
                  ref={this.mapViewRef}
                  style={{width: "100%", height: "100%", background: '#1E2224'}}
                >
                </div>
                <Tooltip 
                  store={this.store} 
                  xMin={this.state.navKey ? 340 : 0} 
                  xMax={this.state.detailsOpen ? window.innerWidth - 340 : window.innerWidth - 80}
                >
                  <SafetyHoverHint store={this.store} width={260} />
                </Tooltip>
                <SafetyInfoPanel 
                  store={this.store} 
                  onMountOpen={true}
                  onOpen={this.onDetailsOpen}
                />
                {bookmarkCard}
                <Drawer
                  title={this.state.navKey}
                  closable={true}
                  onClose={this.onClose}
                  placement="left"
                  visible={this.state.navKey}
                  mask={false}
                  width={340}
                  getContainer={false}
                  style={{ position: 'absolute', background: "#f5f5f5", height: "calc(100% - 15px)"}}
                  bodyStyle={{ padding: "10px", background: "#f5f5f5", minHeight: "calc(100% - 55px)"}}
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

export default SafetyApp;