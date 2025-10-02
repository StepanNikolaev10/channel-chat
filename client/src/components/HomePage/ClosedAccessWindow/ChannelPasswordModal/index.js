import styles from './styles.module.scss';
import ChannelsService from '../../../../services/ChannelsService.js';
import Router from '../../../../Router/index.js';
import UserState from '../../../../state/UserState.js';
import WebSocketService from '../../../../services/WebSocketService.js';

class ChannelPasswordModal extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
        this.attachEvents();
    }

    disconnectedCallback() {
        this.removeEvents();
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
                        <button class="${styles.continueBtn}" type="submit" data-role="continue-btn">Сontinue</button>
                    </div>
                </div>
            </form>
        `;
    }

    attachEvents() {
        // cancel btn 
        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const closePasswordModal = () => {
            this.dispatchEvent(new CustomEvent('close-channel-password-modal', {
                bubbles: true,
                composed: true
            }));
        }
        this.addEvent(cancelBtn, 'click', closePasswordModal);

        // form
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
                // важно что бы данные канала в UserState обновился перед рендером
                // что бы компонент мог получить необходимую информацию о канале из его id.
                await WebSocketService.connectToSocket(id);
                Router.init();
            } catch(e) {
                console.error('Failed to join channel:', e);
            }
        }
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