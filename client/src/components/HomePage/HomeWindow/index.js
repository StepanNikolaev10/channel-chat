import styles from './styles.module.scss';
import LangState from '../../../state/LangState';

class HomeWindow extends HTMLElement {
    
    constructor() {
        super();
        this.eventListeners = [];
        this.langUnsubscribe = null;
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
        this.attachEvents();
        this.langUnsubscribe = LangState.subscribe((newLang) => {
            this.updateLanguage(newLang);
        });
        this.updateLanguage(LangState.language);
    }

    disconnectedCallback() {
        this.removeEvents();
        if (this.langUnsubscribe) this.langUnsubscribe();
    }

    setupStyles() {
        this.style.flexGrow = '1';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.content}">
                    <p class="${styles.title}">
                        Here you can connect or create a channel for communication.
                    </p>
                </div>
                <div class="${styles.actions}">
                    <button class="${styles.button}" data-role="create-channel-btn">Create a channel</button>
                    <button class="${styles.button}" data-role="connect-by-id-btn">Connect by id</button>
                </div>
            </div>
        `;
    }

    updateLanguage(lang) {
        const title = this.querySelector(`.${styles.title}`);
        const createChannelBtn = this.querySelector('[data-role="create-channel-btn"]');
        const connectByIdBtn = this.querySelector('[data-role="connect-by-id-btn"]');

        if (lang === 'en') {
            title.textContent = 'Here you can connect or create a channel for communication.';
            createChannelBtn.textContent = 'Create a channel';
            connectByIdBtn.textContent = 'Connect by id';
        } else if (lang === 'ru') {
            title.textContent = 'Тут можно подключиться или создать канал для общения.';
            createChannelBtn.textContent = 'Создать канал';
            connectByIdBtn.textContent = 'Подключиться по id';
        }
    }

    attachEvents() {
        // create channel btn
        const createChannelBtn = this.querySelector('[data-role="create-channel-btn"]');
        const createChannel = () => {
            this.dispatchEvent(new CustomEvent('create-channel', {
                bubbles: true,
                composed: true
            }));
        }
        this.addEvent(createChannelBtn, 'click', createChannel);
    }

    addEvent(element, eventType, handler) {
        this.eventListeners.push({ element, eventType, handler });
        element.addEventListener(eventType, handler);
    }

    removeEvents() {
        for (const listener of this.eventListeners) {
            listener.element.removeEventListener(listener.eventType, listener.handler);
        }
        this.eventListeners = [];
    }

    static define() {
        if (!customElements.get('home-window')) {
            customElements.define('home-window', HomeWindow);
        }
    }
}

export default HomeWindow;