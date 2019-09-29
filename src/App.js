import React from 'react'
import { observer } from "mobx-react";
import { HashRouter as Router, BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import { Row, Col, Card, Layout, Button, Divider } from 'antd';
import AppState from './stores/AppState';
import MapImage from './resources/images/map.png';
import SafetyApp from './safety/SafetyApp';
import EventsApp from './events/EventsApp';
import SurveyApp from './survey/SurveyApp';
import {
  UserSession
} from "@esri/arcgis-rest-auth";
import config from './config/config';
import {loadScript} from 'esri-loader';
import options from './config/esri-loader-options';

const { Content } = Layout;
const { appId } = config;

// TODO, see if faster way to accept callback without loading whole app
const OAuth = _ => {
  UserSession.completeOAuth2({
    clientId: appId,
  });
  return(
    // <div/>
    <h1>HELLO WORLD THIS IS MY PAGE FOR HANDLING OAUTH!!!!</h1>
  )
}

const PrivateRoute = observer(({Component, appState, ...rest}) => (
  <Route
    {...rest}
    render={(props) => (
      appState.isAuthenticated === true
        ? <Component appState={appState} {...props}/>
        : <Redirect to={{
            pathname: '/',
            state: {from: props.location}
          }}/>
    )}/>
));

const Home = observer(class Home extends React.Component{
  
  componentDidMount(){
    loadScript(options);
  }

  render(){
    let appState = this.props.appState;

    let topComponent = appState.isAuthenticated
      ? <h1>Hello <b>{appState.displayName}</b>, welcome to our demos!</h1>
      : <Button type="primary" size="large" onClick={appState.login}>Log in to get started</Button>;

    const {from} = this.props.location.state || {from: null};
    if(appState.redirectToReferrer && from){
      return <Redirect to={from}/>
    }

    // Not good practice, should find a way to inject router Link into antd Button
    const linkClass = "ant-btn ant-btn-primary ant-btn-background-ghost ant-btn-block ant-btn ant-btn-lg";

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
            <Col md={{span: 0}} xl={{span: 2}}/>
            <Col md={{span: 6}} xl={{span: 4}}>
              <Card
              cover={<img alt="example" src={MapImage} />}>
                <Link
                  to="/safety"
                  className={linkClass}
                  disabled={!appState.isAuthenticated}>
                  Explore Safety
                </Link>
              </Card>
            </Col>
            <Col md={{span: 6}} xl={{span: 4}}>
              <Card
              cover={<img alt="example" src={MapImage}/>}>
                <Link
                  to="/events"
                  className={linkClass}
                  disabled={!appState.isAuthenticated}>
                  Explore Events
                </Link>
              </Card>
            </Col>
            <Col md={{span: 6}} xl={{span: 4}}>
              <Card
              cover={<img alt="example" src={MapImage} />}>
              <Link
                to="/survey"
                className={linkClass}
                disabled={!appState.isAuthenticated}>
                Explore Survey
              </Link>
              </Card>
            </Col>
            <Col md={{span: 0}} xl={{span: 2}}/>
          </Row>
        </Content>
      </Layout>
    )
  }
});


class App extends React.Component{

  constructor(props, context){
    super(props, context);
    const relativeRedirectUri = '';
    this.appState = new AppState({...config, relativeRedirectUri});
    console.log('v 0.0.0.4')
  }

  render(){
    if(window.location.hash.includes("access_token=")){
      return (
        <BrowserRouter>
          <Route path="/" component={OAuth} />
        </BrowserRouter>
      )
    }
    return(
      <Router>
        <Route
          path="/"
          exact
          render={props => <Home {...props} appState={this.appState}/>}/>
        <PrivateRoute
          path="/safety"
          appState={this.appState}
          Component={SafetyApp}/>
        <PrivateRoute
          path="/events"
          appState={this.appState}
          Component={EventsApp}/>
        <PrivateRoute
          path="/survey"
          appState={this.appState}
          Component={SurveyApp}/>
      </Router>
    )
  }
}

export default App;