import React from 'react';
import { observer } from "mobx-react";
import { Select } from 'antd';
const { Option } = Select;

const SelectFilter = observer( ({store, mode}) => {
  const children = store.options.slice().sort().map(o => {
    return <Option key={o}>{o}</Option>
  })
  const title = store.fieldInfo.alias;
  return (
    <div style={{marginBottom: "1rem"}}>
      <p>{title}</p>
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

export default SelectFilter;