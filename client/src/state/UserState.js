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
        this.subscribers = [];
    }

    /** Получить id пользователя */
    get userId() {
        return this._userId;
    }

    /** Получить имя пользователя */
    get username() {
        return this._username;
    }

    /** Получить id подключённого канала */
    get connectedChannelInfo() {
        return this._connectedChannelInfo;
    }

    /** Проверить, загружены ли данные пользователя */
    get isLoaded() {
        return this._isLoaded;
    }

    /** Установить id подключённого канала */
    set connectedChannelInfo(value) {
        this._connectedChannelInfo = value;
        this.notify();
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    /** Уведомить всех подписчиков о текущем состоянии */
    notify() {
        const state = {
            userId: this._userId,
            username: this._username,
            connectedChannelInfo: this._connectedChannelInfo,
            isLoaded: this._isLoaded
        };
        this.subscribers.forEach(cb => cb(state));
    }

    /**
     * Инициализация состояния пользователя (загрузка профиля и канала)
     * Вызывать только после успешной авторизации!
     */
    async init() {
        try {
            const userData = await UserService.getProfile(); // { userId, username }
            console.log(userData)
            const channelData = await UserService.getConnectedChannel(); // { connectedChannel: id }

            this._userId = userData.id;
            this._username = userData.username;
            this._connectedChannelInfo = channelData;
            this._isLoaded = true;
        } catch (e) {
            console.error('Ошибка инициализации UserState:', e);
            this._userId = null;
            this._username = null;
            this._connectedChannelInfo = null;
            this._isLoaded = false;
        }
        this.notify();
    }

    /** Сбросить состояние пользователя (например, при выходе) */
    reset() {
        this._userId = null;
        this._username = null;
        this._connectedChannelInfo = null;
        this._isLoaded = false;
        this.notify();
    }
}

export default new UserState();