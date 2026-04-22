// // FILE: attendance-frontend/teacher/services/historyService.js

// import apiClient from './apiClient.js'; 

// export const teacherHistoryService = {
//     async getClasses() {
//         const response = await apiClient.get('/teacher/course-classes');
//         // chỉ dùng soi dữ liệu ở Console thui
//         console.log("API Response (Classes):", response.data);
//         return response.data; 
//     },

//     async getReport(classId) {
//         const response = await apiClient.get(`/teacher/course-classes/${classId}`);
//         console.log("API Response (Detail):", response.data);
//         return response.data;
//     },

//     async updateStatus(id, status) {
//         const response = await apiClient.put(`/teacher/attendance/override/${id}`, { status });
//         return response.data;
//     }
// };




import apiClient from './apiClient.js'; 

export const teacherHistoryService = {
    // 1. Lấy danh sách lớp (Đã khớp: GET /api/teacher/course-classes)
    async getClasses() {
        const response = await apiClient.get('/teacher/course-classes');
        return response.data; 
    },

    // 2. Lấy báo cáo điểm danh (Sửa lại endpoint theo api.php)
    async getReport(classId) {
        // Khớp với Route::get('reports/{courseClassId}', [TeacherAttendanceController::class, 'report'])
        const response = await apiClient.get(`/teacher/reports/${classId}`);
        return response.data;
    },

    // 3. Cập nhật trạng thái (Sửa lại method PATCH và endpoint)
    async updateStatus(recordId, status) {
        // Khớp với Route::patch('attendance/{id}', [TeacherAttendanceController::class, 'override'])
        const response = await apiClient.patch(`/teacher/attendance/${recordId}`, { status });
        return response.data;
    }
};