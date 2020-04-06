import React, { useEffect, useRef, useState } from 'react';
import {loadModules} from 'esri-loader';
import options from '../../config/esri-loader-options';
import './DetailsPanel.scss';
import { Drawer } from 'antd';
import { observer } from 'mobx-react';
import arrowPng from '../../resources/images/arrow_ticker-01.png';

export const SectionTitle = ({children}) => (
  <h3 style={{fontSize: '16px', fontWeight: 600}} >
    {children}
  </h3>
);

const DetailsPanel = observer((props) => {
  const {store, view, children, width, title=null, 
    onMountOpen=false, layerInfos=null, onOpen} = props;
  const [loadedWidget, setLoadedWidget] = useState(false);
  const [injected, setInjected] = useState(false)
  const [open, setOpen] = useState(onMountOpen);
  const ref = useRef({
    Legend: null,
    portal: null,
  });
  const content = useRef(null);

  useEffect(() => {
    loadModules(['esri/widgets/Legend'], options).then(([Legend]) => {
      ref.current.Legend = Legend
      setLoadedWidget(true);
    });
  }, []);
  
  useEffect(() => {
    const Legend = ref.current.Legend;
    if (loadedWidget && !injected) {
      if (view && Legend) {
        const legend = new Legend({
          view,
          layerInfos: layerInfos || [{layer: store.lyr, title}],
        });
        view.ui.add(legend, "bottom-right");
        const wrapper = content.current;
        const legendContainer = legend.domNode;
        legendContainer.remove();
        wrapper.append(legendContainer);
        setInjected(true);
      }
    }
  }, [store, view, title, layerInfos, injected, loadedWidget]);

  useEffect(() => {
    if (store.clickResults) {
      setOpen(true);
    }
  }, [store, store.clickResults]);

  useEffect(() => {
    if (onOpen) {
      onOpen(open)
    }
  }, [open, onOpen]);

  const toggleButton = (
    <button 
      aria-label={`${open ? 'close' : 'open'} info panel`}
      className="details-panel__close"
      onClick={() => setOpen(!open)}
      >
      <img 
        src={arrowPng} 
        alt="open/close details panel" 
        width={9.5} 
        height={10.5} 
        style={{transform: open ? 'none' : 'rotate(-180deg)'}}
      />
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
    minHeight: '100%',
    borderRadius: '5px',
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
        className="details-panel"
      >
        <>
          {children}
          <hr className="details-panel__separator" />
          <div ref={content} />
        </>
      </Drawer>
    </>
  )
});

export default DetailsPanel;