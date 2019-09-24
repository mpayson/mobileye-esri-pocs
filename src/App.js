import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SafetyApp from './safety/SafetyApp';
import EventsApp from './events/EventsApp';
import SurveyApp from './survey/SurveyApp';

function Home() {
  return (
    <ul>
      <li>
        <Link to="/safety">Safety</Link>
      </li>
      <li>
        <Link to="/events">Events</Link>
      </li>
      <li>
        <Link to="/survey">Survey</Link>
      </li>
    </ul>
  )
}

function App() {
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