const API_URL = 'http://localhost:5000/api';

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
                // Lưu vào localStorage thay vì sessionStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return {
                    success: true,
                    user: data.user,
                    token: data.token
                };
            } else {
                return {
                    success: false,
                    error: data.message
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Network error. Please try again.'
            };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService; 