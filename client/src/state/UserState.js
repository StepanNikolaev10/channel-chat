import UserService from '../services/UserService.js';

class UserState {
    constructor() {
        this._userId = null;
        this._username = null;
        this._connectedChannelInfo = {
            channelId: 'none',
            channelName: 'none'
        };
        this._isLoaded = false;
    }

    get userId() {
        return this._userId;
    }

    get username() {
        return this._username;
    }

    get connectedChannelInfo() {
        return this._connectedChannelInfo;
    }

    set connectedChannelInfo(value) {
        this._connectedChannelInfo = value;
    }

    async init() {
        try {
            const userData = await UserService.getProfile(); 
            const channelData = await UserService.getConnectedChannel(); 

            this._userId = userData.id;
            this._username = userData.username;
            this._connectedChannelInfo = channelData;
            this._isLoaded = true;
        } catch (e) {
            console.error('UserState error:', e);
            this._userId = null;
            this._username = null;
            this._connectedChannelInfo = null;
            this._isLoaded = false;
        }
    }

}

export default new UserState();