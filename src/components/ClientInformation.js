import React from 'react';

const ClientInformation = ({
  clientName,
  setClientName,
  projectName,
  setProjectName,
  tenderName,
  setTenderName,
  logoPreview,
  handleLogoUpload,
  removeLogo
}) => {
  return (
    <div className="section">
      <h2>
        <span className="section-icon">👤</span>
        Client Information
      </h2>
      
      <div className="form-group">
        <label htmlFor="clientName">Client Name</label>
        <input 
          type="text" 
          id="clientName"
          placeholder="Enter client company name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="projectName">Project Name</label>
        <input 
          type="text" 
          id="projectName"
          placeholder="Enter project title"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tenderName">Tender Name</label>
        <input 
          type="text" 
          id="tenderName"
          placeholder="Enter tender reference or name"
          value={tenderName}
          onChange={(e) => setTenderName(e.target.value)}
        />
      </div>
      
    </div>
  );
};

export default ClientInformation;