import styles from './styles.module.scss';
import AuthorizedHeader from '../../components/Shared/AuthorizedHeader/index.js';
import ChatSideBar from '../../components/ChatPage/ChatSideBar/index.js';
import ChatWindow from '../../components/ChatPage/ChatWindow/index.js';
import TagSelectorModal from '../../components/Shared/TagSelectorModal/index.js';
import UserState from '../../state/UserState.js';

AuthorizedHeader.define();
ChatSideBar.define();
ChatWindow.define();
TagSelectorModal.define();

class ChatPage extends HTMLElement {
    constructor() {
        document.title = `${UserState.connectedChannelInfo.channelName} - Channel Chat`;
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
        this.style.height = '100%';
        this.style.display = 'flex';
        this.style.flexDirection = 'column';
    }

    render() {
        this.innerHTML = `
            <authorized-header></authorized-header>
            <div class="${styles.main}">
                <chat-side-bar></chat-side-bar>
                <div class="${styles.windows}">
                    <chat-window></chat-window>
                </div>
            </div>
            <tag-selector-modal><tag-selector-modal>
        `;
    }

    attachEvents() {
        const chatSideBar = this.querySelector('chat-side-bar');
        const tagSelectorModal = this.querySelector('tag-selector-modal');
        
        // chat side bar 
        const openTagSelectorModal = (event) => {
            tagSelectorModal.syncSelectedTags(event.detail);
            tagSelectorModal.style.visibility = 'visible';
        }
        this.addEvent(chatSideBar, 'open-tag-selector-modal', openTagSelectorModal);

        // tag selector modal
        const saveTagsToChannelSettingsMenu = (event) => {
            const channelSettingsMenu = chatSideBar.querySelector('channel-settings-menu');
            channelSettingsMenu.addSelectedTags(event.detail.tags);
            tagSelectorModal.style.visibility = 'hidden';
        }
        this.addEvent(tagSelectorModal, 'save-tags',  saveTagsToChannelSettingsMenu);

        const closeTagSelectorModal = () => {
            tagSelectorModal.style.visibility = 'hidden';
        }
        this.addEvent(tagSelectorModal, 'close-tag-selector-modal',  closeTagSelectorModal);
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
        if (!customElements.get('chat-page')) {
            customElements.define('chat-page', ChatPage);
        }
    }
}

export default ChatPage;
