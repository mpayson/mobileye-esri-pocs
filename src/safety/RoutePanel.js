import React from 'react';
import { observer } from "mobx-react";

const RoutePanel = observer(class RoutePanel extends React.Component{
  render(){
    return(
      <h1>Hello world!</h1>
    )
  }
});

export default RoutePanel;