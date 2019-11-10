import React from 'react';
import { observer } from "mobx-react";
import { Card, Button } from 'antd';

class LocationsPanelItem extends React.PureComponent {

  onClick = () => {
    this.props.onClick(this.props.id);
  }

  render(){
    const l = this.props.location;
    return(
      <Card style={{marginBottom: "5px"}} key={l.name} cover={<img alt="example" src={l.image} />}>
        <Button style={{width: "100%"}} ghost type="primary" onClick={this.onClick}>Explore {l.name}</Button>
      </Card>
    )
  }
}

const LocationPanel = observer(({store}) => {
  const locationViews = store.locations.map((l,i) => 
    <LocationsPanelItem location={l} id={i} key={l.name} onClick={store.onLocationClick}/>
  )

  return(
    <>
      {locationViews}
    </>
  )
});

export default LocationPanel;

