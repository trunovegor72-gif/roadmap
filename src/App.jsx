import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TopicDetailPage from './pages/TopicDetailPage';
import Header from './components/Header';
import { loadRoadmap, saveRoadmap } from './services/roadmapService';
import './App.css';

function App() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Ref для drag & drop области
  const dropAreaRef = useRef(null);

  // Обработчик перетаскивания файлов
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Проверяем, действительно ли мы вышли из dropArea
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleDroppedFile(files[0]);
      }
    };

    // Добавляем обработчики событий
    dropArea.addEventListener('dragenter', handleDragEnter);
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    // Обработчики для всего документа (для визуальной обратной связи)
    const handleGlobalDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleGlobalDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleGlobalDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    document.addEventListener('dragenter', handleGlobalDragEnter);
    document.addEventListener('dragover', handleGlobalDragOver);
    document.addEventListener('drop', handleGlobalDrop);

    // Очистка
    return () => {
      dropArea.removeEventListener('dragenter', handleDragEnter);
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
      
      document.removeEventListener('dragenter', handleGlobalDragEnter);
      document.removeEventListener('dragover', handleGlobalDragOver);
      document.removeEventListener('drop', handleGlobalDrop);
    };
  }, []);

  // Функция обработки перетащенного файла
  const handleDroppedFile = (file) => {
    if (!file) return;

    // Проверка типа файла
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Пожалуйста, перетащите JSON файл');
      return;
    }

    handleFileUpload({ target: { files: [file] } });
  };

  // Существующий обработчик (немного улучшим)
  const handleFileUpload = (event) => {
    const file = event.target.files ? event.target.files[0] : event;
    if (!file) return;

    setLoading(true);
    setError('');

    // Проверка типа файла
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Пожалуйста, выберите JSON файл');
      setLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsed = loadRoadmap(content);
        setRoadmap(parsed);
      } catch (err) {
        setError(`Ошибка загрузки файла: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Ошибка чтения файла');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  // Обработчик клика по области загрузки
  const handleUploadAreaClick = () => {
    document.getElementById('file-upload').click();
  };

  const handleExport = () => {
    if (!roadmap) {
      alert('Нет данных для экспорта');
      return;
    }
    saveRoadmap(roadmap);
  };

  const updateTopic = (topicId, updates) => {
    setRoadmap(prev => {
      const updatedTopics = prev.topics.map(topic => 
        topic.id === topicId ? { ...topic, ...updates } : topic
      );
      
      return {
        ...prev,
        topics: updatedTopics
      };
    });
  };

  const calculateProgress = () => {
    if (!roadmap || !roadmap.topics.length) return 0;
    
    const completed = roadmap.topics.filter(t => t.status === 'completed').length;
    return Math.round((completed / roadmap.topics.length) * 100);
  };

  return (
    <Router>
      <div className={`app ${isDragging ? 'dragging' : ''}`}>
        <Header 
          progress={calculateProgress()}
          onImport={handleFileUpload}
          onExport={handleExport}
          hasRoadmap={!!roadmap}
          roadmapTitle={roadmap?.title}
        />
        
        <main className="main-content">
          {loading && <div className="loading">Загрузка...</div>}
          {error && <div className="error-message">{error}</div>}
          
          {!roadmap && !loading && (
            <div 
              ref={dropAreaRef}
              className={`welcome-screen ${isDragging ? 'drag-over' : ''}`}
              onClick={handleUploadAreaClick}
            >
              <h2>Добро пожаловать в Tech Tracker!</h2>
              <p>Загрузите дорожную карту в формате JSON для начала работы</p>
              
              <div className="file-upload-area">
                
                <div className="upload-actions">
                  <label htmlFor="file-upload" className="upload-button">
                    Выбрать файл
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".json,.JSON"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                
                <p className="upload-hint">
                  {isDragging 
                    ? 'Отпустите файл для загрузки' 
                    : 'Или перетащите JSON файл сюда'}
                </p>
                
                <div className="upload-requirements">
                  <small>Поддерживается только JSON формат</small>
                </div>
              </div>
              
              {isDragging && (
                <div className="drag-overlay">
                  <div className="drag-message">
                    📥 Отпустите файл для загрузки
                  </div>
                </div>
              )}
            </div>
          )}
          
          <Routes>
            <Route 
              path="/" 
              element={
                roadmap ? (
                  <HomePage roadmap={roadmap} />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
            <Route 
              path="/topic/:topicId" 
              element={
                roadmap ? (
                  <TopicDetailPage 
                    roadmap={roadmap} 
                    updateTopic={updateTopic} 
                  />
                ) : (
                  <Navigate to="/" />
                )
              } 
            />
          </Routes>
        </main>
        
        <footer className="footer">
          <p>Персональный трекер освоения технологий © 2024</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;