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
        this.eventListeners = [];
    }

    async connectedCallback() {
        document.title = 'Home - Channel Chat'
        this.setupStyles();
        this.render();
        if(this.isMobile()) {
            this.loadMobileContent();
        }
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
            <main class="${styles.main}">
                <home-side-bar></home-side-bar>
                <div class="${styles.windows}">
                    <home-window></home-window>
                </div>
            </main>
        `;
    }

    loadMobileContent() {
        const authorizedHeader = this.querySelector('authorized-header');
        authorizedHeader.loadMobileContent();
        const homeSideBar = this.querySelector('home-side-bar');
        homeSideBar.style.position = 'absolute';
        if(!homeSideBar.classList.contains(styles.hidden)) {
            homeSideBar.classList.add(styles.hidden)
        }
    }

    isMobile() {
        return window.innerWidth <= 768; 
    }

    attachEvents() {
        // authorized header
        const authorizedHeader = this.querySelector('authorized-header');
        const toggleSideBar = () => {
            const homeSideBar = this.querySelector('home-side-bar');
            homeSideBar.classList.toggle(styles.hidden);
        }
        this.addEvent(authorizedHeader, 'toggle-side-bar', toggleSideBar);

        // home side bar
        const homeSideBar = this.querySelector('home-side-bar');
        const openSelectedChannelAccessWindow = (event) => {
            const windows = this.querySelector(`.${styles.windows}`);
            const channel = event.detail;
                windows.innerHTML = '';
                const elementTag = channel.type === 'closed' ? 'closed-access-window' : 'opened-access-window';
                const element = document.createElement(elementTag);
                element.channel = channel;
                windows.appendChild(element);
                if(this.isMobile()) {
                    homeSideBar.classList.add(styles.hidden)
                }
            }
        this.addEvent(homeSideBar, 'channel-selected', openSelectedChannelAccessWindow);

        // windows
        const windows = this.querySelector(`.${styles.windows}`);
        const backToHomeWindow = () => {
            windows.innerHTML = '<home-window></home-window>';
        }
        this.addEvent(windows, 'back-to-home', backToHomeWindow);

        const openCreateChannelWindow = () => {
            windows.innerHTML = '';
            const elementTag = 'create-channel-window';
            const element = document.createElement(elementTag);
            windows.appendChild(element);
        }
        this.addEvent(windows, 'create-channel', openCreateChannelWindow);

        // window
        const resizeWindow = () => {
            const homeSideBar = this.querySelector('home-side-bar');
            if(this.isMobile()) {
                authorizedHeader.loadMobileContent();
                homeSideBar.style.position = 'absolute';
                if(!homeSideBar.classList.contains(styles.hidden)) {
                    homeSideBar.classList.add(styles.hidden)
                }
            } else {
                authorizedHeader.loadDesktopContent();
                homeSideBar.style.position = 'relative';
                if(homeSideBar.classList.contains(styles.hidden)) {
                    homeSideBar.classList.remove(styles.hidden)
                }
            }
        }
        this.addEvent(window, 'resize', resizeWindow);
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
        if (!customElements.get('home-page')) {
            customElements.define('home-page', HomePage);
        }
    }
}

export default HomePage;
