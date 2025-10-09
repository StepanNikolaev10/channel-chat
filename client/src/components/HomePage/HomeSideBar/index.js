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
        this.style.width = '300px';
        this.style.height = '100%';
        this.style.zIndex = '1000';
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
        const channelsList = this.querySelector('channels-list');
        const searchMenu = this.querySelector('search-menu');

        // channels list
        const openSearchMenu = () => {
            channelsList.style.display = 'none';
            searchMenu.style.display = 'block';
        }
        this.addEvent(channelsList, 'open-search-menu', openSearchMenu);

        const clearSearchSelectors = () => {
            searchMenu.clearSearchSelectors();
        }
        this.addEvent(channelsList, 'clear-search-selectors', clearSearchSelectors);

        // search menu
        const closeSearchMenu = () => {
            searchMenu.style.display = 'none';
            channelsList.style.display = 'block';
        }
        this.addEvent(searchMenu, 'close-search-menu', closeSearchMenu);

        const emptySearchResponse = () => {
            channelsList.stopSearchMode();
            searchMenu.style.display = 'none';
            channelsList.style.display = 'block';
        }
        this.addEvent(searchMenu, 'empty-search-response', emptySearchResponse);

        const searchResponse = (event) => {
            const { response, searchParamsCounter } = event.detail;
            channelsList.startSearchMode(response, searchParamsCounter)
            searchMenu.style.display = 'none';
            channelsList.style.display = 'block';
        }
        this.addEvent(searchMenu, 'search-response', searchResponse);
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
