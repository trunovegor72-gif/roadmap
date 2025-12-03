import React from 'react';
import '../App.css';

function ProgressBar({ progress }) {
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ProgressBar;