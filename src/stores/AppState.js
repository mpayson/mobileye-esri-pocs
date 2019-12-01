import {decorate, observable, action, computed} from 'mobx';
import {
  UserSession
} from "@esri/arcgis-rest-auth";

const SESSION_ID = '__MOBILEYE_ESRI_POCS__';

class AppState {

  redirectToReferrer = false;

  constructor(appConfig){
    this.config = appConfig;
    this.session = null
    
    const serializedSession = localStorage.getItem(SESSION_ID);
    if(serializedSession !== null && serializedSession !== "undefined"){
      let parsed = JSON.parse(serializedSession);
      parsed.tokenExpires = new Date(parsed.tokenExpires);
      if(parsed.tokenExpires > new Date()){
        this.session = new UserSession(parsed);
      } else {
        localStorage.removeItem(SESSION_ID);
      }
    }
  }

  _registerSession(newSession){
    this.session = newSession;
    this.redirectToReferrer = true;
    localStorage.setItem(SESSION_ID, this.session.serialize());
  }

  login(){
    // let session
    const redirectUri = `${window.location.origin}${window.location.pathname}${this.config.relativeRedirectUri}`
    UserSession.beginOAuth2({
      clientId: this.config.appId,
      redirectUri,
      popup: true
    })
    .then(this._registerSession)
    // .then(newSession => {
    //   session = newSession;
    //   return session.getUser();
    // })
    // .then(res => {
    //   this._registerSession(session);
    //   console.log(res);
    // })
    .catch(er => console.log(er));
  }

  get displayName(){
    // for now just show user name
    if(this.session) return this.session.username;
    return null;
  }

  get isAuthenticated(){
    return !!this.session;
  }

  logout(){
    localStorage.removeItem(SESSION_ID);
    this.redirectToReferrer = false; // DO NOT REDIRECT TO REFERRER ON LOGOUT
    this.session = null;
  }

}

decorate(AppState, {
  session: observable,
  redirectToReferrer: observable,
  displayName: computed,
  isAuthenticated: computed,
  _registerSession: action.bound,
  login: action.bound,
  logout: action.bound
})

export default AppState;