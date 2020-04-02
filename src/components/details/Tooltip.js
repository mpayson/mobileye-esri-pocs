import './Tooltip.scss';
import React from 'react';
import { observer } from 'mobx-react';


export const Tooltip = observer(({children, store, xMin=0, xMax=window.innerWidth}) => {
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

  const width = 220;
  const mid = width / 2;
  const pad = 10;
  let left;
  if (x > xMin + mid + pad) {
    if (x + mid + pad < xMax) {
      left = x - mid;
    } else {
      left = xMax - pad - width;
    }
  } else {
    left = xMin + pad;
  }

  const top = y > 67 ? y - 65 : y + 10;

  return (
    <div className="details-tooltip" style={{left, top}} >
      {children}
    </div>
  );
});