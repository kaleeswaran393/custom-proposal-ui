import React from 'react';
import './TopicSelector.css';  // Make sure to create this CSS file

const TopicSelector = ({
  topicCategories,
  selectedTopics,
  expandedCategories,
  toggleCategory,
  selectAllInCategory,
  toggleTopic
}) => {
  return (
    <div className="section">
      <h2>
        <span className="section-icon">📚</span>
        Available Templates
      </h2>
      
      <div className="tree-view">
        {Object.entries(topicCategories).map(([categoryName, categoryData]) => {
          const selectedInCategory = categoryData.topics.filter(topic => 
            selectedTopics.some(selected => selected.id === topic.id)
          ).length;

          return (
            <div key={categoryName} className="tree-category">
              <div 
                className={`category-header ${expandedCategories.has(categoryName) ? 'expanded' : ''}`}
                onClick={() => toggleCategory(categoryName)}
              >
                <div className="category-header-left">
                  <span className="category-name">{categoryName}</span>
                  <span className="template-count">
                    ({categoryData.topics.length} templates)
                  </span>
                </div>
                <div className="category-header-right">
                  <button 
                    className="select-all-btn"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      selectAllInCategory(categoryName); 
                    }}
                  >
                    {selectedInCategory === categoryData.topics.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="expand-icon">
                    {expandedCategories.has(categoryName) ? '▼' : '▶'}
                  </span>
                </div>
              </div>
              
              {expandedCategories.has(categoryName) && (
                <div className="category-content expanded">
                  {categoryData.topics.map(topic => (
                    <div 
                      key={topic.id}
                      className="topic-item"
                      onClick={() => toggleTopic(topic.id)}
                    >
                      <div className={`topic-checkbox ${
                        selectedTopics.some(selected => selected.id === topic.id) ? 'checked' : ''
                      }`}>
                        {selectedTopics.some(selected => selected.id === topic.id) && '✓'}
                      </div>
                      <div className="topic-info">
                        <div className="topic-title">{topic.title}</div>
                      </div>
                      <div className="topic-meta">
                        <div className="version-info">
                          <span className="last-updated">Updated: {topic.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicSelector;
