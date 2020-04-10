import './Tooltip.scss';
import React, { useRef, useState, useEffect } from 'react';
import { observer } from 'mobx-react';

const MIN_WIDTH = 200;


export const Tooltip = observer(({children, store, xMin=0, xMax=window.innerWidth}) => {
  const ref = useRef(null);
  const [width, setWidth] = useState(MIN_WIDTH);

  useEffect(() => {
    const el = ref.current;
    if (el && ResizeObserver) {
      const observer = new ResizeObserver(payload => {
        if (payload[0]) {
          const dims = payload[0].contentRect;
          const newWidth = Math.max(dims.width + dims.x * 2, MIN_WIDTH) || MIN_WIDTH;
          setWidth(newWidth);
        }
      });
      observer.observe(el);
      return () => {
        observer.unobserve(el);
        observer.disconnect();
      };
    }
  }, [ref]);

  const results = store.hoverResults;
  let x, y;
  if (results) {
    const p = results.screenPoint
    x = p.x;
    y = p.y;
  } else {
    x = -1000;
    y = -1000;
  }

  const mid = width / 2;
  const pad = 1;
  let left, pointerLeft;
  if (x > xMin + mid + pad) {
    if (x + mid + pad < xMax) {
      left = x - mid;
      pointerLeft = x - left - 5
    } else {
      left = xMax - pad - width;
      pointerLeft = Math.min(width - 12, x - left - 5);
    }
  } else {
    left = xMin + pad;
    pointerLeft = Math.max(2, x - left - 5);
  }

  const height = 57;
  let top, pointerTop;
  if (y > height + 15) {
    top = y - height - 15;
    pointerTop = height - 5;
  } else {
    top = y + 30;
    pointerTop = -5;
  }

  return (
    <div className="details-tooltip" style={{left, top}} ref={ref} >
      <div 
        className="details-pointer" 
        style={{left: pointerLeft, top: pointerTop}} 
      />
      {children}
    </div>
  );
});