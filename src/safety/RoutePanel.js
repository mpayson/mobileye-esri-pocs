import React from 'react';
import { observer } from "mobx-react";
import {
  Input,
  Button,
  Icon
} from 'antd';
import PinIcon from 'calcite-ui-icons-react/PinPlusIcon';

const CreateIcon = () => (
  <PinIcon size="17"/>
)

const InputGroup = Input.Group;

const RoutePanel = observer(class RoutePanel extends React.Component{
  render(){
    const store = this.props.store;

    const startIcon = store.editMode === 'start' || store.startGraphic
      ? <Icon type='close'/>
      : <Icon component={CreateIcon} />;
    
    const endIcon = store.editMode === 'end' || store.endGraphic
      ? <Icon type='close'/>
      : <Icon component={CreateIcon} />

    return(
      <>
        <p>Route Start</p>
        <InputGroup compact style={{marginBottom: "15px"}}>
          <Button
            style={{padding: "0px 10px"}}
            onClick={_ => store.onCreateClick('start')}
            disabled={!store.isSketchLoaded}>
            {startIcon}
          </Button>
          <Input
            style={{width: 'calc(100% - 40px)'}}
            value={store.startStr}>
          </Input>
        </InputGroup>
        <p>Route End</p>
        <InputGroup compact style={{marginBottom: "30px"}}>
          <Button
            style={{padding: "0px 10px"}}
            onClick={_ => store.onCreateClick('end')}
            disabled={!store.isSketchLoaded}>
            {endIcon}
          </Button>
          <Input
            style={{width: 'calc(100% - 40px)'}}
            value={store.endStr}>
          </Input>
        </InputGroup>
        <Button
          size="large"
          style={{width: "100%"}}
          disabled={!(store.startGraphic && store.endGraphic)}
          type="primary"
          ghost>
          Generate routes
        </Button>
      </>
    ) 
  }
});

export default RoutePanel;