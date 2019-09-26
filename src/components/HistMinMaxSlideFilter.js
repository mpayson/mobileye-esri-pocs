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

  onValuesChange = (newValues) => {
    const [min, max] = newValues;
    this.store.onValuesChange(min, max);
  }

  labelFunction = (value, type) => {
    let label = ''
    if (type === "max")
      label = Math.ceil((!this.store.upperBoundSupplied && this.store.isLogarithmic) ? Math.pow(this.store.logBase,this.store.upperBound ) : this.store.upperBound);
    if (type === "min") {
      label = 0
      if (this.store.lowerBound !== 0)
        label = Math.floor((!this.store.lowerBoundSupplied && this.store.isLogarithmic) ? Math.pow(this.store.logBase, this.store.lowerBound) : this.store.lowerBound);
    }
    return label;
  }

  componentDidMount(){
    loadModules([
      'esri/widgets/HistogramRangeSlider',
    ], options)
    .then(([HistogramRangeSlider]) => {


      this.slider = new HistogramRangeSlider({
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
        precision: 1
      });
      this.slider.labelFormatFunction = this.labelFunction;

      this.listener = this.slider.watch("values", this.onValuesChange);
    })
    .catch(er => console.log(er));
  }

  componentWillUnmount(){
    if(this.listener) this.listener.remove();
  }

  render(){

    if(this.slider && this.store.loaded){
      this.slider.bins = this.store.bins;
      this.slider.min = this.store.lowerBound;
      this.slider.max = this.store.upperBound;
      this.slider.values = [
        this.store.min || this.store.lowerBound,
        this.store.max || this.store.upperBound
      ];
    }

    const title = this.store.fieldInfo.alias;

    return(
      <>
        <p>{title}</p>
        <div style={{height: "6rem", width: "100%"}}>
          <div ref={this.sliderRef}></div>
        </div>
      </>
    )
  }
});

export default HistMinMaxSlideFilter;