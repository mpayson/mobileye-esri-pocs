import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {transformQueryToRechartSeries} from '../../utils/Utils';
import {
  BarChart, Bar, XAxis, YAxis
} from 'recharts';


const MyBarChart = observer(class MyBarChart extends Component {

  render() {
    const store = this.props.store;
    const config = this.props.config;
    const {
      id,
      xField,
      yField
    } = {...config};
    const chartResultMap = store.chartResultMap;
    const queryData = chartResultMap.get(id);
    const chartData = transformQueryToRechartSeries(queryData, xField, yField);

    return (
      <BarChart
        width={320}
        height={400}
        data={chartData}
        margin={{
          top: 15, right: 0, left: 0, bottom: 0,
        }}
        layout="vertical"
      >
        <XAxis type="number" tick={{fontSize: 8}}/>
        <YAxis type="category" dataKey={xField} tick={{fontSize: 8}} width={50}/>
        <Bar dataKey={yField} fill="#8884d8" />
      </BarChart>
    );
  }
});


export default MyBarChart;
