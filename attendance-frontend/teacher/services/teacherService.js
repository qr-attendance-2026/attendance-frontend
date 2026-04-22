// import apiClient from './apiClient.js';

// export const teacherService = {
//     // ds lớp giảng viên đang phụ trách
//     async getMyClasses() {
//         const response = await apiClient.get('/teacher/course-classes');
//         return response.data;
//     },

//     // nhận ID lớp và time
//     async openSession(payload) {
//         // payload: { course_class_id, check_number, start_time, end_time }
//         const response = await apiClient.post('/teacher/sessions', payload);
//         return response.data;
//     },

//     async getLiveAttendance(sessionId) {
//         const response = await apiClient.get(`/teacher/sessions/${sessionId}/live`);
//         return response.data;
//     }
// };

// attendance-frontend/services/teacherApi.js







// import apiClient from './apiClient.js';
// export const teacherService = {
//     // Tạo phiên mới (khớp SessionController.php @ open)
//     // teacherService.js
// async generateQR(classId, checkNumber, duration) {

//     const res = await apiClient.post('/teacher/sessions', {
//         course_class_id: classId,
//         check_number: checkNumber,
//         duration_minutes: duration
//     });

//     return res.data;
// },

//     // Lấy trạng thái thời gian thực (khớp SessionController.php @ live)
//     getAttendanceStatus: async (sessionId) => {
//         const res = await apiClient.get(`/teacher/sessions/${sessionId}/live`);
//         return res.data;
//     },
//     // Hàm quét mã sinh viên trực tiếp

// async scanStudent(sessionId, studentCode) {
//     // Dùng apiClient thay vì axios để tận dụng baseURL và Headers đã cấu hình
//     const response = await apiClient.post('/teacher/attendance/scan', {
//         session_id: sessionId,
//         student_code: studentCode
//     });
//     return response.data;
// }
// };





import apiClient from './apiClient.js';

export const teacherService = {
    // Mở phiên điểm danh
    async generateQR(classId, checkNumber, duration) {
        // Bỏ chữ '/open' ở cuối route
        const response = await apiClient.post('/teacher/sessions', {
            course_class_id: classId,
            check_number: checkNumber,
            duration_minutes: duration
        });
        return response.data;
    },

    // Lấy danh sách điểm danh thời gian thực (Giữ nguyên vì đã khớp)
    async getAttendanceStatus(sessionId) {
        const res = await apiClient.get(`/teacher/sessions/${sessionId}/live`);
        return res.data;
    },

    // Quét mã sinh viên trực tiếp
    async scanStudent(sessionId, studentCode) {
        const response = await apiClient.post('/teacher/attendance/scan', {
            session_id: sessionId,
            student_code: studentCode
        });
        return response.data;
    }
};