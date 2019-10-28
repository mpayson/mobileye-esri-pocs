import React from 'react';
import { observer } from "mobx-react";
import { Card, Button } from 'antd';

class GeocenterPanelItem extends React.PureComponent {

  onClick = () => {
    this.props.onClick(this.props.id);
  }

  render(){
    const gc = this.props.geocenter;
    return(
      <Card style={{marginBottom: "5px"}} key={gc.name} cover={<img alt="example" src={gc.image} />}>
        <Button style={{width: "100%"}} ghost type="primary" onClick={this.onClick}>{gc.name}</Button>
      </Card>
    )
  }
}

const GeocenterPanel = observer(({store}) => {
  const geocenterViews = store.geocenters.map((gc,i) => 
    <GeocenterPanelItem geocenter={gc} id={i} key={gc.name} onClick={store.onGeocenterClick}/>
  )

  return(
    <>
      {geocenterViews}
    </>
  )
});

export default GeocenterPanel;

