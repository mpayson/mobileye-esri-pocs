import React from 'react';
import { observer } from "mobx-react";
import {
  Input,
  Button,
  Icon,
  Statistic,
  Card,
  Divider
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
          ghost
          onClick={store.generateRoutes}>
          Generate routes
        </Button>
        <Divider/>
        <Card
          title={
            <div>Travel Time
              <span style={{float: 'right'}}>
                <Icon type={store.safetyTimeDelta > 0 ? 'arrow-up' : 'arrow-down'}/>
                <b>{` ${store.safetyTimeDelta ? Math.round(Math.abs(store.safetyTimeDelta)) : ' - - '}%`}</b>
              </span>
            </div>
          }
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
          title={
            <div>Travel Safety Score
              <span style={{float: 'right'}}>
                <Icon type={store.safetyScoreeDelta > 0 ? 'arrow-up' : 'arrow-down'}/>
                <b>{` ${store.safetyScoreDelta ? Math.round(Math.abs(store.safetyScoreDelta)) : ' - - '}%`}</b>
              </span>
            </div>
          }
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