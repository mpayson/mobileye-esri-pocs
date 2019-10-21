import React from 'react';
import { observer } from "mobx-react";
import { Select } from 'antd';
const { Option } = Select;

const SelectFilter = observer( ({store, mode}) => {
  const children = store.options.slice().sort().map(o => {
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

export default SelectFilter;