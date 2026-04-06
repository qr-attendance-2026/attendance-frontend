import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm';// teacherApi.js
const api = axios.create({
    baseURL: 'http://localhost/SAMS/attendance-backend/public/api', // Thay bằng URL Laravel của bạn
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// TỰ ĐỘNG ĐÍNH KÈM TOKEN VÀO MỌI REQUEST
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const teacherService = {
    // Đăng nhập và lưu token
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Gọi API lấy danh sách lớp của Teacher (api/teacher/course-classes)
    async getMyClasses() {
        const response = await api.get('/teacher/course-classes');
        return response.data;
    },

    // Gọi API mở session (api/teacher/sessions)
    async openSession(courseClassId) {
        const response = await api.post('/teacher/sessions', { 
            course_class_id: courseClassId 
        });
        return response.data;
    },

    // Lấy dữ liệu live (api/teacher/sessions/{id}/live)
    async getLiveAttendance(sessionId) {
        const response = await api.get(`/teacher/sessions/${sessionId}/live`);
        return response.data;
    }
};