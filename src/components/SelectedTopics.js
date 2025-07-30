import React, { useState, useRef } from 'react';

const SelectedTopics = ({
  selectedTopics,
  removeTopic,
  topicCategories,
  isMerging,
  progress,
  statusMessage,
  mergeTemplates,
  onReorderTopics // Add this new prop for reordering
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    if (isMerging) {
      e.preventDefault();
      return;
    }
    
    console.log('Drag start:', index);
    setDraggedIndex(index);
    
    // Set the data transfer
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Use a simple approach for the drag image
    try {
      // Create a simple drag image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 40;
      
      // Draw a simple rectangle representing the item
      ctx.fillStyle = '#f6f8fa';
      ctx.fillRect(0, 0, 200, 40);
      ctx.strokeStyle = '#0969da';
      ctx.strokeRect(0, 0, 200, 40);
      ctx.fillStyle = '#24292f';
      ctx.font = '14px Arial';
      ctx.fillText('Moving item...', 10, 25);
      
      // Convert canvas to image and use as drag image
      const img = new Image();
      img.src = canvas.toDataURL();
      e.dataTransfer.setDragImage(img, 100, 20);
    } catch (error) {
      console.log('Using default drag image');
      // Fallback to invisible drag image if canvas fails
      const dragImage = new Image();
      dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
      e.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== index) {
      console.log('Drag enter:', index);
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear drag over if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    console.log('Drop at:', dropIndex, 'from:', draggedIndex);
    
    setDragOverIndex(null);

    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorderTopics) {
      const newOrder = [...selectedTopics];
      const draggedItem = newOrder[draggedIndex];
      
      // Remove the dragged item
      newOrder.splice(draggedIndex, 1);
      
      // Insert it at the new position
      newOrder.splice(dropIndex, 0, draggedItem);
      
      console.log('Reordering from', draggedIndex, 'to', dropIndex);
      onReorderTopics(newOrder);
    }
    
    setDraggedIndex(null);
  };

  const handleDragEnd = (e) => {
    console.log('Drag end');
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveTemplate = (fromIndex, direction) => {
    if (isMerging || !onReorderTopics) return;
    
    console.log('Moving template:', fromIndex, direction);
    const newIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (newIndex >= 0 && newIndex < selectedTopics.length) {
      const newOrder = [...selectedTopics];
      const item = newOrder[fromIndex];
      newOrder.splice(fromIndex, 1);
      newOrder.splice(newIndex, 0, item);
      onReorderTopics(newOrder);
      console.log('Template moved from', fromIndex, 'to', newIndex);
    } else {
      console.log('Cannot move: out of bounds');
    }
  };

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
          <div className="selected-templates-list">
            {selectedTopics.map((topic, index) => (
              <div
                key={`${topic.id}_${index}`}
                className={`selected-template-item ${
                  draggedIndex === index ? 'dragging' : ''
                } ${
                  dragOverIndex === index ? 'drag-over' : ''
                }`}
                draggable={!isMerging}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#fff',
                  border: dragOverIndex === index ? '2px solid #0969da' : '1px solid #e1e5e9',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginBottom: '6px',
                  transition: draggedIndex === index ? 'none' : 'all 0.2s ease',
                  cursor: isMerging ? 'default' : 'grab',
                  opacity: draggedIndex === index ? 0.5 : 1,
                  transform: dragOverIndex === index && draggedIndex !== index ? 'translateY(-2px)' : 'none',
                  backgroundColor: dragOverIndex === index ? '#f6f8fa' : '#fff',
                  boxShadow: dragOverIndex === index ? '0 4px 12px rgba(9, 105, 218, 0.15)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
                  userSelect: 'none',
                  minHeight: '44px',
                  position: 'relative',
                  // Ensure dragging works
                  WebkitUserDrag: !isMerging ? 'element' : 'none',
                  // Prevent the dragged item from bouncing around
                  ...(draggedIndex === index && {
                    zIndex: 1000
                  })
                }}
              >
                {/* Drop indicator line */}
                {dragOverIndex === index && draggedIndex !== null && draggedIndex !== index && (
                  <div style={{
                    position: 'absolute',
                    top: draggedIndex < index ? '100%' : '-2px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    backgroundColor: '#0969da',
                    borderRadius: '1px',
                    zIndex: 10
                  }} />
                )}

                {/* Drag Handle */}
                <div 
                  className="drag-handle"
                  draggable={false} // Prevent the handle itself from being draggable
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '10px',
                    color: draggedIndex === index ? '#0969da' : '#8b949e',
                    cursor: isMerging ? 'default' : (draggedIndex === index ? 'grabbing' : 'grab'),
                    padding: '6px',
                    borderRadius: '4px',
                    transition: draggedIndex === index ? 'none' : 'all 0.2s ease',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: draggedIndex === index ? '#f6f8fa' : 'transparent',
                    border: draggedIndex === index ? '1px solid #0969da' : '1px solid transparent',
                    userSelect: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMerging && draggedIndex !== index) {
                      e.target.style.backgroundColor = '#f6f8fa';
                      e.target.style.color = '#0969da';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMerging && draggedIndex !== index) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#8b949e';
                    }
                  }}
                >
                  ⋮⋮
                </div>
                
                {/* Template Content - Compact */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    background: '#0969da',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    textTransform: 'capitalize',
                    marginRight: '8px'
                  }}>
                    {topic.category}
                  </span>
                  <span style={{
                    color: '#8b949e',
                    fontWeight: '500',
                    fontSize: '14px',
                    marginRight: '8px'
                  }}>/</span>
                  <span style={{
                    fontWeight: '400',
                    color: '#24292f',
                    flex: 1,
                    wordBreak: 'break-word',
                    fontSize: '14px',
                    lineHeight: '1.3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {topic.title}
                  </span>
                </div>

                {/* Template Controls - Compact */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: '12px'
                }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Up button clicked for index:', index);
                      moveTemplate(index, 'up');
                    }}
                    disabled={index === 0 || isMerging}
                    title="Move up"
                    style={{
                      background: 'none',
                      border: '1px solid #d0d7de',
                      borderRadius: '4px',
                      padding: '4px 6px',
                      cursor: (index === 0 || isMerging) ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      minWidth: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: (index === 0 || isMerging) ? 0.4 : 1,
                      color: '#24292f'
                    }}
                    onMouseEnter={(e) => {
                      if (index !== 0 && !isMerging) {
                        e.target.style.backgroundColor = '#f6f8fa';
                        e.target.style.borderColor = '#0969da';
                        e.target.style.color = '#0969da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== 0 && !isMerging) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.borderColor = '#d0d7de';
                        e.target.style.color = '#24292f';
                      }
                    }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Down button clicked for index:', index);
                      moveTemplate(index, 'down');
                    }}
                    disabled={index === selectedTopics.length - 1 || isMerging}
                    title="Move down"
                    style={{
                      background: 'none',
                      border: '1px solid #d0d7de',
                      borderRadius: '4px',
                      padding: '4px 6px',
                      cursor: (index === selectedTopics.length - 1 || isMerging) ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      minWidth: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: (index === selectedTopics.length - 1 || isMerging) ? 0.4 : 1,
                      color: '#24292f'
                    }}
                    onMouseEnter={(e) => {
                      if (index !== selectedTopics.length - 1 && !isMerging) {
                        e.target.style.backgroundColor = '#f6f8fa';
                        e.target.style.borderColor = '#0969da';
                        e.target.style.color = '#0969da';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== selectedTopics.length - 1 && !isMerging) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.borderColor = '#d0d7de';
                        e.target.style.color = '#24292f';
                      }
                    }}
                  >
                    ↓
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeTopic(topic.id);
                    }}
                    title="Remove template"
                    disabled={isMerging}
                    style={{
                      background: 'none',
                      border: '1px solid #cf222e',
                      borderRadius: '4px',
                      padding: '4px 6px',
                      cursor: isMerging ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      minWidth: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#cf222e',
                      opacity: isMerging ? 0.4 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isMerging) {
                        e.target.style.backgroundColor = '#cf222e';
                        e.target.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMerging) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#cf222e';
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTopics.length > 0 && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: '#f6f8fa',
          borderRadius: '6px',
          borderLeft: '3px solid #0969da'
        }}>
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#24292f',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '14px' }}>💡</span>
            Drag templates to reorder them, or use the arrow buttons. The order will be preserved in the merged document.
          </p>
        </div>
      )}
      
      {isMerging && (
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
        className="merge-btn"
        onClick={mergeTemplates}
        disabled={isMerging || selectedTopics.length === 0}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: isMerging ? '#ccc' : '#FF6B00',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: isMerging ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease'
        }}
      >
        {isMerging ? '⏳ Merging Templates...' : '🚀 Merge Templates'}
      </button>
    </div>
  );
};

export default SelectedTopics;
