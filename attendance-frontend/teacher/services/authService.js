
import apiClient from './apiClient.js';

export const authService = {
    async login(email, password) {
        try {
            // Gửi request POST tới API backend
            const response = await apiClient.post('/auth/login', {
                email: email,
                password: password
            });
            
            return response.data; 
        } catch (error) {
            console.error("AuthService Login Error:", error);
            throw error;
        }
    }
};