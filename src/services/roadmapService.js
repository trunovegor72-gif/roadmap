export const loadRoadmap = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    
    // Валидация структуры
    if (!data.title || !Array.isArray(data.topics)) {
      throw new Error('Неверный формат дорожной карты');
    }
    
    // Инициализация пользовательских полей
    const topics = data.topics.map(topic => ({
      ...topic,
      status: topic.status || 'not_started',
      userNotes: topic.userNotes || '',
      targetDate: topic.targetDate || null
    }));
    
    return {
      ...data,
      topics
    };
  } catch (error) {
    throw new Error(`Ошибка загрузки дорожной карты: ${error.message}`);
  }
};

export const saveRoadmap = (roadmap) => {
  try {
    const dataStr = JSON.stringify(roadmap, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tech-tracker-${roadmap.id}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Ошибка экспорта:', error);
    alert('Ошибка при экспорте файла');
  }
};