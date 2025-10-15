import styles from './styles.module.scss';
import ChannelsService from '../../../../services/ChannelsService.js';
import Router from '../../../../Router/index.js';
import UserState from '../../../../state/UserState.js';
import WebSocketService from '../../../../services/WebSocketService.js';
import LangState from '../../../../state/LangState.js';

class ChannelPasswordModal extends HTMLElement {
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
        this.style.width = '100%';
        this.style.height = '100%';
        this.style.position = 'absolute';
        this.style.top = '50%';
        this.style.left = '50%';
        this.style.transform = 'translate(-50%, -50%)';
        this.style.background = 'rgba(0, 0, 0, 0.5)';
        this.style.zIndex = '1000';
        this.style.display = 'flex';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'center';
        this.style.visibility = 'hidden';
    }

    render() {
        this.innerHTML = `
            <form class="${styles.container}" data-role="form">
                <div class="${styles.header}">
                    <div class="${styles.title}">Enter password</div>
                </div>
                <div class="${styles.main}">
                    <input class="${styles.passwordInput}" data-role="password-input" type="password" autocomplete="channel-password" placeholder="Password"></input>
                </div>
                <div class="${styles.footer}">
                    <div class="${styles.btnsContainer}">
                        <button class="${styles.cancelBtn}" type="button" data-role="cancel-btn">Cancel</button>
                        <button class="${styles.continueBtn}" type="submit" data-role="continue-btn">Continue</button>
                    </div>
                </div>
            </form>
        `;
    }

    updateLanguage(lang) {
        const title = this.querySelector(`.${styles.title}`);
        const passwordInput = this.querySelector('[data-role="password-input"]');
        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const continueBtn = this.querySelector('[data-role="continue-btn"]');

        if (lang === 'en') {
            title.textContent = 'Enter password';
            passwordInput.placeholder = 'Password';
            cancelBtn.textContent = 'Cancel';
            continueBtn.textContent = 'Continue';
        } else if (lang === 'ru') {
            title.textContent = 'Введите пароль';
            passwordInput.placeholder = 'Пароль';
            cancelBtn.textContent = 'Отмена';
            continueBtn.textContent = 'Продолжить';
        }
    }

    attachEvents() {
        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const closePasswordModal = () => {
            this.dispatchEvent(new CustomEvent('close-channel-password-modal', {
                bubbles: true,
                composed: true
            }));
        };
        this.addEvent(cancelBtn, 'click', closePasswordModal);

        const form = this.querySelector('[data-role="form"]');
        const submitForm = async (event) => {
            event.preventDefault();
            const enteredPassword = this.querySelector('[data-role="password-input"]').value;
            const { id, name } = this.parentNode.channel;
            if (!id) {
                console.error('Channel ID not found!');
                return;
            }
            try {
                await ChannelsService.joinChannel({ id, type: 'closed', password: enteredPassword });
                UserState.connectedChannelInfo.channelId = id; 
                UserState.connectedChannelInfo.channelName = name;
                await WebSocketService.connectToSocket(id);
                Router.init();
            } catch(e) {
                console.error('Failed to join channel:', e);
            }
        };
        this.addEvent(form, 'submit', submitForm);
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
        if (!customElements.get('channel-password-modal')) {
            customElements.define('channel-password-modal', ChannelPasswordModal);
        }
    }
}

export default ChannelPasswordModal;
