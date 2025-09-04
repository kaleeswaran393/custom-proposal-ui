const MERGE_TEMPLATE_API_URL = 'http://localhost:5000/api';

export const templateService = {
    async getTemplatesStructure() {
        try {
            const response = await fetch(`${MERGE_TEMPLATE_API_URL}/templates`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching templates:', error);
            throw error;
        }
    }
};