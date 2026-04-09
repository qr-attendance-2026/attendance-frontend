import apiClient from './apiClient.js';

const teacherApi = {
    async getClasses() {
        const response = await apiClient.get('/teacher/course-classes');
        return response.data;
    },

    async createSession(payload) {
        const response = await apiClient.post('/teacher/sessions', payload);
        return response.data;
    },

    async checkAttendance(payload) {
        // payload: course_class_id, student_code, check_number, method
const response = await apiClient.post('/teacher/attendance/scan', payload);
        return response.data;
    },

    async getLiveAttendance(sessionId) {
        const response = await apiClient.get(`/teacher/sessions/${sessionId}/live`);
        return response.data;
    },
    async scanStudentQR(payload) {
        // payload: { session_id, student_code }
        const response = await apiClient.post('/teacher/attendance/scan', payload);
        return response.data;
    }
};

export default teacherApi;