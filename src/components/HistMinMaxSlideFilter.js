import React from 'react';
import {loadModules} from 'esri-loader';
import { observer } from "mobx-react";
import options from '../config/esri-loader-options';

const HistMinMaxSlideFilter = observer(class HistMinMaxSlideFilter extends React.Component{

  constructor(props, context){
    super(props, context);
    this.sliderRef = React.createRef();
    this.store = props.store;
  }

  onChange = (v) => {
    this.setState({sliderValues: v});
  }

  onValuesChange = (newValues) => {
    const [min, max] = newValues;
    this.store.onValuesChange(min, max);
  }

  createSlider = () => {
    if (
      this.slider
      || !this.Slider
      || !this.sliderRef.current
      || !this.store.loaded
    ) return;

    this.slider = new this.Slider({
      bins: this.store.bins,
      min: this.store.lowerBound,
      max: this.store.upperBound,
      values: [
        this.store.min || this.store.lowerBound,
        this.store.max || this.store.upperBound
      ],
      excludedBarColor: "#bfbfbf",
      rangeType: "between",
      container: this.sliderRef.current,
      precision: 0
    });

    this.listener = this.slider.watch("values", this.onValuesChange)

  }

  componentDidMount(){
    loadModules([
      'esri/widgets/HistogramRangeSlider',
    ], options)
    .then(([HistogramRangeSlider]) => {
      this.Slider = HistogramRangeSlider;
      this.createSlider();
    })
    .catch(er => console.log(er));
  }

  componentWillUnmount(){
    if(this.listener) this.listener.remove();
  }

  render(){

    if(!this.slider && this.store.loaded) this.createSlider();

    const title = this.store.fieldInfo.alias;

    return(
      <>
        <p>{title}</p>
        <div style={{height: "6rem", width: "10rem"}}>
          <div ref={this.sliderRef}></div>
        </div>
      </>
    )
  }
});

export default HistMinMaxSlideFilter;