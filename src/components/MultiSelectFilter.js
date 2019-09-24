import React from 'react';
import { observer } from "mobx-react";
import { Select } from 'antd';
const { Option } = Select;

const MultiSelectFilter = observer( ({store}) => {
  const children = store.options.map(o => {
    return <Option key={o}>{o}</Option>
  })
  const title = store.fieldInfo.alias;
  return (
    <div style={{marginBottom: "1rem"}}>
      <p>{title}</p>
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
        onChange={store.onValuesChange}
        value={store.values}
      >
        {children}
      </Select>
    </div>
  )
})

export default MultiSelectFilter;