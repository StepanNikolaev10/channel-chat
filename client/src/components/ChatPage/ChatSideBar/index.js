import styles from './styles.module.scss';
import ChannelMenu from './ChannelMenu/index.js';
import ChannelSettingsMenu from './ChannelSettingsMenu/index.js';
import ChannelsService from '../../../services/ChannelsService.js';
import UserState from '../../../state/UserState.js';

ChannelMenu.define();
ChannelSettingsMenu.define();

class ChatSideBar extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
        this.loadChildrenData();
        this.attachEvents();
    }

    disconnectedCallback() {
        this.removeEvents();
    }

    setupStyles() {
        this.style.width = '300px';
        this.style.height = '100%';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.contentContainer}">
                <channel-menu></channel-menu>
                <channel-settings-menu></channel-settings-menu>
            </div>
        `;
    }

    async loadChildrenData() {
        const channelData = await ChannelsService.getChannelInfo(UserState.connectedChannelInfo.channelId);
        const channelMenu = this.querySelector('channel-menu');
        channelMenu.setupContent(channelData);
        const channelSettingsMenu = this.querySelector('channel-settings-menu');
        channelSettingsMenu.setupContent(channelData);
    }

    async updateChildrenData(updatedChannelData) {
        const channelMenu = this.querySelector('channel-menu');
        channelMenu.updateContent(updatedChannelData);
        const channelSettingsMenu = this.querySelector('channel-settings-menu');
        channelSettingsMenu.updateContent(updatedChannelData);
    }

    attachEvents() {
        const channelMenu = this.querySelector('channel-menu');
        const channelSettingsMenu = this.querySelector('channel-settings-menu');
        
        // channel menu
        const openChannelSettingsMenu = () => {
            channelSettingsMenu.style.display = 'block';
            channelMenu.style.display = 'none';
        }
        this.addEvent(channelMenu, 'open-channel-settings-menu', openChannelSettingsMenu);
        
        // channel settings menu
        const closeChannelSettingsMenu = () => {
            channelSettingsMenu.style.display = 'none';
            channelMenu.style.display = 'block';
        }
        this.addEvent(channelSettingsMenu, 'close-channel-settings-menu', closeChannelSettingsMenu);

        const updateChannelData = (event) => {
            this.updateChildrenData(event.detail.updatedChannelData);
            channelSettingsMenu.style.display = 'none';
            channelMenu.style.display = 'block';
        }
        this.addEvent(channelSettingsMenu, 'update-channel-data', updateChannelData);
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
        if (!customElements.get('chat-side-bar')) {
            customElements.define('chat-side-bar', ChatSideBar);
        }
    }
}

export default ChatSideBar;
