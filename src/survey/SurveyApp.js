import React from 'react';
import { observer } from "mobx-react";
import { Layout, Menu, Drawer, Icon, Row, Col } from 'antd';
import LayerFilterIcon from 'calcite-ui-icons-react/LayersIcon';
import BookmarkIcon from 'calcite-ui-icons-react/BookmarkIcon';
import InformationIcon from 'calcite-ui-icons-react/InformationIcon';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import LayerPanel from './LayerPanel';
import Store from '../stores/Store';
import surveyConfig from './SurveyConfig';

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

const SurveyApp = observer(class App extends React.Component {

  state = {
    collapsed: true,
    loaded: false,
    navKey: "Layers"
  };

  constructor(props, context){
    super(props, context);
    this.mapViewRef = React.createRef();
    this.store = new Store(surveyConfig);
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
      //'esri/widgets/Legend'
    ], options);
    const loadPromise = this.store.load(this.mapViewRef.current);

    Promise.all([modulePromise, loadPromise])
      .then(([[Search, Legend], mapView]) => {
        this.view = mapView;
        const search = new Search({view: this.view});
        this.view.ui.add(search, "top-right");
        //const legend = new Legend({view: this.view});
        //this.view.ui.add(legend, "bottom-right");
        this.view.ui.move("zoom", "top-right");
      });
  }

  render() {
    let panel;
    switch(this.state.navKey){
      case 'Layers':
        panel = <LayerPanel store={this.store} map={this.map} layer={this.lyr} layerView={this.lyrView}/>;
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

    const signin = this.store.user
      ? (
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px', float: "right" }}
        >
          <Menu.Item key="sign in">{this.store.user}</Menu.Item>
        </Menu>
      )
      : null;

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{paddingLeft: "1rem", paddingRight: "0rem"}}>
          <h1 style={{color: "rgba(255,255,255,0.8", float: "left"}}>Sign Survey</h1>
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
                style={{ position: 'absolute', background: "#f5f5f5", height: "calc(100%-40px)"}}
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


export default SurveyApp;