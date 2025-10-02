import api from '../http/index.js';

class AuthService {
    async signUp(username, password) {
        const response = await api.post('/auth/sign-up', { username, password });
        localStorage.setItem('token', response.data.accessToken);
        return response.data;
    }

    async signIn(username, password) {
        const response = await api.post('/auth/sign-in', { username, password });
        localStorage.setItem('token', response.data.accessToken);
        return response.data;
    }

    async logout() {
        const response = await api.post('/auth/logout');
        localStorage.removeItem('token');
        return response.data;
    }

    async refresh() {
        try {
            const response = await api.get('/auth/refresh');
            localStorage.setItem('token', response.data.accessToken);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async check() {
        const response = await api.get('/auth/check');
        return response.data;
    }
}

export default new AuthService();