import apiClient from './apiClient.js';

const teacherApi = {
    // BỔ SUNG HÀM NÀY
    async getClasses() {
        const response = await apiClient.get('/teacher/course-classes');
        return response.data; // Đảm bảo trả về đúng cấu trúc { success: true, data: [...] }
    },

    async createSession(payload) {
        const response = await apiClient.post('/teacher/sessions', payload);
        return response.data;
    },

    async getLiveAttendance(sessionId) {
        const response = await apiClient.get(`/teacher/sessions/${sessionId}/live`);
        return response.data;
    }
};

export default teacherApi;