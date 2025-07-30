import React, { useState } from 'react';
import ClientInformation from './ClientInformation';
import TopicSelector from './TopicSelector';
import SelectedTopics from './SelectedTopics';
import './PowerPointProposalGenerator.css';
import { proposalService } from '../services/proposalService';

const PowerPointProposalGenerator = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [clientLogoFile, setClientLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [tenderName, setTenderName] = useState('');
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '', visible: false });
  const [topicCategories, setTopicCategories] = useState({});

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
  const toggleTopic = (topic) => {
    setSelectedTopics(prev => {
      const exists = prev.some(t => t.id === topic.id);
      if (exists) {
        return prev.filter(t => t.id !== topic.id);
      } else {
        return [...prev, topic];
      }
    });
  };

  // Remove topic from selection
  const removeTopic = (topicId) => {
    setSelectedTopics(prev => prev.filter(t => t.id !== topicId));
  };

  // Merge templates (simulation)
  const mergeTemplates = async () => {
    if (selectedTopics.length === 0) {
      showStatus('Please select at least one template before merging.', 'error');
      return;
    }

    if (!clientName.trim() || !projectName.trim() || !tenderName.trim()) {
      showStatus('Please fill in all required fields (Client Name, Project Name, Tender Name).', 'error');
      return;
    }

    try {
      setIsMerging(true);
      setProgress(0);
      showStatus('Preparing template merge...', 'info');

      // Build document paths from selected topics
      const documentPaths = selectedTopics.map(topic => {
        return `${topic.category}/${topic.fileName}`;
      });

      // Prepare the request payload with correct field names
      const proposalRequest = {
        documentPaths: documentPaths,
        clientInformation: {
          clientName: clientName.trim(),      // Changed from CLIENT_NAME
          projectName: projectName.trim(),    // Changed from PROJECT_NAME
          tenderName: tenderName.trim()       // Changed from TENDER_NAME
        }
      };

      console.log('Sending proposal request:', proposalRequest);

      // Update progress
      setProgress(25);
      showStatus('Sending request to server...', 'info');

      // Call the backend API
      const result = await proposalService.mergeTemplates(proposalRequest);

      // Update progress
      setProgress(75);
      showStatus('Processing templates...', 'info');

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Complete
      setProgress(100);
      showStatus(`
        <strong>✅ Templates merged successfully!</strong><br/>
        <small>Merged ${selectedTopics.length} templates for ${clientName}</small><br/>
        <small>Check your output directory for the merged document</small>
      `, 'success');

      // Reset after success
      setTimeout(() => {
        setProgress(0);
        showStatus('', '', false);
      }, 5000);

    } catch (error) {
      console.error('Error merging templates:', error);
      setProgress(0);
      showStatus(`
        <strong>❌ Failed to merge templates</strong><br/>
        <small>${error.message || 'An unexpected error occurred. Please try again.'}</small>
      `, 'error');
    } finally {
      setIsMerging(false);
    }
  };

  // Show status message
  const showStatus = (text, type, visible = true) => {
    setStatusMessage({ text, type, visible });
  };

  return (
    <div className="doc-merger">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>📄 Doc Merger</h1>
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
            selectedTopics={selectedTopics}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            selectAllInCategory={selectAllInCategory}
            toggleTopic={toggleTopic}
            topicCategories={topicCategories}
            setTopicCategories={setTopicCategories}
          />
        </div>

        {/* Selected Topics Section */}
        <SelectedTopics
          selectedTopics={selectedTopics}
          removeTopic={removeTopic}
          topicCategories={topicCategories}
          isMerging={isMerging}
          progress={progress}
          statusMessage={statusMessage}
          mergeTemplates={mergeTemplates}
          onReorderTopics={setSelectedTopics}
        />
      </div>
    </div>
  );
};

export default PowerPointProposalGenerator;