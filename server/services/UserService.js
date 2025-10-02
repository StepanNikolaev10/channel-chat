import db from '../db.js';
import ApiError from '../exceptions/ApiError.js';

class UserService {
    async getProfile(id) {
        const docRef = db.collection('users').doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            throw ApiError.NotFound('User not found');
        }
        const username = docSnap.data().username;
        return { username, id };
    }

    async getConnectedChannel(userId) {
        const userRef = db.collection('users').doc(userId);
        const userSnap = await userRef.get();
        if (!userSnap.exists) {
            throw ApiError.NotFound('User not found');
        }
        const channelId = userSnap.data().connectedChannel;

        if (channelId && channelId !== 'none') {
            const channelRef = db.collection('channels').doc(channelId);
            const channelSnap = await channelRef.get();
            if (!channelSnap.exists) {
                throw ApiError.NotFound('Channel not found');
            }
            const channelName = channelSnap.data().name;
            return { channelId, channelName };
        } else {
            return { channelId, channelName: 'none' };
        }
    }

}
export default new UserService();
