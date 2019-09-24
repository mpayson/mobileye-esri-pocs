import React from 'react';
import { Slider } from 'antd';
import {getMinMaxWhere} from '../Utils';

class MinMaxSlideFilter extends React.Component{
  state = {
    sliderValues: null
  }

  onChange = (v) => {
    this.setState({sliderValues: v});
    console.log(v);
    const [min, max] = v;
    const where = getMinMaxWhere(this.props.field, min, max);
    this.props.onWhereChange(this.props.field, where);
  }

  render(){
    const {
      title,
      field,
      min,
      max,
      disabled
    } = {...this.props}

    const marks = {
      [min]: min.toString(),
      [max]: max.toString()
    }
    
    const values = this.state.sliderValues
      ? this.state.sliderValues
      : [min, max];

    return(
      <>
      <p>{title}</p>
      <Slider
        range
        min={min}
        max={max}
        marks={marks}
        defaultValue={[min, max]}
        value={values}
        onChange={this.onChange}
        disabled={disabled}
        // onAfterChange={onAfterChange}
      />
      </>
    )
  }
}

export default MinMaxSlideFilter;