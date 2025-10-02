import styles from './styles.module.scss';
import ChannelsService from '../../../../services/ChannelsService.js';
import UserState from '../../../../state/UserState.js'; 
import Router from '../../../../Router/index.js';
import WebSocketService from '../../../../services/WebSocketService.js';

class ChannelMenu extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
        this.channelData = {};
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
    }

    disconnectedCallback() {
        this.removeEvents();
    }

    setupStyles() {
        this.style.width = '100%';
        this.style.height = '100%';
        this.style.display = 'block';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.header}">
                    <div class="${styles.channelNameContainer}">
                        <div class="${styles.channelName}"></div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-channel-name-content"></div>
                        </div>
                    </div>
                </div>
                <div class="${styles.menu}" id="members">

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}">Description</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M93.5 174.5L256.5 337.5L419.5 174.5" stroke="white" stroke-width="24" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-description-content"></div>
                        </div>
                    </div>

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}">Tags</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M93.5 174.5L256.5 337.5L419.5 174.5" stroke="white" stroke-width="24" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-tags-content"></div>
                        </div>
                    </div>

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}">Members</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M93.5 174.5L256.5 337.5L419.5 174.5" stroke="white" stroke-width="24" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-members-content"></div>
                        </div>
                    </div>

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}">Creator</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M93.5 174.5L256.5 337.5L419.5 174.5" stroke="white" stroke-width="24" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-creator-content"></div>
                        </div>
                    </div>

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}">Your rights</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M93.5 174.5L256.5 337.5L419.5 174.5" stroke="white" stroke-width="24" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-rights-content"></div>
                        </div>
                    </div>

                </div>

                <div class="${styles.bottomContainer}">
                    <div class="${styles.leaveBtn}" id="leave-channels-btn">Leave</div>
                </div>

            </div>
        `;
    }

    setupContent(channelData) {
        this.channelData = channelData;
        this.renderSettingBtn(channelData)
        this.renderContent(channelData);
        this.attachEvents();
    }

    updateContent(channelData) {
        this.channelData = channelData;
        this.removeEvents();
        this.renderContent(channelData);
        this.attachEvents();
    }

    async renderContent(channelData) {
        const channelName = this.querySelector(`.${styles.channelName}`);
        channelName.textContent = channelData.name;
        const dropdownContent = this.querySelector('[data-role="dropdown-channel-name-content"]');
        dropdownContent.textContent = channelData.name;
        
        const description = this.querySelector('[data-role="dropdown-description-content"]');
        if (channelData.description) {
            description.textContent = channelData.description;
        } else {
            description.textContent = 'No description has been set for this channel';
        }

        const tags = this.querySelector('[data-role="dropdown-tags-content"]');
        if (channelData.tags.length === 0) {
            tags.textContent = 'No tags has been set for this channel';
        } else {
            tags.textContent = channelData.tags.map(tag => `#${tag}`).join(', ');
        }

        const members = this.querySelector('[data-role="dropdown-members-content"]');
        if (Array.isArray(channelData.members) && channelData.members.length > 0) {
            members.textContent = channelData.members.join(', ');
        } else {
            members.textContent = `Members count: ${channelData.membersCount ?? 0}`;
        }

        const creator = this.querySelector('[data-role="dropdown-creator-content"]');
        creator.textContent = channelData.createdBy.username;

        const yourRights = this.querySelector('[data-role="dropdown-rights-content"]');
        if(UserState.username === channelData.createdBy.username) {
            yourRights.textContent = 'You have administrator rights in this channel'
        } else {
            yourRights.textContent = 'You have user rights in this channel'
        }
    }

    renderSettingBtn(channelData) {
        if(UserState.userId === channelData.createdBy.id) {
            const channelMenuHeader = this.querySelector(`.${styles.header}`);
            const settingBtn = document.createElement('div');
            settingBtn.classList.add(styles.settingBtn);
            settingBtn.dataset.role = 'setting-btn';
            settingBtn.innerHTML = `
                <svg fill="white" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 478.703 478.703" xml:space="preserve">
                    <g>
                        <g>
                            <path d="M454.2,189.101l-33.6-5.7c-3.5-11.3-8-22.2-13.5-32.6l19.8-27.7c8.4-11.8,7.1-27.9-3.2-38.1l-29.8-29.8
                                c-5.6-5.6-13-8.7-20.9-8.7c-6.2,0-12.1,1.9-17.1,5.5l-27.8,19.8c-10.8-5.7-22.1-10.4-33.8-13.9l-5.6-33.2
                                c-2.4-14.3-14.7-24.7-29.2-24.7h-42.1c-14.5,0-26.8,10.4-29.2,24.7l-5.8,34c-11.2,3.5-22.1,8.1-32.5,13.7l-27.5-19.8
                                c-5-3.6-11-5.5-17.2-5.5c-7.9,0-15.4,3.1-20.9,8.7l-29.9,29.8c-10.2,10.2-11.6,26.3-3.2,38.1l20,28.1
                                c-5.5,10.5-9.9,21.4-13.3,32.7l-33.2,5.6c-14.3,2.4-24.7,14.7-24.7,29.2v42.1c0,14.5,10.4,26.8,24.7,29.2l34,5.8
                                c3.5,11.2,8.1,22.1,13.7,32.5l-19.7,27.4c-8.4,11.8-7.1,27.9,3.2,38.1l29.8,29.8c5.6,5.6,13,8.7,20.9,8.7c6.2,0,12.1-1.9,17.1-5.5
                                l28.1-20c10.1,5.3,20.7,9.6,31.6,13l5.6,33.6c2.4,14.3,14.7,24.7,29.2,24.7h42.2c14.5,0,26.8-10.4,29.2-24.7l5.7-33.6
                                c11.3-3.5,22.2-8,32.6-13.5l27.7,19.8c5,3.6,11,5.5,17.2,5.5l0,0c7.9,0,15.3-3.1,20.9-8.7l29.8-29.8c10.2-10.2,11.6-26.3,3.2-38.1
                                l-19.8-27.8c5.5-10.5,10.1-21.4,13.5-32.6l33.6-5.6c14.3-2.4,24.7-14.7,24.7-29.2v-42.1
                                C478.9,203.801,468.5,191.501,454.2,189.101z M451.9,260.401c0,1.3-0.9,2.4-2.2,2.6l-42,7c-5.3,0.9-9.5,4.8-10.8,9.9
                                c-3.8,14.7-9.6,28.8-17.4,41.9c-2.7,4.6-2.5,10.3,0.6,14.7l24.7,34.8c0.7,1,0.6,2.5-0.3,3.4l-29.8,29.8c-0.7,0.7-1.4,0.8-1.9,0.8
                                c-0.6,0-1.1-0.2-1.5-0.5l-34.7-24.7c-4.3-3.1-10.1-3.3-14.7-0.6c-13.1,7.8-27.2,13.6-41.9,17.4c-5.2,1.3-9.1,5.6-9.9,10.8l-7.1,42
                                c-0.2,1.3-1.3,2.2-2.6,2.2h-42.1c-1.3,0-2.4-0.9-2.6-2.2l-7-42c-0.9-5.3-4.8-9.5-9.9-10.8c-14.3-3.7-28.1-9.4-41-16.8
                                c-2.1-1.2-4.5-1.8-6.8-1.8c-2.7,0-5.5,0.8-7.8,2.5l-35,24.9c-0.5,0.3-1,0.5-1.5,0.5c-0.4,0-1.2-0.1-1.9-0.8l-29.8-29.8
                                c-0.9-0.9-1-2.3-0.3-3.4l24.6-34.5c3.1-4.4,3.3-10.2,0.6-14.8c-7.8-13-13.8-27.1-17.6-41.8c-1.4-5.1-5.6-9-10.8-9.9l-42.3-7.2
                                c-1.3-0.2-2.2-1.3-2.2-2.6v-42.1c0-1.3,0.9-2.4,2.2-2.6l41.7-7c5.3-0.9,9.6-4.8,10.9-10c3.7-14.7,9.4-28.9,17.1-42
                                c2.7-4.6,2.4-10.3-0.7-14.6l-24.9-35c-0.7-1-0.6-2.5,0.3-3.4l29.8-29.8c0.7-0.7,1.4-0.8,1.9-0.8c0.6,0,1.1,0.2,1.5,0.5l34.5,24.6
                                c4.4,3.1,10.2,3.3,14.8,0.6c13-7.8,27.1-13.8,41.8-17.6c5.1-1.4,9-5.6,9.9-10.8l7.2-42.3c0.2-1.3,1.3-2.2,2.6-2.2h42.1
                                c1.3,0,2.4,0.9,2.6,2.2l7,41.7c0.9,5.3,4.8,9.6,10,10.9c15.1,3.8,29.5,9.7,42.9,17.6c4.6,2.7,10.3,2.5,14.7-0.6l34.5-24.8
                                c0.5-0.3,1-0.5,1.5-0.5c0.4,0,1.2,0.1,1.9,0.8l29.8,29.8c0.9,0.9,1,2.3,0.3,3.4l-24.7,34.7c-3.1,4.3-3.3,10.1-0.6,14.7
                                c7.8,13.1,13.6,27.2,17.4,41.9c1.3,5.2,5.6,9.1,10.8,9.9l42,7.1c1.3,0.2,2.2,1.3,2.2,2.6v42.1H451.9z"/>
                            <path d="M239.4,136.001c-57,0-103.3,46.3-103.3,103.3s46.3,103.3,103.3,103.3s103.3-46.3,103.3-103.3S296.4,136.001,239.4,136.001
                                z M239.4,315.601c-42.1,0-76.3-34.2-76.3-76.3s34.2-76.3,76.3-76.3s76.3,34.2,76.3,76.3S281.5,315.601,239.4,315.601z"/>
                        </g>
                    </g>
                </svg>
            `;
            channelMenuHeader.append(settingBtn);
        }
    }

    attachEvents() {
        // settings btn
        if(UserState.userId === this.channelData.createdBy.id) {
            const settingBtn = this.querySelector('[data-role="setting-btn"]');
            const openSettingMenu = () => {
                this.dispatchEvent(new CustomEvent('open-channel-settings-menu', {
                    bubbles: true,
                    composed: true
                }));
            }
            this.addEvent(settingBtn, 'click', openSettingMenu);
        }

        // channel name
        const channelName = this.querySelector(`.${styles.channelName}`);
        if (channelName.scrollWidth > channelName.clientWidth) {
            channelName.classList.add(styles.isOverflowed);
            const channelNameContainer = this.querySelector(`.${styles.channelNameContainer}`);
            const dropdownMenu = channelNameContainer.querySelector(`.${styles.dropdownMenu}`);
            dropdownMenu.style.left = '0';
            const channelNameDropdownMenuToggle = () => {
                if(dropdownMenu.classList.contains(styles.dropdownMenuVisible)) {
                    dropdownMenu.classList.remove(styles.dropdownMenuVisible);
                } else {
                    dropdownMenu.classList.add(styles.dropdownMenuVisible);
                }
            }
            this.addEvent(channelName, 'click', channelNameDropdownMenuToggle);
        }

        // dropdown btns
        const dropdownBtns = Array.from(this.querySelectorAll('[data-role="dropdown-btn"]'));
        dropdownBtns.forEach(dropdownBtn => {
            const dropdownMenuToggle = (e) => {
                e.stopPropagation(); 

                const dropdownMenu = dropdownBtn.parentElement.querySelector('[data-role="dropdown-menu"]');
                const isOpen = dropdownMenu.classList.contains(styles.dropdownMenuVisible);

                dropdownBtns.forEach(b => {
                    b.classList.remove(styles.pressed);
                    const menu = b.parentElement.querySelector('[data-role="dropdown-menu"]');
                    if (menu) menu.classList.remove(styles.dropdownMenuVisible);
                });

                if (!isOpen) {
                    dropdownBtn.classList.add(styles.pressed);
                    dropdownMenu.classList.add(styles.dropdownMenuVisible);
                }
            }
            this.addEvent(dropdownBtn, 'click', dropdownMenuToggle);
        });
        
        // outside
        const closeDropdownOutside = (e) => {
            dropdownBtns.forEach(b => {
                const menu = b.parentElement.querySelector('[data-role="dropdown-menu"]');
                if (!menu.contains(e.target)) {
                    b.classList.remove(styles.pressed);
                    menu.classList.remove(styles.dropdownMenuVisible);
                }
            });
        }
        this.addEvent(document, 'click', closeDropdownOutside);

        // leave btn
        const leaveBtn = this.querySelector('#leave-channels-btn');
        const leaveChannel = async () => {
            try {
                await ChannelsService.leaveChannel();
                WebSocketService.disconnectFromSocket(UserState.connectedChannelInfo.channelId)
                UserState.connectedChannelInfo = {
                    channelId: 'none',
                    channelName: 'none'
                }
                Router.init();
            } catch (e) {
                console.error('Failed to leave from the channel:', e);
            }
        }
        this.addEvent(leaveBtn, 'click', leaveChannel);
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
        if (!customElements.get('channel-menu')) {
            customElements.define('channel-menu', ChannelMenu);
        }
    }
}

export default ChannelMenu;
