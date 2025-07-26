const API_BASE_URL = 'http://localhost:8080/api';

export const templateService = {
    async getTemplatesStructure() {
        try {
            const response = await fetch(`${API_BASE_URL}/templates/structure`);
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