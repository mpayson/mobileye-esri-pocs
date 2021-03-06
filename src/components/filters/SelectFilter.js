import React from 'react';
import { observer } from "mobx-react";
import {Select, Button, Switch, Radio} from 'antd';
const { Option } = Select;
const ButtonGroup = Button.Group;
const RadioGroup = Radio.Group;

function findLabel(domainMap, option) {
  let label = option;
  if (domainMap.has(option)) {
    label = domainMap.get(option);
  } else {
    // some numbers might be passed as strings
    const _option = parseInt(option);
    if (Number.isInteger(_option)) {
      label = domainMap.get(_option);
    }
  }
  return label;
}

const DropdownSelectFilter = observer(({store, mode}) => {
  const children = store.displayOptions.map(o => {
    let label = findLabel(store.domainMap, o);
    if (o === -100) {
      label = "All";
    }
    return <Option key={o}>{label}</Option>
  })
  return (
    <div style={{marginBottom: "1rem"}}>
      <Select
        mode={mode}
        style={{ width: '100%' }}
        placeholder="Please select"
        onSelect={mode === "multiple" ? null : store.onValueChange}
        onChange={mode === "multiple" ? store.onValueChange : null}
        value={store.selectValue}>
        {children}
      </Select>
    </div>
  )
});

const ToggleMultiSelectFilter = observer(class ToggleMultiSelectFilter extends React.Component{
  _onToggle = (checked, event) => {
    const id = event.target.id;
    this.props.store.onValueOptionChange(id);
  }

  render() {
    const store = this.props.store;
    return store.displayOptions.map(o => {
      const label = (o === -100 ? "All" : findLabel(store.domainMap, o));
      const wrapperStyles = {display: "flex", alignItems: "center", height: "32px"}
      return (
        <div style={wrapperStyles} key={o}>
          <Switch
              id={o}
              onChange={this._onToggle}
              checked={store.selectedOptionSet.has(o)}
              style={{marginRight: "10px"}}
              size="small"
          />
          <div style={{lineHeight: 1.15}}>{label}</div>
        </div>
      )
    });
  }
});

const BtnMultiSelectFilter = observer(class BtnMultiSelectFilter extends React.Component{

  _onButtonClick = (e) => {
    const id = e.target.id;
    this.props.store.onValueOptionChange(id);
  }

  render(){
    const selectedSet = this.props.store.selectedOptionSet;
    const domainMap = this.props.store.domainMap;
    const children = this.props.store.displayOptions.map(o => {
      let label = findLabel(domainMap, o);
      if (o === -100) {
        label = "All";
      }
      return (
        <Button
          id={o}
          style={{padding: "0px 10px"}}
          onClick={this._onButtonClick}
          // size="small"
          key={o}
          type={selectedSet.has(o) ? 'primary' : 'dashed'}
          ghost={selectedSet.has(o) ? true : false}>
          {label}
        </Button>
      )
    });

    return (
      <div style={{marginBottom: "1rem", margin: "auto"}}>
        <ButtonGroup>
          {children}
        </ButtonGroup>
      </div>
    )
  }

});

const RadioSelectFilter = observer(class RadioSelectFilter extends React.Component{
  _onRadioClick = e => {
    const id = e.target.value;
    this.props.store.onValueChange(id);
  }
  render(){
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    const store = this.props.store;
    let radios = store.displayOptions.map(o => {
      let label = (o === -100 ? "All" : findLabel(store.domainMap, o));
      return (
        <Radio value={o} key={o} style={radioStyle}>{label}</Radio>
      )
    })
    return(
      <RadioGroup onChange={this._onRadioClick} value={store.selectValue}>
        {radios}
      </RadioGroup>
    )
  }
});

const SelectFilter = observer( ({store, mode, style}) => {
  switch(style){
    case 'toggle':
      if(mode !== 'multiple'){
        throw new Error("Toggle filter style is only available for multiple selection mode")
      }
      return <ToggleMultiSelectFilter store={store}/>
    case 'button':
      if(mode !== 'multiple'){
        throw new Error("Button filter style is only available for multiple selection mode")
      }
      return <BtnMultiSelectFilter store={store}/>
    case 'radio':
      if(mode === 'multiple'){
        throw new Error("Radio filter style is only available for single selection mode");
      }
      return <RadioSelectFilter store={store}/>
    default:
      return <DropdownSelectFilter store={store} mode={mode}/>;
  }
})

export default SelectFilter;