import React from 'react';
import {loadModules} from 'esri-loader';
import { observer } from "mobx-react";
import options from '../config/esri-loader-options';

const HistogramComponent = observer(class HistogramComponent extends React.Component{

  constructor(props, context){
    super(props, context);
    this.histRef = React.createRef();
    this.store = props.store;
  }

  // onChange = (v) => {
  //   this.setState({sliderValues: v});
  // }

  // onValuesChange = (newValues) => {
  //   const [min, max] = newValues;
  //   this.store.onValuesChange(min, max);
  // }

  createHistogram = () => {
    if (
      this.histogram
      || !this.Histogram
      || !this.histRef.current
      || !this.store.loaded
    ) return;

    this.histogram = new this.Histogram({
      bins: this.store.bins,
      excludedBarColor: "#bfbfbf",
      container: this.histRef.current,
    });
    //console.log("ORK", this.store.bins)
  }

  componentDidMount(){
    loadModules([
      'esri/widgets/Histogram',
    ], options)
    .then(([Histogram]) => {
      this.Histogram = Histogram;
      this.createHistogram();
    })
    .catch(er => console.log(er));
  }


  render(){

    if(!this.histogram && this.store.loaded) this.createHistogram();

    const title = this.store.fieldInfo.alias;

    return(
      <>
        <p>{title}</p>
        <div style={{height: "6rem", width: "10rem"}}>
          <div ref={this.histRef}></div>
        </div>
      </>
    )
  }
});

export default HistogramComponent;