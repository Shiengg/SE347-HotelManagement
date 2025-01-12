const API_URL = 'http://localhost:5000/api';

const authService = {
    login: async (username, password) => {
        try {
            console.log('Sending login request');
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log('Server response:', data);
            
            if (response.ok && data.success) {
                await new Promise(resolve => setTimeout(resolve, 50));
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
                return { success: true, data };
            }
            
            return { 
                success: false, 
                error: data.message || 'Login failed' 
            };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error' };
        }
    },

    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        const token = sessionStorage.getItem('token');
        console.log('Checking authentication:', { hasToken: !!token });
        return !!token;
    },

    getToken: () => {
        return sessionStorage.getItem('token');
    },

    hasRole: (requiredRole) => {
        const user = authService.getCurrentUser();
        return user?.role === requiredRole;
    }
};

export default authService; 