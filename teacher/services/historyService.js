// FILE: attendance-frontend/teacher/services/historyService.js

import apiClient from './apiClient.js'; 

export const teacherHistoryService = {
    async getClasses() {
        const response = await apiClient.get('/teacher/course-classes');
        // chỉ dùng soi dữ liệu ở Console thui
        console.log("API Response (Classes):", response.data);
        return response.data; 
    },

    async getReport(classId) {
        const response = await apiClient.get(`/teacher/course-classes/${classId}`);
        console.log("API Response (Detail):", response.data);
        return response.data;
    },

    async updateStatus(id, status) {
        const response = await apiClient.put(`/teacher/attendance/override/${id}`, { status });
        return response.data;
    }
};