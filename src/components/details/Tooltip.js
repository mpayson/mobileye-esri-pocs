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
    x = Math.round(p.x);
    y = Math.round(p.y);
  } else {
    x = -1000;
    y = -1000;
  }

  const midWidth = width / 2;
  const minDistToSides = 30;
  let left, right, top, arrowLeft, arrowRight, arrowTop;
  let arrow = 'vertical';

  if (x - xMin > midWidth) {

    if (midWidth < xMax - x) {
      left = x - midWidth;
      arrowLeft = x - left - 5;

    // left from mouse pointer
    } else if (xMax - x < minDistToSides) {
      const canvasWidth = window.innerWidth - 80;
      right = canvasWidth - x + 25;
      arrowRight = - 5;
      arrow = 'horrizontal';

    // close to the right border, but not too tight
    } else {
      left = xMax - width - minDistToSides / 2;
      arrowLeft = Math.min(width - 12, x - left - 5);
    }

  // right from mouse pointer
  } else if (x - xMin < minDistToSides) {
    left = x + 20;
    arrowLeft = -5;
    arrow = 'horrizontal';

  // close to the left border, but not too tight
  } else {
    left = xMin + minDistToSides / 2;
    arrowLeft = Math.max(2, x - left - 5);
  }

  const height = 58;
  if (arrow === 'vertical') {
    if (y > height + 15) {
      top = y - height - 15;
      arrowTop = height - 5;
    } else {
      top = y + 30;
      arrowTop = -5;
    }
  } else {
    const yMax = window.innerHeight - height - 68;
    top = Math.max(Math.min(y - height / 2, yMax), 2)
    arrowTop = Math.max(y - top - 2, 3);
  }

  return (
    <div className="details-tooltip" style={{left, right, top}} ref={ref} >
      <div 
        className={`details-arrow ${arrow}`}
        style={{left: arrowLeft, right: arrowRight, top: arrowTop}} 
      />
      {children}
    </div>
  );
});
