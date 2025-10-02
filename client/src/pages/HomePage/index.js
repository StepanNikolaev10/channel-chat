import styles from './styles.module.scss';
import AuthorizedHeader from '../../components/Shared/AuthorizedHeader/index.js';
import HomeSideBar from '../../components/HomePage/HomeSideBar/index.js';
import HomeWindow from '../../components/HomePage/HomeWindow/index.js';
import ClosedAccessWindow from '../../components/HomePage/ClosedAccessWindow/index.js';
import OpenedAccessWindow from '../../components/HomePage/OpenedAccessWindow/index.js';
import CreateChannelWindow from '../../components/HomePage/CreateChannelWindow/index.js';

AuthorizedHeader.define();
HomeSideBar.define();
HomeWindow.define();
ClosedAccessWindow.define();
OpenedAccessWindow.define();
CreateChannelWindow.define();

class HomePage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        document.title = 'Home - Channel Chat'
        this.setupStyles();
        this.render();
        this.setupEventListeners();
    }

    setupStyles() {
        this.style.height = '100%';
        this.style.display = 'flex';
        this.style.flexDirection = 'column';
    }

    render() {
        this.innerHTML = `
            <authorized-header></authorized-header>
            <main class="${styles.main}">
                <home-side-bar></home-side-bar>
                <div class="${styles.windows}">
                    <home-window></home-window>
                </div>
            </main>
        `;
    }

    setupEventListeners() {
        const channelMenu = this.querySelector('channels-list');
        if (channelMenu) {
            channelMenu.addEventListener('channel-selected', (event) => {
                this.onChannelSelected(event.detail);
            });
        }
        const homeHubSection = this.querySelector(`.${styles.windows}`);
        if (homeHubSection) {
            homeHubSection.addEventListener('back-to-home', () => {
                this.resetHomeHub();
            });
            homeHubSection.addEventListener('create-channel', (event) => {
                this.onCreateChannelMenu(event.detail)
            });
        }
        
    }

    onChannelSelected(channel) {
        const homeHubSection = this.querySelector(`.${styles.windows}`);
        if (!homeHubSection) return;
        homeHubSection.innerHTML = '';
        const elementTag = channel.type === 'closed' ? 'closed-access-window' : 'opened-access-window';
        const element = document.createElement(elementTag);
        element.channel = channel;
        homeHubSection.appendChild(element);
    }

    onCreateChannelMenu() {
        const homeHubSection = this.querySelector(`.${styles.windows}`);
        if (!homeHubSection) return;
        homeHubSection.innerHTML = '';
        const elementTag = 'create-channel-window';
        const element = document.createElement(elementTag);
        homeHubSection.appendChild(element);
    }

    resetHomeHub() {
        const homeHubSection = this.querySelector(`.${styles.windows}`);
        if (!homeHubSection) return;
        homeHubSection.innerHTML = '<home-window></home-window>';
    }

    static define() {
        if (!customElements.get('home-page')) {
            customElements.define('home-page', HomePage);
        }
    }
}

export default HomePage;
