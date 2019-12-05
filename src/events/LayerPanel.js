import React from 'react';
import { observer } from "mobx-react";
import PanelCard from '../components/PanelCard';
import LayerIcon from 'calcite-ui-icons-react/LayerIcon';
import SelectFilter from '../components/filters/SelectFilter';


const LayerPanel = observer(class LayerPanel extends React.Component{

  constructor(props, context){
    super(props, context);
    this.eventFilter = props.store.filters.find(f => f.field === 'eventsubtype');
  }

  render(){

    //let domainMap = this.eventFilter.domainMap;

    // let eventOptions = this.eventFilter.options.map(o => {
    //   let text = domainMap.has(o) ? domainMap.get(o) : o;
    //   return (
    //     <div key={o} style={{margin: "5px 0px 0px 10px"}}>
    //       <Switch
    //         size="small"
    //         style={{float: "left", marginTop: "4px"}}/>
    //       <Text style={{margin: "0px 0px 0px 5px"}}>{text}</Text>
    //     </div>
    //   )
    // })

    const eventOptions = this.props.store.filters.map(f => {
      switch(f.type){

        case 'multiselect':
          console.log(f.field)
          return <SelectFilter store={f} mode={f.mode} key={f.field} id={f.field}/>
        case 'select':
          return <SelectFilter store={f} key={f.field}/>
        default:
          throw new Error("Unknown filter type!");
      }
    })

    return (
      <>
        <PanelCard
          icon={<LayerIcon size="20" style={{position: "relative", top: "4px", left: "0px"}}/>}
          title="Layer Selection"
          collapsible={true}
          defaultActive={true}>
          <h3 style={{display: "inline-block", margin: "0px 0px 10px 0px"}}>Event type:</h3>
          {eventOptions}
        </PanelCard>
      </>
    )
  }

});

export default LayerPanel;
