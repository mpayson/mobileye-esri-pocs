import React from 'react';
import ReactDOM from 'react-dom';

export function SurveyInfoPanel({root}) {
  const content = (
    <div>
      This is my stuff
      <p>I can render here whatever I want...</p>
    </div>
  );
  return ReactDOM.createPortal(content, root);
}