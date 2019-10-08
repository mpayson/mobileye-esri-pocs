import React from 'react';
import { observer } from "mobx-react";
import {
  Input,
  Button,
  Icon,
  Statistic,
  Card,
  Divider,
  Alert
} from 'antd';
import PinIcon from 'calcite-ui-icons-react/PinPlusIcon';

const CreateIcon = () => (
  <PinIcon size="17"/>
)

const InputGroup = Input.Group;


const IndicatorTitle = ({title, value}) => {
  const text = value || value === 0
    ? ` ${Math.round(Math.abs(value))}%`
    : ' - - %';
  let spanStyle = {float: 'right'};
  let iconType = 'arrow-down';
  if(value && value > 0){
    spanStyle.color = '#f5222d';
    iconType = 'arrow-up';
  } else if (value && value < 0){
    spanStyle.color = '#52c41a';
    iconType = 'arrow-down';
  }
  return (
    <div>
      {title}
      <span style={spanStyle}>
        <Icon type={iconType}/>
        <b>{text}</b>
      </span>
    </div>
  )
}

const RoutePanel = observer(class RoutePanel extends React.Component{

  componentWillUnmount(){
    this.props.store.clearRouteData();
  }

  closeAlert = () => {
    this.props.store.clearRouteData();
  }

  render(){
    const store = this.props.store;

    const startIcon = store.editMode === 'start' || store.startGraphic
      ? <Icon type='close'/>
      : <Icon component={CreateIcon} />;
    
    const endIcon = store.editMode === 'end' || store.endGraphic
      ? <Icon type='close'/>
      : <Icon component={CreateIcon} />

    const alert = store.safetyTimeDelta && store.safetyTimeDelta > 25
      ? (
        <Alert
        style={{marginBottom: "10px"}}
        message="Unrealistic Results"
        description="Who wants to drive this much? Close this alert to reset"
        type="warning"
        onClose={this.closeAlert}
        closable/>
      )
      : null;

    console.log(store.safetyTimeDelta && store.safetyTimeDelta < 5);

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
          style={{width: "65%", marginRight: "5px"}}
          disabled={!(store.startGraphic && store.endGraphic)}
          type="primary"
          onClick={store.generateRoutes}>
          Generate routes
        </Button>
        <Button
          type="danger"
          size="large"
          disabled={!(store.startGraphic || store.endGraphic || store.stdTravelTime)}
          ghost
          onClick={store.clearRouteData}>
            Clear
        </Button>
        <Divider/>
        {alert}
        <Card
          title={<IndicatorTitle title="Travel Time" value={store.safetyTimeDelta}/>}
          size="small"
          style={{marginBottom: '15px'}}>
          <Statistic
            title="Without accounting for risk"
            value={store.stdTravelTime ? store.stdTravelTime : ' - - '}
            precision={0}
            prefix={<Icon type="minus" style={{color: 'rgb(94, 43, 255)'}}/>}
            suffix="min"
          />
          <Statistic
            title="Accounting for risk"
            value={store.safetyTravelTime ? store.safetyTravelTime : ' - - '}
            precision={0}
            prefix={<Icon type="minus" style={{color: "rgb(227, 69, 143)"}}/>}
            suffix="min"
          />
        </Card>
        <Card
          title={<IndicatorTitle title="Travel Safety Score" value={store.safetyScoreDelta}/>}
          size="small">
          <Statistic
            title="Without accounting for risk"
            value={store.stdTravelScore ? store.stdTravelScore : ' - - '}
            precision={2}
            prefix={<Icon type="minus" style={{color: 'rgb(94, 43, 255)'}}/>}
          />
          <Statistic
            title="Accounting for risk"
            value={store.safetyTravelScore ? store.safetyTravelScore : ' - - '}
            precision={2}
            prefix={<Icon type="minus" style={{color: "rgb(227, 69, 143)"}}/>}
          />
        </Card>
      </>
    ) 
  }
});

export default RoutePanel;