import React from 'react';
import { observer } from "mobx-react";
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';
import MinMaxSlideFilter from '../components/filters/MinMaxSlideFilter';

import {LayerList} from '../components/LayerListPanel';
import {getSingleLevelFilterView} from '../components/FilterPanel';
import {getFilterView} from '../components/FilterPanel';
import {Radio, Switch} from "antd";
import humanMobilityConfig from './HumanMobilityConfig';
const RadioGroup = Radio.Group;

const LayerPanel = observer(class LayerPanel extends React.Component{

  state = {
    selectedStatId: this.props.store.rendererField,
  };

  constructor(props, context){
    super(props, context);
    this.dayOfWeekFilter = this.props.store.dayOfWeekFilter;
  }

  _onRadioClick = e => {
    this.setState({
      selectedStatId: e.target.value,
    });
    this.props.store.setRendererField(e.target.value);
  }


  _updateRendererExpression(){
  }
  render(){

    const dayFilterView = getSingleLevelFilterView(this.dayOfWeekFilter);

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }

    const statsRadios = Object.entries(humanMobilityConfig.statisticsFieldsInfo).map(entry =>
        <Radio value={entry[0]} key={entry[0]} style={radioStyle}>{entry[1].title}</Radio>
    )
    const statsListGroup =
      <RadioGroup 
        onChange={this._onRadioClick} 
        value={this.props.store.rendererField} 
        style={{marginBottom: '15px'}}
      >
        {statsRadios}
      </RadioGroup>;
    return (
      <>
        <PanelCard
          icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
          title="GIS Layers"
          collapsible={true}
          defaultActive={true}>
          {statsListGroup}
          <br/>
          <h3 style={{margin: "0px 0px 10px 0px"}}>Days of week:</h3>
          {dayFilterView}
          <br/>
        </PanelCard>
      </>
    )
  }

});

export default LayerPanel;
