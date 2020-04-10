import React from 'react';
import { observer } from "mobx-react";
import { Layout, Menu, Drawer, Icon, Row, Col , Card} from 'antd';
import LayerFilterIcon from 'calcite-ui-icons-react/LayersIcon';
import GlobeIcon from 'calcite-ui-icons-react/GlobeIcon';
import GraphHistogramIcon from 'calcite-ui-icons-react/GraphHistogramIcon';
import BookmarkIcon from 'calcite-ui-icons-react/BookmarkIcon';
import InformationIcon from 'calcite-ui-icons-react/InformationIcon';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import FilterPanel from '../components/FilterPanel';
import ChartPanel from '../components/ChartPanel';
// import LayerListPanel from '../components/LayerListPanel';
import BookmarkPanel from '../components/BookmarkPanel';
import Store from './SurveyStore';
import surveyConfig from './SurveyConfig';
import LocationsPanel from '../components/LocationsPanel';
import { Logo } from '../components/Logo';
import { Tooltip } from '../components/details/Tooltip';
import { moveWidgetsWithPanel } from '../utils/ui';
import { SurveyDetailsPanel } from './SurveyDetailsPanel';
import { SurveyHoverHint } from './SurveyHoverHint';


const { Header, Content, Sider } = Layout;

const MenuFilterIcon = () => (
  <LayerFilterIcon size="18" filled/>
)
const MenuLocationsIcon = () => (
  <GlobeIcon size="18" filled/>
)
const MenuHistogramIcon = () => (
  <GraphHistogramIcon size="18" filled/>
)
const MenuBookmarkIcon = () => (
  <BookmarkIcon size="18" filled/>
)
const MenuInformationIcon = () => (
  <InformationIcon size="17" filled/>
)

const LEFT_PANEL_WIDTH = 320;

const SurveyApp = observer(class App extends React.Component {

  state = {
    collapsed: true,
    loaded: false,
    navKey: null,
    detailsOpen: false,
  };

  constructor(props, context){
    super(props, context);
    this.mapViewRef = React.createRef();
    this.store = new Store(props.appState, surveyConfig);
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
      'esri/widgets/Home',
      'esri/widgets/Expand'
    ], options);
    const loadPromise = this.store.load(this.mapViewRef.current);

    Promise.all([modulePromise, loadPromise]) 
      .then(([[Search, Legend, Home, Expand], mapView]) => {
        this.view = mapView;
        const search = new Search({view: this.view});
        const searchExpand = new Expand({
          view: this.view,
          content: search,
          expandIconClass: 'esri-icon-search'
        })
        this.view.ui.add(searchExpand, "top-left");
        this.view.ui.move("zoom", "bottom-left");
        moveWidgetsWithPanel(this.view, this.state.navKey ? LEFT_PANEL_WIDTH : 0);
        this.forceUpdate();
      });
  }

  onDetailsOpen = open => {
    this.setState({detailsOpen: open})
  };

  render() {
    let panel;
    switch(this.state.navKey){
      case 'Locations':
        panel = <LocationsPanel store={this.store}/>
        break;
      case 'Filters':
        panel = <FilterPanel store={this.store} defaultActive={true}/>
        break;
      case 'Histograms':
        panel = <ChartPanel store={this.store}/>
        break;
      case 'Saved Locations':
        panel = <BookmarkPanel store={this.store}/>
        break;
      case 'About':
        panel = <h1>Mapping road assets such as traffic lights, signs, poles, and more. For each asset, we can detail its precise location, dimensions and type, and information on detected changes.</h1>;
        break;
      default:
        panel = null;
    }

    if (this.view) {
      moveWidgetsWithPanel(this.view, panel ? LEFT_PANEL_WIDTH : 0);
    }

    const signin = this.props.appState.displayName
      ? (
        <Menu
          //theme="dark"
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
          size="small">
          {this.store.bookmarkInfo.content}
        </Card>
      )
    }

    const leftPanelWidth = LEFT_PANEL_WIDTH;
    const rightPanelWidth = 260;

    const mapAreaWidth = window.innerWidth - 80;
    const xMin = this.state.navKey ? leftPanelWidth : 0; 
    const xMax = this.state.detailsOpen ? (mapAreaWidth - rightPanelWidth) : mapAreaWidth;

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
            <Menu.Item key="Locations">
              <Icon component={MenuLocationsIcon} />
              <span>Locations</span>
            </Menu.Item>
            <Menu.Item key="Filters">
              <Icon component={MenuFilterIcon} />
              <span>Filters</span>
            </Menu.Item>
            <Menu.Item key="Histograms">
              <Icon component={MenuHistogramIcon} />
              <span>Histograms</span>
            </Menu.Item>
            <Menu.Item key="Saved Locations">
              <Icon component={MenuBookmarkIcon} />
              <span>Saved Locations</span>
            </Menu.Item>
            <Menu.Item key="About">
              <Icon component={MenuInformationIcon} />
              <span>About</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{paddingLeft: "1rem", paddingRight: "0rem", background: "white"}}>
            <h1 style={{float: "left"}}>Road Asset Survey</h1>
            {signin}
          </Header>
          <Content>
            <Row>
              <Col
                span={24}
                style={{height: "calc(100vh - 64px)"}}
              >
              <div
                ref={this.mapViewRef}
                style={{width: "100%", height: "100%"}}
              />
              <SurveyDetailsPanel 
                store={this.store} 
                onOpen={this.onDetailsOpen} 
                width={rightPanelWidth} 
              />
              <Tooltip store={this.store} xMin={xMin} xMax={xMax}>
                <SurveyHoverHint store={this.store} />
              </Tooltip>
              {bookmarkCard}
              <Drawer
                title={this.state.navKey}
                closable={true}
                onClose={this.onClose}
                placement="left"
                visible={this.state.navKey}
                mask={false}
                width={LEFT_PANEL_WIDTH}
                getContainer={false}
                style={{ position: 'absolute', background: "#f5f5f5", height: "calc(100% - 15px)"}}
                bodyStyle={{ padding: "10px", background: "#f5f5f5", height: "100%"}}
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


export default SurveyApp;