import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {loadModules} from 'esri-loader';
import options from '../config/esri-loader-options';


const LegendPanel = ({store, view, children}) => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef({
    Legend: null,
    portal: null,
  });

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
        layerInfos: [{layer: store.lyr, title: "Assets"}],
      });
      view.ui.add(legend, "bottom-right");
      ref.current.portal = expandLegend(legend);
      setLoaded(true);
    }
  }, [store, view, ref.current.Legend]);

  return loaded ? ReactDOM.createPortal((
    <>
      {children}
    </>
  ), ref.current.portal) : null;
};

function expandLegend(legend) {
  const portal = document.createElement('div');
  const style = portal.style;

  style.height = '100px';
  style.background = 'white';
  style.margin = '8px';
  style.borderRadius = '5px';

  legend.container.prepend(portal);
  // legend.className += ' info-panel'
  legend.domNode.classList = ['info-panel']
  legend.domNode.className = 'info-panel';
  return portal;
}

export default LegendPanel;