import React from 'react';
import { observer } from "mobx-react";
import {Select, Button, Switch} from 'antd';
const { Option } = Select;
const ButtonGroup = Button.Group;


const DropdownSelectFilter = observer(({store, mode}) => {
  const children = store.displayOptions.map(o => {
    let label = o;
    if (store.domainMap.has(o)) {
        label = store.domainMap.get(o);
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
        value={store.selectValue}
      >
        {children}
      </Select>
    </div>
  )
})

const RadioButtonsSelectFilter = observer(class RadioButtonsSelectFilter extends React.Component{

  state = {
    filterActiveKeys: [],
  }

  _onRadioButtonClick = (checked, event, id) => {
    const radioId = event.target.id;
    let nextKeys = null;
    nextKeys = this.state.filterActiveKeys.slice();
    if (checked) {
      if (!this.state.filterActiveKeys.includes(radioId)){
        nextKeys.push(radioId);
      }
    }
    else {
      if (this.state.filterActiveKeys.includes(radioId)) {
        nextKeys.splice(nextKeys.indexOf(radioId), 1);
      }
    }
    this.setState({
      filterActiveKeys: nextKeys,
    })

    this.props.store.onValueChange(nextKeys);
  }

  render() {

    const children = this.props.store.displayOptions.map(o => {
      let label = o;
      if (this.props.store.domainMap.has(o)) {
        label = this.props.store.domainMap.get(o);
      }
      return (
        <div key={o}>
          <Switch
              id={o}
              onChange={this._onRadioButtonClick}
              checked={this.state.filterActiveKeys.includes(o)}
              style={{float: "left", marginTop: "1px"}}/>
          <h3 style={{display: "inline-block", margin: "0px 0px 2px 10px"}}>{label}</h3>
        </div>
      )
    })

    return (
      children
    )
  }
})

const BtnMultiSelectFilter = observer(class BtnMultiSelectFilter extends React.Component{

  _onButtonClick = (e) => {
    const id = e.target.id;
    this.props.store.onValueOptionChange(id);
  }

  render(){
    const selectedSet = this.props.store.selectedOptionSet;
    const domainMap = this.props.store.domainMap;
    const children = this.props.store.displayOptions.map(o => {
      let label = o;
      if (domainMap.has(o)) {
          label = domainMap.get(o);
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


const SelectFilter = observer( ({store, mode, id}) => {
  if(mode === 'multiple-radios') return <RadioButtonsSelectFilter store={store}/>;
  if(mode !== '')  return <DropdownSelectFilter store={store} mode={mode}/>;
  return <BtnMultiSelectFilter store={store}/>
})

export default SelectFilter;