import React from 'react'
import { BrowserRouter as Router, BrowserRouter, Route, Link } from "react-router-dom";
import { Row, Col, Card, Layout, Button, Divider } from 'antd';
import MapImage from './resources/images/map.png';
import SafetyApp from './safety/SafetyApp';
import EventsApp from './events/EventsApp';
import SurveyApp from './survey/SurveyApp';
import {
  UserSession
} from "@esri/arcgis-rest-auth";
import config from './config/config';

const { Content } = Layout;
const { appId, portalUrl } = config;

// TODO, see if faster way to accept callback without loading whole app
const OAuth = _ => {
  UserSession.completeOAuth2({
    clientId: appId,
  });
  return(
    <div/>
  )
}

class Home extends React.Component{

  state = {
    session: null
  }

  onLoginClick = () => {
    UserSession.beginOAuth2({
      clientId: appId,
      redirectUri: `${window.location.origin}${window.location.pathname}oauth`,
      popup: true
    }).then(newSession => {
      this.setState({
        session: newSession
      })
    })
    .catch(error => {
      console.log(error);
    });
  }

  render(){

    let topComponent = this.state.session
      ? <h1>Hello <b>{this.state.session.username}</b>, welcome to our demos!</h1>
      : <Button type="primary" size="large" onClick={this.onLoginClick}>Log in to get started</Button>;

    return(
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '50px 50px'}}>
          <Row type="flex" justify="space-around" align="middle">
            <Col style={{textAlign: 'center'}}>
              {topComponent}
            </Col>
          </Row>
          <Divider/>
          <Row type="flex" justify="space-around" align="middle">
            <Col span={3}/>
            <Col span={4}>
              <Card
              cover={<img alt="example" src={MapImage} />}>
                <Link to="/safety" className="ant-btn ant-btn-primary ant-btn-background-ghost ant-btn-block ant-btn ant-btn-lg">Explore Safety</Link>
              </Card>
            </Col>
            <Col span={4}>
              <Card
              cover={<img alt="example" src={MapImage}/>}>
                <Link to="/events" className="ant-btn ant-btn-primary ant-btn-background-ghost ant-btn-block ant-btn ant-btn-lg">Explore Events</Link>
              </Card>
            </Col>
            <Col span={4}>
              <Card
              cover={<img alt="example" src={MapImage} />}>
                <Link to="/survey" className="ant-btn ant-btn-primary ant-btn-background-ghost ant-btn-block ant-btn ant-btn-lg">Explore Survey</Link>
              </Card>
            </Col>
            <Col span={3}/>
          </Row>
        </Content>
      </Layout>
    )
  }
}

function App() {

  // Need to use browser router if in OAuth callback
  // Otherwise return the full app
  if(window.location.hash.includes("access_token=")){
    return (
      <BrowserRouter>
        <Route path="/oauth" exact component={OAuth} />
      </BrowserRouter>
    )
  }

  return (
    <Router>
      <Route path="/" exact component={Home}/>
      <Route path="/safety" component={SafetyApp} />
      <Route path="/events" component={EventsApp} />
      <Route path="/survey" component={SurveyApp} />
    </Router>
  )
}

export default App;