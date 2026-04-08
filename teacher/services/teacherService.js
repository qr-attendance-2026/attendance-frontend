import apiClient from './apiClient.js';

export const teacherService = {
    // ds lớp giảng viên đang phụ trách
    async getMyClasses() {
        const response = await apiClient.get('/teacher/course-classes');
        return response.data;
    },

    // nhận vào object chứa ID lớp và time
    async openSession(payload) {
        // payload: { course_class_id, check_number, start_time, end_time }
        const response = await apiClient.post('/teacher/sessions', payload);
        return response.data;
    },

    async getLiveAttendance(sessionId) {
        const response = await apiClient.get(`/teacher/sessions/${sessionId}/live`);
        return response.data;
    }
};