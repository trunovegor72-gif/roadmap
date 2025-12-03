import React from 'react';
import RoadmapGrid from '../components/RoadmapGrid';
import '../App.css';

function HomePage({ roadmap }) {
  const getStatusCount = (status) => {
    return roadmap.topics.filter(topic => topic.status === status).length;
  };

  // Рассчитываем прогресс
  const totalTopics = roadmap.topics.length;
  const completedTopics = getStatusCount('completed');
  const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="home-page">
      <div className="roadmap-header">
        <h2>{roadmap.title}</h2>
        <p className="roadmap-description">{roadmap.description}</p>
        
        <div className="progress-summary">
          <div className="progress-info">
            <span className="progress-percentage">{progressPercentage}%</span>
            <span className="progress-label">Общий прогресс</span>
          </div>
        </div>
      </div>
      
      <div className="stats-summary">
        <div className="stat">
          <span className="stat-number">{totalTopics}</span>
          <span className="stat-label">Всего тем</span>
        </div>
        <div className="stat">
          <span className="stat-number" style={{ color: '#10b981' }}>
            {completedTopics}
          </span>
          <span className="stat-label">Завершено</span>
        </div>
        <div className="stat">
          <span className="stat-number" style={{ color: '#f59e0b' }}>
            {getStatusCount('in_progress')}
          </span>
          <span className="stat-label">В работе</span>
        </div>
        <div className="stat">
          <span className="stat-number" style={{ color: '#9ca3af' }}>
            {getStatusCount('not_started')}
          </span>
          <span className="stat-label">Не начато</span>
        </div>
      </div>
      
      <RoadmapGrid topics={roadmap.topics} />
    </div>
  );
}

export default HomePage;