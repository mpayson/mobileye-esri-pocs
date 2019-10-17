import React from 'react'
import { observer } from "mobx-react";
import { Layout, Menu, Drawer, Icon, Row, Col } from 'antd';
import LayerFilterIcon from 'calcite-ui-icons-react/LayersIcon';
import BookmarkIcon from 'calcite-ui-icons-react/BookmarkIcon';
import InformationIcon from 'calcite-ui-icons-react/InformationIcon';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import FilterPanel from '../components/FilterPanel';
import Store from '../stores/Store';
import eventsConfig from './EventsConfig';

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
      'esri/widgets/TimeSlider'

    ], options);
    const loadPromise = this.store.load(this.mapViewRef.current);

    Promise.all([modulePromise, loadPromise])
      .then(([[Search, Legend, TimeSlider], mapView]) => {
        this.view = mapView;
        const search = new Search({view: this.view});
        const legend = new Legend({view: this.view, layerInfos: [{layer: this.store.lyr, title: ""}]});

        // create a new time slider widget
        // set other properties when the layer view is loaded
        // by default timeSlider.mode is "time-window" - shows
        // data falls within time range
        const timeSlider = new TimeSlider({
          container: "timeSlider",
          mode: "time-window",
          view: this.view,
          loop: false

        });

        // const timeSlider = new TimeSlider({
        //   container: "timeSlider",
        //   playRate: 50,
        //   stops: {
        //     interval: {
        //       value: 1,
        //       unit: "hours"
        //     }
        //   }
        // });
        this.timeSlider = timeSlider;
        //timeSlider.values = [new Date(2019, 1, 1), new Date(2020, 1, 1)];
        this.view.ui.add(timeSlider, "top-right");
        this.view.ui.add(search, "top-right");
        this.view.ui.add(legend, "bottom-right");
        this.view.ui.move("zoom", "top-right");
      });
  }

  render() {
    let panel;
    switch (this.state.navKey) {
      case 'Layers':
        panel = <FilterPanel store={this.store}/>;
        break;
      case 'Bookmarks':
        panel = <h1>Woah this are some awesome bookmarks!</h1>;
        break;
      case 'About':
        panel = <h1>This is a slick app! Thanks Max!</h1>;
        break;
      default:
        panel = null;
    }

    // Init Time Slider
    if (this.store.layerLoaded){
      const fullTimeExtent = this.store.lyr.timeInfo.fullTimeExtent;

      // set up time slider properties
      this.timeSlider.fullTimeExtent = fullTimeExtent;
      // this.timeSlider.stops = {
      //   interval: this.store.lyr.timeInfo.interval
      // };
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

export default EventsApp;