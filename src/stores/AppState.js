import {decorate, observable, action, computed} from 'mobx';
import {
  UserSession
} from "@esri/arcgis-rest-auth";

const SESSION_ID = '__MOBILEYE_ESRI_POCS__';

class AppState {

  constructor(appConfig){
    this.config = appConfig;
    this.session = null;
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
    localStorage.removeItem(SESSION_ID);
  }

  _registerSession(newSession){
    this.session = newSession;
    localStorage.setItem(SESSION_ID, this.session.serialize());
  }

  login(){
    const redirectUri = `${window.location.origin}${window.location.pathname}${this.config.relativeRedirectUri}`
    UserSession.beginOAuth2({
      clientId: this.config.appId,
      redirectUri,
      popup: true
    })
    .then(this._registerSession)
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
    this.session = null;
  }

}

decorate(AppState, {
  session: observable,
  displayName: computed,
  isAuthenticated: computed,
  _registerSession: action.bound,
  login: action.bound,
  logout: action.bound
})

export default AppState;