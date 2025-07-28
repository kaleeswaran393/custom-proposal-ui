import React, { useState, useEffect } from 'react';
import { templateService } from '../services/templateService';
import './TopicSelector.css';

const TopicSelector = ({
  selectedTopics,
  expandedCategories,
  toggleCategory,
  selectAllInCategory,
  toggleTopic,
  topicCategories,        // <-- Add this prop
  setTopicCategories      // <-- Add this prop
}) => {
  // Remove local topicCategories state
  // const [topicCategories, setTopicCategories] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      let data;
      try {
        data = await templateService.getTemplatesStructure();
      } catch (error) {
        console.warn('Falling back to mock data:', error);
        data = templateService.getMockTemplates();
      }
      const formattedData = formatTemplateData(data);
      setTopicCategories(formattedData); // <-- Use prop function instead of local state
    } catch (error) {
      setError('Failed to load templates because the service is unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatTemplateData = (data) => {
    return data.reduce((acc, category) => {
      acc[category.name] = {
        icon: getCategoryIcon(category.name),
        topics: category.children?.map(file => ({
          id: `${category.name}_${file.name.replace('.docx', '')}`, // Make ID unique by adding category
          title: file.name.replace('.docx', ''),
          fileName: file.name,
          category: category.name,
          lastUpdated: formatDate(file.lastModified)
        })) || []
      };
      return acc;
    }, {});
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      '1.Title': '📝',
      '2.Application': '📄',
      '3.Cloud': '☁️',
      '4.SAP': '💼',
      '5.Security': '🔒',
      '6.Network': '🌐'
    };
    return icons[categoryName] || '📁';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to check if a topic is selected
  const isTopicSelected = (topicId) => {
    return selectedTopics.some(selected => selected.id === topicId);
  };

  // Handle checkbox click
  const handleCheckboxChange = (e, topic) => {
    e.stopPropagation();
    toggleTopic(topic); // Pass the full topic object
  };

  // Handle row click (optional: also toggles selection)
  const handleTopicRowClick = (topic) => {
    toggleTopic(topic); // Pass the full topic object
  };

  // Handle select all
  const handleSelectAllCategory = (e, categoryName) => {
    e.stopPropagation();
    const categoryTopics = topicCategories[categoryName]?.topics || [];
    const topicObjects = categoryTopics.map(topic => ({
      ...topic,
      category: categoryName // Ensure category is set correctly
    }));
    selectAllInCategory(categoryName, topicObjects);
  };

  if (loading) return <div className="loading">Loading templates...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="section">
      <h2>
        <span className="section-icon">📚</span>
        Available Templates
      </h2>
      <div className="tree-view">
        {Object.entries(topicCategories).map(([categoryName, categoryData]) => {
          const selectedInCategory = categoryData.topics.filter(topic =>
            isTopicSelected(topic.id)
          ).length;

          return (
            <div key={categoryName} className="tree-category">
              <div
                className={`category-header ${expandedCategories.has(categoryName) ? 'expanded' : ''}`}
                onClick={() => toggleCategory(categoryName)}
                style={{ cursor: 'pointer' }}
              >
                <div className="category-header-left">
                  <span className="category-icon">{categoryData.icon}</span>
                  <span className="category-name">{categoryName}</span>
                  <span className="template-count">
                    ({selectedInCategory}/{categoryData.topics.length} templates)
                  </span>
                </div>
                <div className="category-header-right">
                  <button
                    className="select-all-btn"
                    onClick={(e) => handleSelectAllCategory(e, categoryName)}
                  >
                    {selectedInCategory === categoryData.topics.length && categoryData.topics.length > 0 ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="expand-icon">
                    {expandedCategories.has(categoryName) ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {expandedCategories.has(categoryName) && (
                <div className="category-content expanded">
                  {categoryData.topics.map(topic => {
                    const checked = isTopicSelected(topic.id);
                    return (
                      <div
                        key={topic.id}
                        className={`topic-item${checked ? ' selected' : ''}`}
                        onClick={() => handleTopicRowClick(topic)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={checked}
                      >
                        {/* Remove this input checkbox */}
                        {/* <input
                          type="checkbox"
                          className="topic-checkbox-input"
                          checked={checked}
                          onChange={e => handleCheckboxChange(e, topic)}
                          onClick={e => e.stopPropagation()}
                          tabIndex={-1}
                          aria-label={`Select ${topic.title}`}
                        /> */}
                        
                        {/* Keep only this custom checkbox */}
                        <div className={`topic-checkbox${checked ? ' checked' : ''}`}>
                          {checked && '✓'}
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
                    );
                  })}
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
