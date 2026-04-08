import apiClient from './apiClient.js';

export const dashboardService = {
    async getTeacherStats() {
        // khớp với api.php
        const response = await apiClient.get('/teacher/course-classes');
        return response.data;
    }
};