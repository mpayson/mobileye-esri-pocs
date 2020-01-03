import React from 'react';
import { observer } from "mobx-react";
import { getSingleLevelFilterView } from "../FilterPanel";
import { Collapse, Button, Icon, Popover, Card } from 'antd';

const Panel = Collapse;



const customPanelStyle = {
   borderRadius: 4,
   border: 0
};

const NestedFilter = observer(class FilterPanel extends React.Component{
    
  state = {
    activeKeys: []
  }

  onAccordionChange = (keys) => {
    this.setState({
      activeKeys: keys
    })
  }

  onToggleClick = () => {
    if(this.state.activeKeys.length > 0){
      this.setState({
        activeKeys: []
      });
    } else {
      const keys = this.props.store.filters.map(f => f.field);
      this.setState({
        activeKeys: keys
      })
    }
  }

  render(){
    const filters = this.props.store.filters;
    const filterViews = filters.map(f => {
        
      const headerText = f.isActive
        ? <span style={{color: '#00abbc'}}><b>{f.alias}</b></span>
        : f.alias;
        
      let header = f.infoText
        ? <>
            <Popover content={f.infoText} placement="topLeft">
              <Icon
                type="info-circle"
                style={{marginRight: "3px", color: f.isActive ? '#00abbc' : undefined}}/>
            </Popover>
            {headerText}
          </>
        : headerText;
        console.log(header);
      return (
        <Panel header={header} key={f.field} style={customPanelStyle} className='minimal-padding'>
          {getSingleLevelFilterView(f)}
        </Panel>
      )
    });

    const defaultActive = this.props.defaultActive || false;

    const activeKeys = this.props.activeFilterKeys || this.state.activeKeys;
    const onAccordionChange = this.props.onFilterAccordionChange || this.onAccordionChange;

    const panelOpen = this.props.panelOpen === undefined ? undefined : this.props.panelOpen;
    const onPanelChange = this.props.onPanelChange ? this.props.onPanelChange : undefined;
    const onToggleClick = this.props.onFilterToggleAllClick ? this.props.onFilterToggleAllClick : this.onToggleClick;

    const toggleButtonText = activeKeys.length > 0
    ? 'Close all'
    : 'Open all';

    return (
        
        <Card>
        <div style={{display: "inline-block", width: "100%", padding: "0px 15px 10px 5px"}}>
          <Button type="danger" size="small" ghost  onClick={this.props.store.clearFilters}>Clear</Button>
          <Button size="small" onClick={onToggleClick} style={{float: "right"}}>{toggleButtonText}</Button>
        </div>
          <Collapse
            activeKey={activeKeys}
            bordered={false}
            expandIconPosition='right'
            onChange={onAccordionChange}
            >
            {filterViews}
          </Collapse>
          </Card>

    )
  }
  
    

})

export {getSingleLevelFilterView};
export default NestedFilter;