// teacherApi.js
import apiClient from './apiClient.js';

export const teacherApi = {
    // Quản lý lớp học
    getClasses: () => apiClient.get('/course-classes'),

    // Quản lý phiên điểm danh
    openSession: (data) => apiClient.post('/sessions', data),
    closeSession: (id) => apiClient.post(`/sessions/${id}/close`),
    getLiveAttendance: (id) => apiClient.get(`/sessions/${id}/live`),

    // Điểm danh
    scanStudent: (sessionId, studentCode) => 
        apiClient.post('/attendance/scan', { session_id: sessionId, student_code: studentCode }),

    // Báo cáo & Lịch sử
    getReport: (courseClassId) => apiClient.get(`/attendance/report/${courseClassId}`),
    
    // Ghi đè trạng thái (Cần Record ID)
    updateStatus: (recordId, status) => 
        apiClient.put(`/attendance/override/${recordId}`, { status })
};