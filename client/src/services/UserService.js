import api from '../http/index.js';

class UserService {
    async getProfile() {
        try {
            const response = await api.get('/user/me');
            return response.data;
        } catch (e) {
            console.error('Failed to get profile:', e);
            throw e;
        }
    }

    async getConnectedChannel() {
        try {
            const response = await api.get('/user/connected-channel');
            return response.data;
        } catch (e) {
            console.error('Failed to get connected channel:', e);
            throw e;
        }
    }
    
    async setConnectedChannel(channelId) {
        try {
            const response = await api.put('/user/connected-channel', { channelId });
            return response.data;
        } catch (e) {
            console.error('Failed to get connected channel:', e);
            throw e;
        }
    }
}

export default new UserService();