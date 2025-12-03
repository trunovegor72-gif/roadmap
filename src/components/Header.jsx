import React from 'react';
import ProgressBar from './ProgressBar';
import '../App.css';

function Header({ progress, onImport, onExport, hasRoadmap, roadmapTitle }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1>RoadMap</h1>
          {roadmapTitle && (
            <p className="roadmap-title">{roadmapTitle}</p>
          )}
        </div>
        
        <div className="controls">
          {hasRoadmap && (
            <>
              <ProgressBar progress={progress} />
              <div className="progress-text">{progress}% завершено</div>
            </>
          )}
          
          <div className="button-group">
            <label className="button button-secondary">
              Импорт
              <input
                type="file"
                accept=".json"
                onChange={onImport}
                style={{ display: 'none' }}
              />
            </label>
            
            {hasRoadmap && (
              <button 
                className="button button-primary"
                onClick={onExport}
              >
                Экспорт прогресса
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;