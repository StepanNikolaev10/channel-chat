import api from '../http/index.js';

class ChannelsService {
    async createChannel({ name, type, password, description, tags }) {
        try {
            if (type === 'closed' && (!password || password.trim() === '')) {
                throw new Error('Password is required for closed channels');
            }

            const payload = { name, type, description, tags };
            if (type === 'closed') {
                payload.password = password;
            }

            const response = await api.post('/channels', payload);
            return response.data;
        } catch (e) {
            console.error('Failed to create channel:', e);
            throw e;
        }
    }

    async editChannel(channelId, channelData) {
        try {
            const response = await api.put(`/channels/${channelId}`, channelData);
            console.log('channel has been deleted')
            return response.data;
        } catch (e) {
            console.error('Failed to edit channel:', e);
            throw e;
        }
    }

    async deleteChannel(channelId) {
        try {
            const response = await api.delete(`/channels/${channelId}`);
            return response.data;
        } catch (e) {
            console.error('Failed to delete channel:', e);
            throw e;
        }
    }

    async getAllChannels() {
        try {
            const response = await api.get('/channels/all');
            return response.data;
        } catch (e) {
            console.error('Failed to get all channels:', e);
            throw e;
        }
    }

    async getSearchedChannels({ name, selectedTags }) {
        try {
            const response = await api.post('/channels/searched', {  name, selectedTags });
            return response.data;
        } catch (e) {
            console.error('Failed to get searched channels:', e);
            throw e;
        }
    }

    async getChannelInfo(channelId) {
        try {
            const response = await api.get(`/channels/${channelId}`);
            return response.data;
        } catch (e) {
            console.error('Failed to get channel info:', e);
            throw e;
        }
    }

    async joinChannel({id, type, password}) {

        try {
            if (type === 'closed' && (!password || password.trim() === '')) {
                throw new Error('Password is required for closed channels');
            }

            const payload = { type };
            if (type === 'closed') {
                payload.password = password;
            }

            const response = await api.post(`/channels/${id}/join`, payload);
            return response.data;

        } catch (e) {
            console.error('Failed to joinChannel:', e);
            throw e;
        }

    }

    async leaveChannel() {
        try {
            const response = await api.post(`/channels/leave`);
            return response.data;
        } catch (e) {
            console.error('Failed to leaveChannel:', e);
            throw e;
        }
    }

    async getMembers(channelId) {
        try {
            const response = await api.get(`/channels/${channelId}/members`);
            return response.data;
        } catch (e) {
            console.error('Failed to get members:', e);
            throw e;
        }
    }

    async getMessages(channelId) {
        try {
            const response = await api.get(`/channels/${channelId}/messages`);
            const { userId, messages } = response.data;
            return { userId, messages };
        } catch (e) {
            console.error('Failed to get messages:', e);
            // Прокидываем ошибку выше, чтобы обработать на UI уровне
            throw e;
        }
    }
}

export default new ChannelsService();