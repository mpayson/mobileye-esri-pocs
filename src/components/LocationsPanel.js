import React from 'react';
import { observer } from "mobx-react";
import { Card, Button, Collapse } from 'antd';
const {Panel} = Collapse;

class LocationsPanelItem extends React.PureComponent {

  onClick = () => {
    this.props.onClick(this.props.areaIndex, this.props.id);
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

const areaView = (store, areaIndex, areaLocations) => { 
  console.log(areaLocations);
  return (
    areaLocations.map((l,i) => 
      <LocationsPanelItem location={l} areaIndex={areaIndex} id={i} key={l.name} onClick={store.onLocationClick}/>
    )
  )};

const LocationPanel = observer(({store}) => {
  
  return(
    <Collapse defaultActiveKey={[]}>
      {store.locationsByArea.map((l, i) => {
        return (
        <Panel key={l.areaName} header={l.areaName}>
          {areaView(store, i, l.locations)}
        </Panel>
      )})
      }
    </Collapse>
  )
});

export default LocationPanel;

