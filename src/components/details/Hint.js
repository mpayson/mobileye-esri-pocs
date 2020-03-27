import React from 'react';
import './Hint.scss';
import pointerImage from '../../resources/images/hand-01.png';


export function Hint() {
  return (
    <div className="details-panel__hint">
      <img 
        className="details-panel__icon"
        src={pointerImage} 
        alt="a mouse-pointer icon" 
      />
      <div className="details-panel__hint-text">
        Select an object/road segment to see more
      </div>
    </div>
  );
}