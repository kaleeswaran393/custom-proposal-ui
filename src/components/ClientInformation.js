import React from 'react';

const ClientInformation = ({
  clientName,
  setClientName,
  projectName,
  setProjectName,
  tenderName,
  setTenderName,
  clientLegalEntityName,
  setClientLegalEntityName,
  clientAddress,
  setClientAddress,
  lumenAccountDirectorName,
  setLumenAccountDirectorName,
  logoPreview,
  handleLogoUpload,
  removeLogo
}) => {
  return (
    <div className="section client-information">
      <h2>
        <span className="section-icon">👤</span>
        Client Information
      </h2>
      
      <div className="form-group">
        <label htmlFor="clientName" className="required">Client Name *</label>
        <input 
          type="text" 
          id="clientName"
          className="required-field"
          placeholder="Enter client company name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="projectName" className="required">Project Name *</label>
        <input 
          type="text" 
          id="projectName"
          className="required-field"
          placeholder="Enter project title"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tenderName" className="optional">Tender Name</label>
        <input 
          type="text" 
          id="tenderName"
          placeholder="Enter tender reference or name (optional)"
          value={tenderName}
          onChange={(e) => setTenderName(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="clientAddress" className="optional">Client Address</label>
        <textarea 
          id="clientAddress"
          rows="3"
          placeholder="Enter client address (optional)"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="lumenAccountDirectorName" className="optional">Lumen Account Director Name</label>
        <input 
          type="text" 
          id="lumenAccountDirectorName"
          placeholder="Enter Lumen account director name (optional)"
          value={lumenAccountDirectorName}
          onChange={(e) => setLumenAccountDirectorName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="clientLegalEntityName" className="optional">Client Legal Entity Name</label>
        <input 
          type="text" 
          id="clientLegalEntityName"
          placeholder="Enter client legal entity name (optional)"
          value={clientLegalEntityName}
          onChange={(e) => setClientLegalEntityName(e.target.value)}
        />
      </div>
      

      
    </div>
  );
};

export default ClientInformation;