import React from 'react'
import { observer } from "mobx-react";
import { Layout, Menu, Drawer, Icon, Row, Col, Card, Button } from 'antd';

import MobileyeLogo from '../resources/Basic_Web_White_Logo.png';

const { Header, Content, Sider } = Layout;

const AppShell = observer(class App extends React.Component {

  state = {
    collapsed: true
  };

  constructor(props, context){
    super(props, context);
    this.mapViewRef = React.createRef();
    this.store = props.store;
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  onSelect = item => {
    const navKey = this.props.navKey === item.key
      ? null
      : item.key;
    this.props.onNavKeyChange(navKey);
    if(!this.store.autoplay) this.store.clearBookmark();
  }

  onClose = () => {
    this.props.onNavKeyChange(null);
    if(!this.store.autoplay) this.store.clearBookmark();
  };

  onSignOutClick = () => {
    if(!this.store.autoplay) this.store.clearBookmark();
    this.props.appState.logout();
  }

  clearBookmark = () => {
    this.store.clearBookmark();
    if(this.store.autoplay) this.store.stopAutoplayBookmarks();
  }

  componentWillUnmount(){
    // this is throwing errors, need to figure out why
    // for now memory leak when switching apps but shouldn't be big issue
    // if(this.view){
    //   this.view.container = null;
    //   delete this.view;
    // }
  }

  componentDidMount = () => {
    this.store.load(this.mapViewRef.current)
      .then(mapView => {
        if(this.props.onMapViewLoad){
          this.props.onMapViewLoad(mapView);
        }
      })
  }

  render() {

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
      
    const tooltip = this.store.hasCustomTooltip && this.props.tooltip
      ? this.props.tooltip
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

    console.log(this.props.children.map(c => c.type.isMenuItem));

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <img
            src={MobileyeLogo}
            alt="Mobileye Logo"
            style={{height: "40px", margin: "12px"}}
            />
          <Menu
            defaultSelectedKeys={['0']}
            mode="inline"
            theme="dark"
            selectedKeys={[this.props.navKey]}
            onClick={this.onSelect}>
            {this.props.children}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{paddingLeft: "1rem", paddingRight: "0rem", background: "white"}}>
            {this.props.title}
            {signin}
          </Header>
          <Content>
            <Row>
              <Col
                span={24}
                style={{height: "calc(100vh - 64px)"}}>
              <div
                ref={this.mapViewRef}
                style={{width: "100%", height: "100%", background: '#373938'}}/>
              {tooltip}
              {bookmarkCard}
              <Drawer
                title={this.props.navKey}
                closable={true}
                onClose={this.onClose}
                placement="left"
                visible={this.props.navKey}
                mask={false}
                width={340}
                getContainer={false}
                style={{ position: 'absolute', background: "#f5f5f5", height: "calc(100% - 15px)"}}
                bodyStyle={{ padding: "10px", background: "#f5f5f5", minHeight: "calc(100% - 55px)"}}
              >
                {this.props.panel}
              </Drawer>
            </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    );
  }
});

export default AppShell;