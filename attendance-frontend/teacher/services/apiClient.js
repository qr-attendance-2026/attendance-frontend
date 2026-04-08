import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm';

const apiClient = axios.create({
    baseURL: 'https://api-attendance-backend-520975280881.asia-southeast1.run.app/api', 
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
    }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;