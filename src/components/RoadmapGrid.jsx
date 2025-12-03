import React from 'react';
import { useNavigate } from 'react-router-dom';

function RoadmapGrid({ topics }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      default: return '#9ca3af';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Выполнено';
      case 'in_progress': return 'В работе';
      default: return 'Не начат';
    }
  };

  return (
    <div className="roadmap-grid">
      {topics.map(topic => (
        <div 
          key={topic.id}
          className={`roadmap-card ${topic.status}`}
          onClick={() => navigate(`/topic/${topic.id}`)}
        >
          <div className="card-header">
            <span 
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(topic.status) }}
            >
              {topic.status === 'completed' ? '✓' : 
               topic.status === 'in_progress' ? '⟳' : '○ '} 
              {getStatusText(topic.status)}
            </span>
            {topic.targetDate && (
              <span className="date-badge">
                📅 {new Date(topic.targetDate).toLocaleDateString('ru-RU')}
              </span>
            )}
          </div>
          
          <h3 className="card-title">{topic.title}</h3>
          
          <p className="card-description">
            {topic.description.length > 100 
              ? `${topic.description.substring(0, 100)}...` 
              : topic.description}
          </p>
          
          <div className="card-footer">
            {topic.links && topic.links.length > 0 && (
              <span className="links-count">
                🔗 {topic.links.length} ссылок
              </span>
            )}
            
            {topic.userNotes && (
              <span className="notes-indicator">
                📝 Заметки
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoadmapGrid;