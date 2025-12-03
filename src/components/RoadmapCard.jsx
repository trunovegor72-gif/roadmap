import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function RoadmapCard({ topic }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { class: 'completed', label: 'Выполнено', icon: '✓' };
      case 'in_progress':
        return { class: 'in-progress', label: 'В работе', icon: '⟳' };
      default:
        return { class: 'not-started', label: 'Не начат', icon: '○' };
    }
  };

  const statusInfo = getStatusInfo(topic.status);

  return (
    <Link to={`/topic/${topic.id}`} className="roadmap-card-link">
      <div className={`roadmap-card ${statusInfo.class}`}>
        <div className="card-header">
          <span className="status-indicator">
            {statusInfo.icon} {statusInfo.label}
          </span>
          {topic.targetDate && (
            <span className="date-badge">
              📅 {new Date(topic.targetDate).toLocaleDateString('ru-RU')}
            </span>
          )}
        </div>
        
        <h3 className="card-title">{topic.title}</h3>
        
        <p className="card-description">
          {topic.description.substring(0, 100)}
          {topic.description.length > 100 ? '...' : ''}
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
    </Link>
  );
}

export default RoadmapCard;