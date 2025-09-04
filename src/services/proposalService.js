const API_BASE_URL = process.env.MERGE_TEMPLATE_API_URL || 'http://localhost:5000/api';

export const proposalService = {
  async mergeTemplates(proposalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposalData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle file download response
      const blob = await response.blob();
      
      // Generate datetime stamp
      const now = new Date();
      const datetime = now.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_');
      
      // Create filename from client information
      const clientName = proposalData.clientInformation?.clientName || 'Client';
      const projectName = proposalData.clientInformation?.projectName || 'Project';
      
      // Sanitize filename (remove invalid characters)
      const sanitize = (str) => str.replace(/[<>:"/\\|?*]/g, '_').trim();
      
      let filename = `${sanitize(clientName)}_${sanitize(projectName)}_${datetime}.docx`;
      
      // Extract filename from Content-Disposition header (this will override the generated filename if present)
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.+)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, ''); // Remove quotes if present
        }
      }
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename: filename };
    } catch (error) {
      console.error('Error merging templates:', error);
      throw error;
    }
  }
};