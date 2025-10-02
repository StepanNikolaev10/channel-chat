import db from '../db.js';
import { FieldValue } from 'firebase-admin/firestore';
import ApiError from '../exceptions/ApiError.js';
import bcrypt from 'bcrypt';

class ChannelService {
    async createChannel(creatorInfo, name, type, password, description, tags) {
        if (!name || !creatorInfo || !type) {
            throw ApiError.BadRequest('Required fields are missing');
        }

        if (type !== 'opened' && type !== 'closed') {
            throw ApiError.BadRequest('Invalid channel type');
        }

        let passwordHash = null;
        if (type === 'closed') {
            if (!password) throw ApiError.BadRequest('Password is required for a private channel');
            passwordHash = await bcrypt.hash(password, 10);
        }

        if (!description) description = null;
        if (!tags) tags = null;

        const channelRef = db.collection('channels').doc();
        const channelData = {
            name,
            type,
            passwordHash,
            description,
            tags,
            createdBy: { id: creatorInfo.id, username: creatorInfo.username },
            createdAt: FieldValue.serverTimestamp(),
            membersCount: 1
        };

        const batch = db.batch();
        batch.set(channelRef, channelData);

        batch.set(channelRef.collection('members').doc(creatorInfo.id), {
            username: creatorInfo.username,
            joinedAt: FieldValue.serverTimestamp(),
            role: 'owner'
        });

        batch.set(channelRef.collection('messages').doc(), {
            senderId: 'system',
            senderUsername: 'system',
            text: `Channel "${name}" has been created.`,
            createdAt: FieldValue.serverTimestamp()
        });

        const userRef = db.collection('users').doc(creatorInfo.id);
        const createdSnap = await channelRef.get();
        batch.update(userRef, { connectedChannel: createdSnap.id, createdChannel: createdSnap.id });

        await batch.commit();
        return { id: createdSnap.id, ...createdSnap.data() };
    }

    async editChannel(channelId, channelData) {
        const channelRef = db.collection('channels').doc(channelId);
        const channelSnap = await channelRef.get();
        if (!channelSnap.exists) {
            throw ApiError.NotFound('Channel not found');
        }

        const currentData = channelSnap.data();
        let dataToUpdate = {};

        if (channelData.name && channelData.name !== currentData.name) {
            dataToUpdate.name = channelData.name;
        }

        if (channelData.description && channelData.description !== currentData.description) {
            dataToUpdate.description = channelData.description;
        }

        if (Array.isArray(channelData.tags) && channelData.tags.length > 0) {
            dataToUpdate.tags = channelData.tags;
        }

        if (channelData.password && currentData.type === 'closed') {
            dataToUpdate.passwordHash = await bcrypt.hash(channelData.password, 10);
        }

        if (Object.keys(dataToUpdate).length > 0) {
            await channelRef.update(dataToUpdate);
        }

        const updatedChannelSnap = await channelRef.get();
        return { id: updatedChannelSnap.id, ...updatedChannelSnap.data() };
    }

    async deleteChannel(userId, channelId) {
        const channelRef = db.collection('channels').doc(channelId);
        const channelSnap = await channelRef.get();
        if (!channelSnap.exists) {
            throw ApiError.NotFound('Channel not found');
        }

        const userRef = db.collection('users').doc(userId);
        const userSnap = await channelRef.get();
        if (!channelSnap.exists) {
            throw ApiError.NotFound('User not found');
        }

        const batch = db.batch();

        const membersSnap = await channelRef.collection('members').get();
        membersSnap.docs.forEach(doc => batch.delete(doc.ref));

        const messagesSnap = await channelRef.collection('messages').get();
        messagesSnap.docs.forEach(doc => batch.delete(doc.ref));

        batch.delete(channelRef);

        batch.update(userRef, {
            createdChannel: 'none',
            connectedChannel: 'none'
        })

        await batch.commit();

        return { success: true };
    }

