import React, { useEffect, useRef, useState } from 'react';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';
import './LegendPanel.css';
import { Drawer } from 'antd';


const LegendPanel = (props) => {
  const {store, view, children, width, title=null, onMountOpen=false} = props;
  const [open, setOpen] = useState(onMountOpen);
  const ref = useRef({
    Legend: null,
    portal: null,
  });
  const content = useRef(null);

  useEffect(() => {
    loadModules(['esri/widgets/Legend'], options).then(([Legend]) => {
      ref.current.Legend = Legend
    });
  }, []);
  
  useEffect(() => {
    const Legend = ref.current.Legend;
    if (view && Legend) {
      const legend = new Legend({
        view,
        layerInfos: [{layer: store.lyr, title}],
      });
      view.ui.add(legend, "bottom-right");
      const wrapper = content.current;
      const legendContainer = legend.domNode;
      legendContainer.remove();
      wrapper.append(legendContainer);
      window.legend = legend;
    }
  }, [store, view, ref.current.Legend, title]);

  const toggleButton = (
    <button 
      aria-label={`${open ? 'close' : 'open'} info panel`}
      className="info-panel__close"
      onClick={() => setOpen(!open)}
    >
      x
    </button>
  )

  const style = {
    position: 'absolute', 
    background: "#f5f5f5", 
    height: "calc(100% - 15px)"
  }

  const bodyStyle = {
    padding: '12px',
    margin: '8px',
    background: 'white', 
    minHeight: '100%'
  }

  return (
    <>
      <Drawer
        closable={false}
        onClose={() => setOpen(false)}
        handler={toggleButton}
        placement="right"
        visible={open}
        mask={false}
        width={width}
        getContainer={false}
        style={style}
        bodyStyle={bodyStyle}
        wrapClassName="drawer-root"
      >
        <>
          {children}
          <div ref={content} />
        </>
      </Drawer>
    </>
  )
};

export default LegendPanel;