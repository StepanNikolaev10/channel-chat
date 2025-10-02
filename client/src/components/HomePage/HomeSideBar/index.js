import styles from './styles.module.scss';
import ChannelsList from './ChannelsList/index.js';
import SearchMenu from './SearchMenu/index.js';

ChannelsList.define();
SearchMenu.define();

class HomeSideBar extends HTMLElement {
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
        this.style.minWidth = '300px';
        this.style.height = '100%';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.contentContainer}">
                <channels-list></channels-list>
                <search-menu></search-menu>
            </div>
        `;
    }

    attachEvents() {
        const contentContainer = this.querySelector(`.${styles.contentContainer}`);
        const channelsList = this.querySelector('channels-list');
        const searchMenu = this.querySelector('search-menu');

        // content container events
        const openSearchMenu = () => {
            channelsList.style.display = 'none';
            searchMenu.style.display = 'block';
        }
        this.addEvent(contentContainer, 'open-search-menu', openSearchMenu);

        const closeSearchMenu = () => {
            searchMenu.style.display = 'none';
            channelsList.style.display = 'block';
        }
        this.addEvent(contentContainer, 'close-search-menu', closeSearchMenu);

        const emptySearchResponse = () => {
            channelsList.stopSearchMode();
            searchMenu.style.display = 'none';
            channelsList.style.display = 'block';
        }
        this.addEvent(contentContainer, 'empty-search-response', emptySearchResponse);

        const searchResponse = (event) => {
            const { response, searchParamsCounter } = event.detail;
            channelsList.startSearchMode(response, searchParamsCounter)
            searchMenu.style.display = 'none';
            channelsList.style.display = 'block';
        }
        this.addEvent(contentContainer, 'search-response', searchResponse);

        const clearSearchSelectors = () => {
            searchMenu.clearSearchSelectors();
        }
        this.addEvent(contentContainer, 'clear-search-selectors', clearSearchSelectors);
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
        if (!customElements.get('home-side-bar')) {
            customElements.define('home-side-bar', HomeSideBar);
        }
    }
}

export default HomeSideBar;
