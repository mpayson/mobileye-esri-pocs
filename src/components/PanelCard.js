import React from 'react';
import { Collapse, Card } from 'antd';
import './PanelCard.css';
const { Panel } = Collapse;

const PanelCard = ({title, icon, collapsible, defaultActive, children, open, onChange}) => {

  const header = icon
    ? <h1 style={{padding: "0px"}}>{icon}<span style={{marginLeft: "10px"}}>{title}</span></h1>
    : <h1 style={{padding: "0px"}}>{title}</h1>;

  if(!collapsible){
    return (
      <Card size="small" style={{marginTop: "10px"}}>
        {header}
        {children}
      </Card>
    )
  }

  const defaultActiveKeys = defaultActive
    ? ['panel-card']
    : [];

  let props = {
    bordered: false,
    expandIconPosition: 'right',
    className: 'no-padding',
    defaultActiveKey: defaultActiveKeys
  }
  if(open !== undefined && onChange){
    props.activeKey = open ? ['panel-card'] : [];
    props.onChange = onChange
  }

  return(
    <Card size="small" style={{marginTop: "10px"}}>
      <Collapse
        {...props}>
        <Panel
          header={header}
          style={{border: 0}}
          className="no-padding"
          key="panel-card">
          {children}
        </Panel>
      </Collapse>

    </Card>
  )
}

export default PanelCard;