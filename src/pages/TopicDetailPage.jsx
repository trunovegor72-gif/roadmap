import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';

function TopicDetailPage({ roadmap, updateTopic }) {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = roadmap.topics.find(t => t.id === topicId);
  
  const [notes, setNotes] = useState(topic?.userNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!topic) {
    return (
      <div className="topic-detail">
        <div className="not-found">
          <h2>Тема не найдена</h2>
          <button onClick={() => navigate('/')}>Вернуться на главную</button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateTopic(topicId, { status: newStatus });
  };

  const handleSaveNotes = () => {
    updateTopic(topicId, { userNotes: notes });
    setIsEditingNotes(false);
  };

  const handleTargetDateChange = (e) => {
    updateTopic(topicId, { targetDate: e.target.value || null });
  };

  return (
    <div className="topic-detail">
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Назад к карте
      </button>

      <div className="topic-header">
        <h1>{topic.title}</h1>
        <div className="status-controls">
          <span>Статус:</span>
          {['not_started', 'in_progress', 'completed'].map(status => (
            <button
              key={status}
              className={`status-button ${topic.status === status ? 'active' : ''}`}
              onClick={() => handleStatusChange(status)}
            >
              {status === 'completed' ? '✓ Выполнено' : 
               status === 'in_progress' ? '⟳ В работе' : '○ Не начат'}
            </button>
          ))}
        </div>
      </div>

      <div className="topic-content">
        <section className="description-section">
          <h3>Описание</h3>
          <p>{topic.description}</p>
        </section>

        <section className="notes-section">
          <div className="section-header">
            <h3>Мои заметки</h3>
            {!isEditingNotes && (
              <button 
                className="edit-button"
                onClick={() => setIsEditingNotes(true)}
              >
                {notes ? 'Редактировать' : 'Добавить заметки'}
              </button>
            )}
          </div>
          
          {isEditingNotes ? (
            <div className="notes-editor">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Добавьте ваши заметки, конспекты, полезные команды..."
                rows={6}
              />
              <div className="editor-actions">
                <button onClick={handleSaveNotes}>Сохранить</button>
                <button 
                  className="cancel-button"
                  onClick={() => {
                    setNotes(topic.userNotes || '');
                    setIsEditingNotes(false);
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="notes-display">
              {notes ? (
                <p>{notes}</p>
              ) : (
                <p className="no-notes">Заметок пока нет. Добавьте свои мысли и идеи!</p>
              )}
            </div>
          )}
        </section>

        <section className="resources-section">
          <h3>Ресурсы и ссылки</h3>
          {topic.links && topic.links.length > 0 ? (
            <ul className="links-list">
              {topic.links.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    🔗 {link.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Ссылки не указаны</p>
          )}
        </section>

        <section className="planning-section">
          <h3>Планирование</h3>
          <div className="date-picker">
            <label>Целевая дата завершения:</label>
            <input
              type="date"
              value={topic.targetDate || ''}
              onChange={handleTargetDateChange}
            />
          </div>
          {topic.targetDate && (
            <p className="date-info">
              Запланировано на {new Date(topic.targetDate).toLocaleDateString('ru-RU')}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default TopicDetailPage;