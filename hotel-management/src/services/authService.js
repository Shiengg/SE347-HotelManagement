const API_URL = 'http://localhost:5000/api'; // Thay đổi URL này theo server của bạn

const authService = {
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu token và thông tin user vào sessionStorage
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify({
                    ...data.user,
                    role: data.user.role // Sử dụng role từ role_id
                }));
                return { success: true, user: data.user };
            } else {
                return { 
                    success: false, 
                    error: data.message || 'Login failed' 
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: 'Network error. Please try again.' 
            };
        }
    },

    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!sessionStorage.getItem('token');
    },

    // Hàm để lấy token cho các request khác
    getToken: () => {
        return sessionStorage.getItem('token');
    },

    // Hàm để thêm token vào header của request
    authHeader: () => {
        const token = authService.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

export default authService; 