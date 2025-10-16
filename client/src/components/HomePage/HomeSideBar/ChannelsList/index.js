import styles from './styles.module.scss';
import ChannelsService from '../../../../services/ChannelsService.js';
import LangState from '../../../../state/LangState.js';

class ChannelsList extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
        this.langUnsubscribe = null;
        this.channels = [];
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
        this.initChannelsList();
    }

    disconnectedCallback() {
        this.removeEvents();
        if (this.langUnsubscribe) this.langUnsubscribe();
    }

    setupStyles() {
        this.style.width = '100%';
        this.style.height = '100%';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.menu}">
                    <div class="${styles.title}">Channels</div>
                    <div class="${styles.actions}">
                        <div class="${styles.updateBtn}" data-role="update-channels-btn">
                            <svg width="20.000000" height="20.000000" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <defs>
                                    <clipPath id="clip55_1">
                                        <rect id="4213447-arrow-load-loading-refresh-reload-restart-sync_115423" width="20.000000" height="20.000000" fill="white" fill-opacity="0"/>
                                    </clipPath>
                                </defs>
                                <g clip-path="url(#clip55_1)">
                                    <path id="path" d="M15.01 16.18C13.39 17.5 11.34 18.12 9.26 17.92C7.62 17.76 6.09 17.12 4.85 16.07L6.87 16.07L6.87 14.82L2.81 14.82L2.81 18.89L4.06 18.89L4.06 17.03C5.48 18.23 7.25 18.98 9.15 19.15C9.45 19.18 9.73 19.2 10.01 19.2C12.12 19.2 14.15 18.48 15.79 17.14C18.78 14.73 19.95 10.81 18.78 7.15L17.59 7.53C18.59 10.71 17.59 14.1 15.01 16.18Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                    <path id="path" d="M16.09 3.07C12.78 0.15 7.73 -0.05 4.2 2.82C1.23 5.23 0.06 9.12 1.2 12.76L2.39 12.39C1.4 9.25 2.42 5.87 4.98 3.81C8.06 1.31 12.45 1.5 15.31 4.06L13.28 4.06L13.28 5.31L17.34 5.31L17.34 1.25L16.09 1.25L16.09 3.07Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
                <ul class="${styles.channels}" data-role="channels"></ul>
                <div class="${styles.btnContainer}" data-role="btn-container">
                    <div class="${styles.searchBtn}" data-role="search-btn">
                        <span class="${styles.searchBtnText}" data-role="search-btn-text"></span>
                        <div class="${styles.searchParamsCounter}" data-role="search-params-counter"></div>
                    </span>
                </div>
            </div>
        `;
    }

    async initChannelsList() {
        try {
            await this.updateChannels();
            this.attachEvents();
            this.langUnsubscribe = LangState.subscribe((newLang) => {
                this.updateLanguage(newLang);
            });
            this.updateLanguage(LangState.language);
        } catch (e) {
            console.error('Channels list initialization failed:', e);
        }
    }

    updateLanguage(lang) {
        const title = this.querySelector(`.${styles.title}`);
        const closedChannels = this.querySelectorAll(`.${styles.closedChannel}`);
        const openedChannels = this.querySelectorAll(`.${styles.openedChannel}`);
        const searchBtnText = this.querySelector(`.${styles.searchBtnText}`);

        if (lang === 'en') {
            title.textContent = 'Channels';
            closedChannels.forEach(closedChannel => {
                closedChannel.textContent = 'Closed';
            });
            openedChannels.forEach(openedChannel => {
                openedChannel.textContent = 'Opened';
            });
            searchBtnText.textContent = 'Search';
        } else if (lang === 'ru') {
            title.textContent = 'Каналы';
            closedChannels.forEach(closedChannel => {
                closedChannel.textContent = 'Закрытый';
            });
            openedChannels.forEach(openedChannel => {
                openedChannel.textContent = 'Открытый';
            });
            searchBtnText.textContent = 'Поиск';
        }
    }

    attachEvents() {
        // update btn
        const updateBtn = this.querySelector('[data-role="update-channels-btn"]');
        this.addEvent(updateBtn, 'click',  () => this.updateChannels());

        // search btn
        const searchBtn = this.querySelector('[data-role="search-btn"]');
        const openSearchMenu = () => {
            this.dispatchEvent(new CustomEvent('open-search-menu', {
                bubbles: true,
                composed: true
            }));
        }
        this.addEvent(searchBtn, 'click', openSearchMenu);

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
    
    removeEvent(element) {
        for (const listener of this.eventListeners) {
            if(listener.element === element) {
                listener.element.removeEventListener(listener.eventType, listener.handler);
            }
        }
    }

    async updateChannels() {
        try {
            const loadedChannels = await ChannelsService.getAllChannels();
            this.channels = loadedChannels;
            this.renderChannels(loadedChannels);
        } catch (e) {
            console.error('Failed to update channels:', e);
        }
    }

    renderChannels(channels) {
        const channelList = this.querySelector('[data-role="channels"]');
        channelList.innerHTML = '';

        channels.forEach(channelData => {
            const channel = document.createElement('li');
            channel.classList.add(styles.channel);
            channel.dataset.channelId = channelData.id;
            const selectChannel = () => {
                this.dispatchEvent(new CustomEvent('channel-selected', {
                    detail: channelData,
                    bubbles: true,
                    composed: true
                }));
            }
            this.addEvent(channel, 'click', selectChannel);
            
            const type = document.createElement('div');
            type.classList.add(styles.channelType);
            if (channelData.type === 'closed') {
                type.classList.add(styles.closedChannel);
                type.textContent = 'Closed';
            } else {
                type.classList.add(styles.openedChannel);
                type.textContent = 'Opened';
            }
            channel.append(type);

            const name = document.createElement('div');
            name.classList.add(styles.channelName);
            name.textContent = channelData.name;
            channel.append(name);

            const members = document.createElement('div');
            members.classList.add(styles.channelMembers);
            members.innerHTML = 
            ` 
                ${channelData.membersCount} 
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V19C5 16.2386 7.23858 14 10 14H14C16.7614 14 19 16.2386 19 19V20M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;

            channel.append(type, name, members);
            channelList.appendChild(channel);
        });

        this.checkAllChannelsOverflow();
    }

    checkAllChannelsOverflow() {
        const channelNames = this.querySelectorAll(`.${styles.channelName}`);
        setTimeout(() => {
            channelNames.forEach(nameElement => {
                if (nameElement.scrollWidth > nameElement.clientWidth) {
                    nameElement.classList.add(styles.isOverflowed);
                } else {
                    nameElement.classList.remove(styles.isOverflowed);
                }
            });
        }, 0);
    }

    startSearchMode(channels, searchParamsCounter) {
        this.renderChannels(channels);
        this.updateLanguage(LangState.language);

        const btnContainer = this.querySelector('[data-role="btn-container"]');
        if(!btnContainer.querySelector(`.${styles.stopSearchBtn}`)) {
            const stopSearchBtn = document.createElement('div');
            stopSearchBtn.classList.add(styles.stopSearchBtn);
            stopSearchBtn.textContent = 'Stop search';
            btnContainer.prepend(stopSearchBtn);

            const stopSearch = () => {
                this.stopSearchMode();
                this.dispatchEvent(new CustomEvent('clear-search-selectors', {
                    bubbles: true,
                    composed: true
                }));
            }
            this.addEvent(stopSearchBtn, 'click',  stopSearch);
        }
        const searchParamsCounterEl = this.querySelector('[data-role="search-params-counter"]');
        searchParamsCounterEl.textContent = searchParamsCounter;
        searchParamsCounterEl.classList.add(styles.visible);
    }

    stopSearchMode() {
        this.renderChannels(this.channels);

        const stopSearchBtn = this.querySelector(`.${styles.stopSearchBtn}`);
        this.removeEvent(stopSearchBtn);
        stopSearchBtn.remove();

        const searchParamsCounterEl = this.querySelector('[data-role="search-params-counter"]');
        searchParamsCounterEl.classList.remove(styles.visible)
    }

    static define() {
        if (!customElements.get('channels-list')) {
            customElements.define('channels-list', ChannelsList);
        }
    }
}

export default ChannelsList;
