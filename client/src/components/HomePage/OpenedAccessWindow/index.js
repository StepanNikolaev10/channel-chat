import styles from './styles.module.scss';
import Router from '../../../Router/index.js';
import ChannelsService from '../../../services/ChannelsService.js';
import UserState from '../../../state/UserState.js';
import WebSocketService from '../../../services/WebSocketService.js';
import LangState from '../../../state/LangState';

class OpenedAccessWindow extends HTMLElement {
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
                        This is an open channel. Click "Join channel" to enter.
                    </p>
                </div>
                <div class="${styles.actions}">
                    <button class="${styles.button}" data-role="back-to-home-btn">Back to home</button>
                    <button class="${styles.button}" data-role="join-channel-btn">Join Channel</button>
                </div>
            </div>
        `;
    }

    updateLanguage(lang) {
        const title = this.querySelector(`.${styles.title}`);
        const backToHomeBtn = this.querySelector('[data-role="back-to-home-btn"]');
        const joinChannelBtn = this.querySelector('[data-role="join-channel-btn"]');

        if (lang === 'en') {
            title.textContent = 'This is an open channel. Click "Join channel" to enter.';
            backToHomeBtn.textContent = 'Back to home';
            joinChannelBtn.textContent = 'Join channel';
        } else if (lang === 'ru') {
            title.textContent = 'Это открытый канал. Нажмите «Присоединиться», чтобы войти.';
            backToHomeBtn.textContent = 'На главную';
            joinChannelBtn.textContent = 'Присоединиться';
        }
    }

    attachEvents() {
        // back to home btn
        const backToHomeBtn = this.querySelector('[data-role="back-to-home-btn"]');
        const backToHome = () => {
            this.dispatchEvent(new CustomEvent('back-to-home', {
                bubbles: true,
                composed: true
            }));
        };
        this.addEvent(backToHomeBtn, 'click', backToHome);

        // join channel btn
        const joinChannelBtn = this.querySelector('[data-role="join-channel-btn"]');
        const joinChannel = async () => {
            const { id, name } = this.channel;
            if (!id) {
                console.error('Channel ID not found!');
                return;
            }
            try {
                await ChannelsService.joinChannel({ id, type: 'opened' });
                UserState.connectedChannelInfo.channelId = id; 
                UserState.connectedChannelInfo.channelName = name;
                await WebSocketService.connectToSocket(id);
                Router.init();
            } catch (e) {
                console.error('Failed to join channel:', e);
            }
        };
        this.addEvent(joinChannelBtn, 'click', joinChannel);
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
        if (!customElements.get('opened-access-window')) {
            customElements.define('opened-access-window', OpenedAccessWindow);
        }
    }
}

export default OpenedAccessWindow;
