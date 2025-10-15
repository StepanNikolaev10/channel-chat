import styles from './styles.module.scss';
import ChannelsService from '../../../../services/ChannelsService.js';
import UserState from '../../../../state/UserState.js'; 
import Router from '../../../../Router/index.js';
import WebSocketService from '../../../../services/WebSocketService.js';
import LangState from '../../../../state/LangState.js';

class ChannelMenu extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
        this.langUnsubscribe = null;
        this.channelData = {};
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
    }

    disconnectedCallback() {
        this.removeEvents();
        if (this.langUnsubscribe) this.langUnsubscribe();
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
                        <div class="${styles.channelName}" data-role="channel-name"></div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-channel-name-content"></div>
                        </div>
                    </div>
                </div>
                <div class="${styles.menu}" id="members">

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}" data-role="btn-description">Description</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <img src="/dropdown-arrow.svg" alt="dropdown-arrow">
                            </div>
                        </div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-description-content"></div>
                        </div>
                    </div>

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}" data-role="btn-tags">Tags</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <img src="/dropdown-arrow.svg" alt="dropdown-arrow">
                            </div>
                        </div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-tags-content"></div>
                        </div>
                    </div>

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}" data-role="btn-members">Members</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <img src="/dropdown-arrow.svg" alt="dropdown-arrow">
                            </div>
                        </div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-members-content"></div>
                        </div>
                    </div>

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}" data-role="btn-creator">Creator</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <img src="/dropdown-arrow.svg" alt="dropdown-arrow">
                            </div>
                        </div>
                        <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                            <div class="${styles.dropdownContent}" data-role="dropdown-creator-content"></div>
                        </div>
                    </div>

                    <div class="${styles.dropdownBtnContainer}">
                        <div class="${styles.dropdownBtn}" data-role="dropdown-btn">
                            <div class="${styles.btnText}" data-role="btn-rights">Your rights</div>
                            <div class="${styles.btnSvg}" data-role="dropdown-btn-svg">
                                <img src="/dropdown-arrow.svg" alt="dropdown-arrow">
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
        this.langUnsubscribe = LangState.subscribe((newLang) => {
            this.updateLanguage(newLang);
        });
        this.updateLanguage(LangState.language);
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
        members.textContent = channelData.members.join(', ');

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
                <img src="/settings-btn.svg" alt="setting-btn">
            `;
            channelMenuHeader.append(settingBtn);
        }
    }


    updateLanguage(lang) {
        const btnDescription = this.querySelector('[data-role="btn-description"]');
        const btnTags = this.querySelector('[data-role="btn-tags"]');
        const btnMembers = this.querySelector('[data-role="btn-members"]');
        const btnCreator = this.querySelector('[data-role="btn-creator"]');
        const btnRights = this.querySelector('[data-role="btn-rights"]');

        const description = this.querySelector('[data-role="dropdown-description-content"]');
        const tags = this.querySelector('[data-role="dropdown-tags-content"]');
        const yourRights = this.querySelector('[data-role="dropdown-rights-content"]');

        if (lang === 'en') {
            btnDescription.textContent = 'Description';
            btnTags.textContent = 'Tags';
            btnMembers.textContent = 'Members';
            btnCreator.textContent = 'Creator';
            btnRights.textContent = 'Your rights';

            description.textContent = this.channelData.description || 'No description has been set for this channel';
            if (this.channelData.tags && this.channelData.tags.length > 0) {
                tags.textContent = this.channelData.tags.map(tag => `#${tag}`).join(', ');
            } else {
                tags.textContent = 'No tags has been set for this channel';
            }
            if (UserState.username === this.channelData.createdBy.username) {
                yourRights.textContent = 'You have administrator rights in this channel';
            } else {
                yourRights.textContent = 'You have user rights in this channel';
            }
        } else if (lang === 'ru') {
            btnDescription.textContent = 'Описание';
            btnTags.textContent = 'Теги';
            btnMembers.textContent = 'Участники';
            btnCreator.textContent = 'Создатель';
            btnRights.textContent = 'Ваши права';

            description.textContent = this.channelData.description || 'Описание канала не задано';
            if (this.channelData.tags && this.channelData.tags.length > 0) {
                tags.textContent = this.channelData.tags.map(tag => `#${tag}`).join(', ');
            } else {
                tags.textContent = 'Теги для канала не заданы';
            }
            if (UserState.username === this.channelData.createdBy.username) {
                yourRights.textContent = 'У вас есть права администратора в этом канале';
            } else {
                yourRights.textContent = 'У вас есть права пользователя в этом канале';
            }
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
