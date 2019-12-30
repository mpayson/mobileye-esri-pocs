import React from 'react'
import { observer } from "mobx-react";
import { HashRouter as Router, BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import { Row, Col, Card, Layout, Button, Divider } from 'antd';
import AppState from './stores/AppState';
import EventsImage from './resources/images/Events.png';
import SurveyImage from './resources/images/survey.png';
import SafetyImage from './resources/images/safety.png';
import LoginBGImage from './resources/images/LoginBG.png';
import SafetyApp from './safety/SafetyApp';
import EventsApp from './events/EventsApp';
import SurveyApp from './survey/SurveyApp';
import HumanMobilityApp from './human_mobility/HumanMobilityApp';
import './style.css';

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
    <div/>
  )
}

const PrivateRoute = observer(({Component, appState, ...rest}) => {
  const isAuth = appState.isAuthenticated; //needed to trigger mobx
  return (
    <Route
      {...rest}
      render={(props) => (
        isAuth === true
          ? <Component appState={appState} {...props}/>
          : <Redirect to={{
              pathname: '/',
              state: {from: props.location}
            }}/>
      )}/>
    )
});

const Home = observer(class Home extends React.Component{
  
  componentDidMount(){
    loadScript(options);
  }

  render(){
    let appState = this.props.appState;

    let topComponent = appState.isAuthenticated
      ? <h1>Hello <b>{appState.displayName}</b>, please select the application you would like to use:</h1>
      : <Button type="primary" size="large" onClick={appState.login}>Log in to get started</Button>;

    const {from} = this.props.location.state || {from: null};
    if(appState.redirectToReferrer && from){
      return <Redirect to={from}/>
    }

    // Not good practice, should find a way to inject router Link into antd Button
    const linkClass = "ant-btn ant-btn-primary ant-btn-background-ghost ant-btn-block ant-btn ant-btn-lg";

    return(
        <div>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          <link rel="stylesheet" href="style.css" />
          <link
            href="https://fonts.googleapis.com/css?family=Hind+Siliguri&display=swap"
            rel="stylesheet"
          />
          <title>CES Data Demos</title>
          <header>
            <div className="top-header">
              <img
                src="https://static.mobileye.com/website/common/images/me_logo_white_2.svg"
                alt="Mobileye Logo"
                className="logo"
              />
              <button className="login-btn">Login</button>
            </div>
            <div className="bottom-header">
              <h1>Mobileye Data Services</h1>
              <h2>Serving Public More Efficiently</h2>
            </div>
          </header>
          <div className="grid">
            <a
              href="/#/survey"
              disabled={!appState.isAuthenticated}
              className="item"
            >
              <img
                src="https://static.mobileye.com/website/corporate/data-demos/icon-iai.svg"
                alt="Infrastructure Asset Inventory"
              />
              <p>
                Infrastructure <br /> Asset Inventory
              </p>
            </a>
            <a href="/#/mobility" disabled={!appState.isAuthenticated} className="item">
              <img
                src="https://static.mobileye.com/website/corporate/data-demos/icon-m.svg"
                alt="Mobility"
              />
              <p>Mobility</p>
            </a>
            <a href="/#/parking" disabled={!appState.isAuthenticated} className="item">
              <img
                src="https://static.mobileye.com/website/corporate/data-demos/icon-p.svg"
                alt="Parking"
              />
              <p>Parking</p>
            </a>
            <a
              href="/#/safety"
              className="item"
              disabled={!appState.isAuthenticated}
            >
              <img
                src="https://static.mobileye.com/website/corporate/data-demos/icon-rss.svg"
                alt="Road Risk Score"
              />
              <p>
                Road Risk <br /> Score
              </p>
            </a>
            <a href="" disabled={!appState.isAuthenticated} className="item">
              <img
                src="https://static.mobileye.com/website/corporate/data-demos/icon-l2.svg"
                alt="L2+"
              />
              <p>L2+</p>
            </a>
          </div>
        </div>
    )
    // return(
    //   <Layout style={{ minHeight: '100vh' , backgroundImage: `url(${LoginBGImage})`,backgroundPosition: 'center', backgroundSize: 'cover',  backgroundRepeat: 'no-repeat'}}>
    //     <Content style={{ padding: '50px 50px'}}>
    //       <Row type="flex" justify="space-around" align="middle">
    //         <Col style={{textAlign: 'center'}}>
    //           {topComponent}
    //         </Col>
    //       </Row>
    //       <Divider/>
    //       <Row type="flex" justify="space-around" align="middle">
    //         <Col md={{span: 0}} xl={{span: 2}}/>
    //         <Col md={{span: 6}} xl={{span: 4}}>
    //           <Card
    //           cover={<img alt="example" src={SafetyImage} />}>
    //             <Link
    //               to="/safety"
    //               className={linkClass}
    //               disabled={!appState.isAuthenticated}>
    //               Explore Safety
    //             </Link>
    //           </Card>
    //         </Col>
    //         <Col md={{span: 6}} xl={{span: 4}}>
    //           <Card
    //           cover={<img alt="example" src={EventsImage}/>}>
    //             <Link
    //               to="/events"
    //               className={linkClass}
    //               disabled={!appState.isAuthenticated}>
    //               Explore Events
    //             </Link>
    //           </Card>
    //         </Col>
    //         <Col md={{span: 6}} xl={{span: 4}}>
    //           <Card
    //           cover={<img alt="example" src={SurveyImage} />}>
    //           <Link
    //             to="/survey"
    //             className={linkClass}
    //             disabled={!appState.isAuthenticated}>
    //             Explore Survey
    //           </Link>
    //           </Card>
    //         </Col>
    //         <Col md={{span: 0}} xl={{span: 2}}/>
    //       </Row>
    //     </Content>
    //   </Layout>
    // )
  }
});


class App extends React.Component{

  constructor(props, context){
    super(props, context);
    const relativeRedirectUri = '';
    this.appState = new AppState({...config, relativeRedirectUri});
    console.log('v 0.0.1')
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
        <PrivateRoute
          path="/mobility"
          appState={this.appState}
          Component={HumanMobilityApp}/>

      </Router>
    )
  }
}

export default App;