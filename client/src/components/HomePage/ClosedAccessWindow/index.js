import styles from './styles.module.scss';
import ChannelPasswordModal from './ChannelPasswordModal/index.js';
import LangState from '../../../state/LangState';

ChannelPasswordModal.define();

class ClosedAccessWindow extends HTMLElement {
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
        this.style.position = 'relative';
        this.style.flexGrow = '1';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.content}">
                    <p class="${styles.title}">
                        This is a closed channel. To join, you need to enter a password.
                    </p>
                </div>
                <div class="${styles.actions}">
                    <button class="${styles.button}" data-role="back-to-home">Back to home</button>
                    <button class="${styles.button}" data-role="enter-password-btn">Enter password</button>
                </div>
            </div>
            <channel-password-modal></channel-password-modal>
        `;
    }

    updateLanguage(lang) {
        const title = this.querySelector(`.${styles.title}`);
        const backToHomeBtn = this.querySelector('[data-role="back-to-home"]');
        const enterPasswordBtn = this.querySelector('[data-role="enter-password-btn"]');

        if (lang === 'en') {
            title.textContent = 'This is a closed channel. To join, you need to enter a password.';
            backToHomeBtn.textContent = 'Back to home';
            enterPasswordBtn.textContent = 'Enter password';
        } else if (lang === 'ru') {
            title.textContent = 'Это закрытый канал. Чтобы присоединиться, нужно ввести пароль.';
            backToHomeBtn.textContent = 'На главную';
            enterPasswordBtn.textContent = 'Ввести пароль';
        }
    }

    attachEvents() {
        // back to home btn 
        const backToHomeBtn = this.querySelector('[data-role="back-to-home"]');
        const backToHome = () => {
            this.dispatchEvent(new CustomEvent('back-to-home', {
                bubbles: true,
                composed: true,
            }));
        };
        this.addEvent(backToHomeBtn, 'click', backToHome);

        // enter password btn
        const enterPasswordBtn = this.querySelector('[data-role="enter-password-btn"]');
        const enterPassword = () => {
            const channelPasswordModal = this.querySelector('channel-password-modal');
            channelPasswordModal.style.visibility = 'visible';
        };
        this.addEvent(enterPasswordBtn, 'click', enterPassword);

        // channel password modal
        const channelPasswordModal = this.querySelector('channel-password-modal');
        const closeChannelPasswordModal = (event) => {
            event.target.style.visibility = 'hidden';
        };
        this.addEvent(channelPasswordModal, 'close-channel-password-modal', closeChannelPasswordModal);
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
        if (!customElements.get('closed-access-window')) {
            customElements.define('closed-access-window', ClosedAccessWindow);
        }
    }
}

export default ClosedAccessWindow;
