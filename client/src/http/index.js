import axios from 'axios';

const API_URL = 'https://channelchat-production.up.railway.app/api';

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.response;
        if (error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
            const token = localStorage.getItem('token');
            if (!token) {
                return Promise.reject(error);
            }

            originalRequest._isRetry = true;
            try {
                const response = await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true });
                localStorage.setItem('token', response.data.accessToken);
                return api.request(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export default api;