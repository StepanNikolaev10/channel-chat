class LangState {
    constructor() {
        this._language = localStorage.getItem('language') || 'en';
        this._isLoaded = false;
        this.subscribers = [];
    }

    get language() {
        return this._language;
    }

    set language(value) {
        this._language = value;
        localStorage.setItem('language', value);
        this.notify();
    }

    get isLoaded() {
        return this._isLoaded;
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.subscribers.forEach(cb => cb(this._language));
    }

    async init() {
        try {
            const lang = localStorage.getItem('language');
            this._language = lang || 'en';
            this._isLoaded = true;
        } catch (e) {
            console.error('LangState error:', e);
            this._language = 'en';
            this._isLoaded = false;
        }
    }

    reset() {
        this._language = 'en';
        this._isLoaded = false;
        localStorage.removeItem('language');
        this.notify();
    }
}

export default new LangState();
