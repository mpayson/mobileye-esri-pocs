import React from 'react';
import { Slider } from 'antd';
import { observer } from "mobx-react";

const MinMaxSlideFilter = observer(class MinMaxSlideFilter extends React.Component{
  
  constructor(props, context){
    super(props, context);
    this.store = props.store;
  }

  onChange = (newValues) => {
    const [min, max] = newValues;
    this.store.onValuesChange(min, max);
  }
  
  render(){

    if(!this.store.loaded){
      return <Slider
        range
        min={0}
        max={100}
        defaultValue={[0, 100]}
        disabled={true}
      />
    }

    const min = this.store.min || this.store.min === 0
      ? this.store.min
      : this.store.lowerBound;
    const max = this.store.max || this.store.max === 0
      ? this.store.max
      : this.store.upperBound;
    const values = [min, max];

    // should marks live in the store?
    const lowerMark = this.props.lowerBoundLabel
      ? this.props.lowerBoundLabel
      : this.store.lowerBound.toString();

    const upperMark = this.props.upperBoundLabel
      ? this.props.upperBoundLabel
      : this.store.upperBound.toString();

    var marks = {
      [this.store.lowerBound]: lowerMark,
      [this.store.upperBound]: upperMark
    }
    if (this.store.marks)
      marks = this.store.marks;
    // 100 step values to 2 point precision (eg Math.round(trueStep * 100) / 100)
    var step = Math.round(this.store.upperBound - this.store.lowerBound) / 100;

    if (this.store.step)
      step = this.store.step;

    return(
      <Slider
        range
        min={this.store.lowerBound}
        max={this.store.upperBound}
        marks={marks}
        defaultValue={[this.store.lowerBound, this.store.upperBound]}
        value={values}
        onChange={this.onChange}
        disabled={!this.store.loaded}
        step={step}
        tooltipVisible={false}
      />
    )
  }
})

export default MinMaxSlideFilter;

