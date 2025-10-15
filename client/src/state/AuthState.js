import AuthService from '../services/AuthService.js';

class AuthState {
    constructor() {
        this._isAuthenticated = false;
        this._isChecked = false;
        this.subscribers = [];
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }

    set isAuthenticated(value) {
        this._isAuthenticated = value;
        this.notify();
    }

    get isChecked() {
        return this._isChecked;
    }

    set isChecked(value) {
        this._isChecked = value;
        this.notify();
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.subscribers.forEach(cb => cb(this.isAuthenticated));
    }

    async init() {
        const token = localStorage.getItem('token');

        if (!token) {
            this.isAuthenticated = false;
            this.isChecked = true;
            return;
        }

        const isExpired = (() => {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const now = Date.now() / 1000;
                return payload.exp < now;
            } catch {
                return true;
            }
        })();

        if (isExpired) {
            try {
                await AuthService.refresh();
                this.isAuthenticated = true;
            } catch {
                this.isAuthenticated = false;
                localStorage.removeItem('token');
            }
        } else {
            try {
                await AuthService.check();
                this.isAuthenticated = true;
            } catch(e) {
                this.isAuthenticated = false;
                localStorage.removeItem('token');
                console.error(e);   
            }
        }

        this.isChecked = true;
    }

    reset() {
        this.isAuthenticated = false;
        this.isChecked = false;
        localStorage.removeItem('token');
    }
}

export default new AuthState();

