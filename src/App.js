import React from 'react'
import { observer } from "mobx-react";
import { HashRouter as Router, BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import { Layout, Button } from 'antd';
import AppState from './stores/AppState';
import SafetyApp from './safety/SafetyApp';
import EventsApp from './events/EventsApp';
import SurveyApp from './survey/SurveyApp';
import HumanMobilityApp from './human_mobility/HumanMobilityApp';
import ParkingVideo from "./resources/Video/ParkingJerusalem.mp4"
import L2Video from "./resources/Video/L2.mp4"

import './style.css';

import {
  UserSession
} from "@esri/arcgis-rest-auth";
import config from './config/config';

const { Content } = Layout;
const { appId } = config;
// console.log(ParkingVideo);
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

  render(){
    let appState = this.props.appState;

    const {from} = this.props.location.state || {from: null};
    if(appState.redirectToReferrer && from){
      return <Redirect to={from}/>
    }

    const loginText = appState.isAuthenticated
      ? 'Logout'
      : 'Login';

    const loginClickHandler = appState.isAuthenticated
      ? appState.logout
      : appState.login;

    return(
        <div>
          <header className="splash-header">
            <div className="top-header">
              <img
                src="https://static.mobileye.com/website/common/images/me_logo_white_2.svg"
                alt="Mobileye Logo"
                className="logo"
              />
              <button className="login-btn" onClick={loginClickHandler}>{loginText}</button>
            </div>
            <div className="bottom-header">
              <h1 className="bottom-header-h1">Mobileye Data Services</h1>
              <h2 className="bottom-header-h2">Serving the Public More Efficiently</h2>
            </div>
          </header>
          <div className="grid">
            <Link
              to="/survey"
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
            </Link>
            <Link to="/mobility" disabled={!appState.isAuthenticated} className="item">
              <img
                src="https://static.mobileye.com/website/corporate/data-demos/icon-m.svg"
                alt="Mobility"
              />
              <p>Mobility</p>
            </Link>

            <a href={ParkingVideo} className="item">
              <img
                src="https://static.mobileye.com/website/corporate/data-demos/icon-p.svg"
                alt="Parking"
              />
              <p>Parking</p>
            </a>
            <Link
              to="/safety"
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
            </Link>
            <Link
              to="/events"
              className="item"
              disabled={!appState.isAuthenticated}
            >
              <img
                src="https://static.mobileye.com/website/corporate/data-demos/icon-l2.svg"
                alt="L2+"
              />
              <p>Real Time <br /> Events</p>
            </Link>
          </div>
        </div>
    )
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