import React from 'react';

const SelectedTopics = ({
  selectedTopics,
  removeTopic,
  topicCategories,
  isGenerating,
  progress,
  statusMessage,
  generateProposal
}) => {
  // Group topics by category
  const groupedSelectedTopics = selectedTopics.reduce((acc, topic) => {
    const category = topic.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(topic);
    return acc;
  }, {});

  return (
    <div className="section full-width">
      <h2>
        <span className="section-icon">✅</span>
        Selected Templates ({selectedTopics.length} documents)
      </h2>
      
      <div className="selected-topics">
        {selectedTopics.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>
            No templates selected yet. Click on checkboxes in the tree above to add them.
          </p>
        ) : (
          Object.entries(groupedSelectedTopics).map(([category, topics]) => (
            <div key={category} style={{ marginBottom: '15px' }}>
              <h4 style={{ color: '#4CAF50', marginBottom: '8px', fontSize: '0.9rem' }}>
                {(topicCategories[category]?.icon || '📁')} {category}
              </h4>
              {topics.map(topic => {
                return (
                  <div key={topic.id} className="selected-topic">
                    <div>
                      <strong>{topic.title}</strong>
                      <span style={{ color: '#666', marginLeft: '10px' }}>{topic.version}</span>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeTopic(topic.id)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
      
      {isGenerating && (
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {statusMessage.visible && (
        <div className={`status-message ${statusMessage.type}`}>
          <div dangerouslySetInnerHTML={{ __html: statusMessage.text }} />
        </div>
      )}
      
      <button 
        className="generate-btn"
        onClick={generateProposal}
        disabled={isGenerating || selectedTopics.length === 0}
      >
        {isGenerating ? '⏳ Generating Proposal...' : '🚀 Generate Proposal'}
      </button>
    </div>
  );
};

export default SelectedTopics;
