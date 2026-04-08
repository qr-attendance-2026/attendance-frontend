/**
 * AuthService - Quản lý trọn vẹn vòng đời xác thực (Authentication)
 * Vanilla JavaScript (ES6+), Fetch API
 */

const API_BASE_URL = "https://api-attendance-backend-520975280881.asia-southeast1.run.app/api";

const authService = {
    /**
     * 1. Lưu trữ token và thông tin user vào localStorage một cách an toàn
     * @param {string} token - Bearer Token trả về từ server
     * @param {object} user - Thông tin chi tiết của user
     */
    saveAuthData(token, user) {
        if (!token || !user) {
            console.error("Dữ liệu xác thực không hợp lệ!");
            return;
        }
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_info', JSON.stringify(user));
    },

    /**
     * 2a. Lấy token từ localStorage
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('access_token');
    },

    /**
     * 2b. Lấy thông tin user từ localStorage
     * @returns {object|null}
     */
    getUser() {
        const user = localStorage.getItem('user_info');
        try {
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Lỗi khi parse thông tin user:", error);
            return null;
        }
    },

    /**
     * 3. Xóa toàn bộ dữ liệu và chuyển hướng về trang đăng nhập
     */
    logout() {
        // Xóa token và dữ liệu phiên bản
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');

        // Cần đảm bảo đường dẫn về trang đăng nhập chính xác cho mọi HTML phụ thuộc
        // Cách tốt nhất là dùng file absolute gốc hoặc đi lùi về trang login.html
        window.location.href = '/attendance-frontend/login/login.html';
    },

    /**
     * 4. fetchWithAuth - Wrapper (lớp bọc) thay thế `fetch`
     * Tự động gắn Token và xử lý HTTP 401 khi Session Hết Hạn
     * @param {string} endpoint - Đường dẫn sau API_BASE_URL (vd: '/history')
     * @param {object} options - Options giống của fetch mặc định
     */
    async fetchWithAuth(endpoint, options = {}) {
        const token = this.getToken();

        // Chuẩn bị headers mặc định
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };

        // Nếu có token, tự động gắn vào Header Authorization
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
            const response = await fetch(url, { ...options, headers });

            // Kiểm tra lỗi 401 Unauthorized (sai token, hết hạn token)
            if (response.status === 401) {
                console.warn("Phiên đăng nhập đã hết hạn. Yêu cầu đăng nhập lại!");
                this.logout(); // Đá bay ra ngoài ngay lập tức
                throw new Error("Unauthorized");
            }

            // Nếu không phải 401 nhưng bị các lỗi khác, cấu trúc ném ra lỗi để catch xử lý
            if (!response.ok) {
                const errData = await response.json().catch(() => ({})); // Phòng trường hợp server trả về lỗi ko phải JSON
                throw new Error(errData.message || `HTTP Error: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error("Lỗi fetchWithAuth:", error.message);
            throw error;
        }
    },

    /**
     * 5. Đăng nhập - Gọi API và tự động lưu data nếu thành công
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' // Yêu cầu Laravel trả định dạng JSON thay vì HTML báo lỗi mặc định
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // Check API Success (kiểm tra structure data trả về)
            if (response.ok && data.success) {
                const { token, user } = data.data;
                this.saveAuthData(token, user);
                return { success: true, user: user };
            } else {
                // Trả về lỗi để UI hiển thị Toast/Alert
                let errorMsg = data.message || "Bạn nhập sai email hoặc mật khẩu!";

                // Trích xuất error validation cụ thể của Laravel nếu có
                if (data.errors && data.errors.email) {
                    errorMsg = data.errors.email[0];
                }

                return { success: false, message: errorMsg };
            }
        } catch (error) {
            console.error("Lỗi Call API login:", error);
            throw new Error("Lỗi kết nối đến máy chủ! Vui lòng kiểm tra mạn Internet.");
        }
    }
};

export const { saveAuthData, getToken, getUser, logout, fetchWithAuth, login } = authService;
export default authService;