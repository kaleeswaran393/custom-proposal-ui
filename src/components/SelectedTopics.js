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
          selectedTopics.map((topic, index) => (
            <div key={`${topic.id}_${index}`} style={{ marginBottom: '15px' }}>
              <h4 style={{ color: '#4CAF50', marginBottom: '8px', fontSize: '0.9rem' }}>
                {(topicCategories[topic.category]?.icon || '📁')} {topic.category}
              </h4>
              <div className="selected-topic">
                <div>
                  <strong>{topic.title}</strong>
                  <span style={{ color: '#666', marginLeft: '10px' }}>{topic.lastUpdated}</span>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeTopic(topic.id)}
                  title="Remove from selection"
                  disabled={isGenerating}
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {isGenerating && (
        <div className="progress-container" style={{ margin: '20px 0' }}>
          <div className="progress-bar" style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#FF6B00',
                transition: 'width 0.3s ease',
                borderRadius: '4px'
              }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '0.9rem', color: '#666' }}>
            {progress}% Complete
          </div>
        </div>
      )}
      
      {statusMessage.visible && (
        <div className={`status-message ${statusMessage.type}`} style={{
          padding: '12px',
          borderRadius: '6px',
          margin: '15px 0',
          backgroundColor: statusMessage.type === 'success' ? '#d4edda' : 
                          statusMessage.type === 'error' ? '#f8d7da' : '#d1ecf1',
          borderColor: statusMessage.type === 'success' ? '#c3e6cb' : 
                      statusMessage.type === 'error' ? '#f5c6cb' : '#bee5eb',
          color: statusMessage.type === 'success' ? '#155724' : 
                statusMessage.type === 'error' ? '#721c24' : '#0c5460'
        }}>
          <div dangerouslySetInnerHTML={{ __html: statusMessage.text }} />
        </div>
      )}
      
      <button 
        className="generate-btn"
        onClick={generateProposal}
        disabled={isGenerating || selectedTopics.length === 0}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: isGenerating ? '#ccc' : '#FF6B00',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease'
        }}
      >
        {isGenerating ? '⏳ Generating Proposal...' : '🚀 Generate Proposal'}
      </button>
    </div>
  );
};

export default SelectedTopics;
