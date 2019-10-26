import React from 'react';
import { observer } from "mobx-react";
import { Select, Button } from 'antd';
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


const SelectFilter = observer( ({store, mode, style}) => {
  if(style !== 'buttons') return <DropdownSelectFilter store={store} mode={mode}/>;
  if(mode !== 'multiple') throw new Error('Button selects only support multiple for now');
  return <BtnMultiSelectFilter store={store}/>
})

export default SelectFilter;