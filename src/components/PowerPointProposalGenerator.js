import React, { useState } from 'react';
import ClientInformation from './ClientInformation';
import TopicSelector from './TopicSelector';
import SelectedTopics from './SelectedTopics';
import { topicCategories } from '../data/topicData';
import './PowerPointProposalGenerator.css';

const PowerPointProposalGenerator = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [clientLogoFile, setClientLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [tenderName, setTenderName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '', visible: false });

  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showStatus('Please select a valid image file (PNG, JPG, SVG).', 'error');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showStatus('File size must be less than 5MB.', 'error');
      return;
    }

    setClientLogoFile(file);
    const reader = new FileReader();
    
    reader.onload = function(e) {
      setLogoPreview({
        src: e.target.result,
        name: file.name,
        size: (file.size / 1024).toFixed(1)
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Remove uploaded logo
  const removeLogo = () => {
    setClientLogoFile(null);
    setLogoPreview(null);
  };

  // Toggle category expansion
  const toggleCategory = (categoryName) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  // Select/deselect all topics in a category
  const selectAllInCategory = (categoryName) => {
    const categoryData = topicCategories[categoryName];
    const selectedInCategory = categoryData.topics.filter(topic => 
      selectedTopics.some(selected => selected.id === topic.id)
    );
    
    if (selectedInCategory.length === categoryData.topics.length) {
      // Deselect all in category
      setSelectedTopics(prev => prev.filter(selected => 
        !categoryData.topics.some(topic => topic.id === selected.id)
      ));
    } else {
      // Select all in category
      setSelectedTopics(prev => {
        const newSelected = [...prev];
        categoryData.topics.forEach(topic => {
          if (!newSelected.some(selected => selected.id === topic.id)) {
            newSelected.push({...topic, category: categoryName});
          }
        });
        return newSelected;
      });
    }
  };

  // Toggle individual topic selection
  const toggleTopic = (topicId) => {
    const index = selectedTopics.findIndex(t => t.id === topicId);
    
    if (index === -1) {
      // Find the topic in categories and add it
      for (const [categoryName, categoryData] of Object.entries(topicCategories)) {
        const topic = categoryData.topics.find(t => t.id === topicId);
        if (topic) {
          setSelectedTopics(prev => [...prev, {...topic, category: categoryName}]);
          break;
        }
      }
    } else {
      setSelectedTopics(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Remove topic from selection
  const removeTopic = (topicId) => {
    setSelectedTopics(prev => prev.filter(t => t.id !== topicId));
  };

  // Generate proposal (simulation)
  const generateProposal = () => {
    if (selectedTopics.length === 0) {
      showStatus('Please select at least one topic before generating the proposal.', 'error');
      return;
    }

    if (!clientName || !projectName) {
      showStatus('Please fill in client name and project name.', 'error');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate generation process
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setProgress(0);
            showStatus(
              `✅ Proposal "${projectName}" for ${clientName} has been generated successfully! 
               Total templates: ${selectedTopics.length}
               ${clientLogoFile ? '<br>✅ Client logo included in the proposal' : ''}
               <br><small>In a real implementation, the PowerPoint file would be downloaded automatically.</small>`,
              'success'
            );
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  // Show status message
  const showStatus = (message, type) => {
    setStatusMessage({ text: message, type, visible: true });
    setTimeout(() => {
      setStatusMessage(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  return (
    <div className="powerpoint-generator">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>🎯 Template Proposal Generator</h1>
        </div>

        <div className="main-content">
          {/* Client Information Section */}
          <ClientInformation
            clientName={clientName}
            setClientName={setClientName}
            projectName={projectName}
            setProjectName={setProjectName}
            tenderName={tenderName}
            setTenderName={setTenderName}
            logoPreview={logoPreview}
            handleLogoUpload={handleLogoUpload}
            removeLogo={removeLogo}
          />

          {/* Available Topics Section */}
          <TopicSelector
            topicCategories={topicCategories}
            selectedTopics={selectedTopics}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            selectAllInCategory={selectAllInCategory}
            toggleTopic={toggleTopic}
          />
        </div>

        {/* Selected Topics Section */}
        <SelectedTopics
          selectedTopics={selectedTopics}
          removeTopic={removeTopic}
          topicCategories={topicCategories}
          isGenerating={isGenerating}
          progress={progress}
          statusMessage={statusMessage}
          generateProposal={generateProposal}
        />
      </div>
    </div>
  );
};

export default PowerPointProposalGenerator;