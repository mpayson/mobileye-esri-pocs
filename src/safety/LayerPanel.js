import React from 'react';
import { observer } from "mobx-react";
import {
  Switch,
  Radio,
  Typography } from 'antd';
import FilterPanel from '../components/FilterPanel';
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';

const { Text } = Typography;

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const LayerPanel = observer(class LayerPanel extends React.Component{

  nonMainRenderer = 'harsh_cornering_ratio';

  onRadioChange = (e) => {
    let renderer = e.target.value;
    this.nonMainRenderer = renderer;
    this.props.store.setRendererField(renderer);
  }

  onSwitchChange = (isChecked) => {
    if(isChecked){
      this.props.store.setRendererField('eventvalue');
    } else {
      this.props.store.setRendererField(this.nonMainRenderer);
    }
  }

  render(){

    let radioOptions;
    if(this.props.store.aliasMap){
      radioOptions = this.props.store.rendererOptions
        .filter(o => o !== 'eventvalue')
        .map(o => 
          <Radio value={o} key={o} style={radioStyle}>{this.props.store.aliasMap.get(o)}</Radio>
        )
    }

    let radioValue = this.props.store.rendererField === 'eventvalue'
      ? this.nonMainRenderer
      : this.props.store.rendererField;

    const isSwitchChecked = this.props.store.rendererField === 'eventvalue';

    return (
      <>
        <PanelCard
          icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
          title="Layer Selection"
          collapsible={true}
          defaultActive={true}>
          <div>
            <Switch
              onChange={this.onSwitchChange}
              checked={isSwitchChecked}
              style={{float: "left", marginTop: "1px"}}/>
            <h3 style={{display: "inline-block", margin: "0px 0px 2px 10px"}}>Road risk score</h3>
          </div>
          <p style={{margin: "10px 0px 5px 0px"}}><Text strong> Toggle Road Risk Score off to explore individual data layers of the overall score</Text></p>
          <Radio.Group
            disabled={isSwitchChecked}
            onChange={this.onRadioChange}
            value={radioValue}>
            {radioOptions}
          </Radio.Group>
        </PanelCard>
        <FilterPanel store={this.props.store}/>
      </>
    )
  }

});

export default LayerPanel;
