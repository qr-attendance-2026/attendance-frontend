// attendance-frontend/services/authService.js
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm';

const apiClient = axios.create({
    baseURL: 'https://api-attendance-backend-520975280881.asia-southeast1.run.app/api', 
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
    }
});

// Hàm quan trọng bạn đang thiếu đây:
export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('access_token');
    
    // Sử dụng apiClient.request để hỗ trợ linh hoạt các method (GET, POST, PUT, DELETE)
    return apiClient.request({
        url: endpoint,
        method: options.method || 'GET',
        data: options.body || options.data, // Map 'body' (nếu dùng) sang 'data' của axios
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });
};

export const authService = {
    async login(email, password) {
        try {
            const response = await apiClient.post('/auth/login', {
                email: email,
                password: password
            });
            return response.data; 
        } catch (error) {
            throw error;
        }
    }
};