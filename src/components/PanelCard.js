import React from 'react';
import { Collapse, Card } from 'antd';
import './PanelCard.css';
const { Panel } = Collapse;

const CardHeader = ({icon, children}) => (
  <h1 style={{padding: "5px 0", margin: "0"}}>
    {icon && <span style={{marginRight: "10px"}}>{icon}</span>}
    {children}
  </h1>
)

const PanelCard = ({title, icon, collapsible, defaultActive, children, open, onChange}) => {

  const header = <CardHeader icon={icon}>{title}</CardHeader>;

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