    async getAllChannels() {
        const channelsSnap = await db.collection('channels').get();
        const channels = channelsSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                type: data.type,
                createdAt: data.createdAt,
                membersCount: data.membersCount
            };
        });

        channels.sort((a, b) => b.membersCount - a.membersCount);
        return channels;
    }

    async getSearchedChannels({ name, selectedTags }) {
        const channelsSnap = await db.collection('channels').get();
        let channels = channelsSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                type: data.type,
                createdAt: data.createdAt,
                membersCount: data.membersCount,
                tags: data.tags || []
            };
        });

        if (name.trim() !== '') {
            if (selectedTags?.length > 0) {
                channels = channels.filter(c =>
                    c.name.toLowerCase().includes(name.toLowerCase()) &&
                    selectedTags.some(tag => c.tags.includes(tag))
                );
            } else {
                channels = channels.filter(c => c.name.toLowerCase().includes(name.toLowerCase()));
            }
        } else if (selectedTags?.length > 0) {
            channels = channels.filter(c => selectedTags.some(tag => c.tags.includes(tag)));
        } else {
            channels = [];
        }

        return channels;
    }

    async getChannelInfo(channelId) {
        const channelRef = db.collection('channels').doc(channelId);
        const channelSnap = await channelRef.get();
        if (!channelSnap.exists) {
            throw ApiError.NotFound('Channel not found');
        }

        const membersSnap = await channelRef.collection('members').get();
        const members = membersSnap.docs.map(doc => doc.data().username);

        return { id: channelSnap.id, ...channelSnap.data(), members };
    }

    async joinChannel(channelId, userId, type, password) {
        const channelRef = db.collection('channels').doc(channelId);
        const userRef = db.collection('users').doc(userId);

        const [channelSnap, userSnap] = await Promise.all([channelRef.get(), userRef.get()]);
        if (!channelSnap.exists) throw ApiError.NotFound('Channel not found');

        if (type === 'closed' && channelSnap.data().type === 'closed') {
            const isValid = bcrypt.compareSync(password, channelSnap.data().passwordHash);
            if (!isValid) throw ApiError.BadRequest('Invalid password');
        }

        const username = userSnap.data().username;
        const batch = db.batch();

        batch.set(channelRef.collection('members').doc(userId), {
            username,
            joinedAt: FieldValue.serverTimestamp(),
            role: 'user'
        });

        batch.update(userRef, { connectedChannel: channelId });
        batch.update(channelRef, { membersCount: FieldValue.increment(1) });

        batch.set(channelRef.collection('messages').doc(), {
            senderId: 'system',
            senderUsername: 'system',
            text: `${username} has joined the channel`,
            createdAt: FieldValue.serverTimestamp()
        });

        await batch.commit();
    }

    async leaveChannel(userId) {
        const userRef = db.collection('users').doc(userId);
        const userSnap = await userRef.get();
        if (!userSnap.exists) {
            throw ApiError.BadRequest('You are not a member of the channel');
        }

        const connectedChannel = userSnap.data().connectedChannel;
        const channelRef = db.collection('channels').doc(connectedChannel);
        const channelSnap = await channelRef.get();
        if (!channelSnap.exists) { 
            throw ApiError.NotFound('Channel not found');
        }
        
        const batch = db.batch();
        batch.delete(channelRef.collection('members').doc(userId));
        batch.update(userRef, { connectedChannel: 'none' });
        if (channelSnap.data().membersCount !== 0) {
            batch.update(channelRef, { membersCount: FieldValue.increment(-1) });
        }
        batch.set(channelRef.collection('messages').doc(), {
            senderId: 'system',
            senderUsername: 'system',
            text: `${userSnap.data().username} has left the channel`,
            createdAt: FieldValue.serverTimestamp()
        });

        await batch.commit();
    }

    async getMembers(channelId) {
        const snapshot = await db.collection('channels').doc(channelId).collection('members').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async getMessages(channelId) {
        const messagesRef = db.collection('channels').doc(channelId).collection('messages');
        const messagesSnap = await messagesRef.orderBy('createdAt').get();
        return messagesSnap.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                senderId: data.senderId, 
                senderUsername: data.senderUsername, 
                text: data.text, 
                createdAt: data.createdAt 
            }
        });
    }

    async sendMessage(userId, message) {
        const userRef = db.collection('users').doc(userId);
        const userSnap = await userRef.get();
        if (!userSnap.exists) throw ApiError.NotFound('User not found');

        const userData = userSnap.data();
        if (!userData.connectedChannel || userData.connectedChannel === 'none') {
            throw ApiError.BadRequest('You are not connected to this channel')
        }

        const channelId = userData.connectedChannel;
        const channelRef = db.collection('channels').doc(channelId);
        const channelSnap = await channelRef.get();
        if (!channelSnap.exists) {
            await userRef.update({ connectedChannel: 'none' });
            throw ApiError.NotFound('Channel not found');
        }

        const batch = db.batch();
        batch.set(channelRef.collection('messages').doc(), {
            senderId: userId,
            senderUsername: userData.username,
            text: message,
            createdAt: FieldValue.serverTimestamp()
        });
        await batch.commit();
    }
}

export default new ChannelService();


// doc - document reference
// snap - document snapshot
// batch - batch operations
// ref - collection reference


