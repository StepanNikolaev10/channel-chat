import styles from './styles.module.scss';
import ChannelsService from '../../../../services/ChannelsService.js';
import UserState from '../../../../state/UserState.js';
import Router from '../../../../Router/index.js';
import LangState from '../../../../state/LangState.js';

class ChannelSettingsMenu extends HTMLElement {

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
        this.style.display = 'none';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.header}">
                    <div class="${styles.title}">Channel settings</div>
                </div>
                <form class="${styles.form}" data-role="form">
                    <div class="${styles.formColumn}">
                        <div class="${styles.formRow}">
                            <label class="${styles.formLabel}" data-role="change-name-input-label" for="change-name-input">Change name</label>
                            <input class="${styles.formInput}" data-role="change-name-input" type="text" id="change-name-input" placeholder="Enter new name here..." />
                        </div>
                        <div class="${styles.formRow}">
                            <label class="${styles.formLabel}" data-role="change-description-input-label" for="change-description-input">Change description</label>
                            <input class="${styles.formInput}" data-role="change-description-input" type="text" id="change-description-input" placeholder="Enter new description here..." />
                        </div>
                        <div class="${styles.formRow}">
                            <div class="${styles.formLabel}" data-role="change-tags-input-label">Change tags:</div>
                            <div class="${styles.formTagsList}" data-role="form-tag-list">
                                <button class="${styles.settingAddBtn}" data-role="add-tags-btn" type="button">Add</button>
                            </div>
                        </div>
                        <div class="${styles.formRow} ${styles.deleteChannelBtnRow}">
                            <button class="${styles.deleteChannelBtn}" data-role="delete-channel-btn" type="button">Delete channel</button>
                        </div>
                    </div>
                    <div class="${styles.formActions}">
                        <button type="button" class="${styles.button} ${styles.buttonCancel}" data-role="cancel-btn">Cancel</button>
                        <button type="submit" class="${styles.button} ${styles.buttonContinue}" data-role="save-btn">Save</button>
                    </div>
                </form>
            </div>
        `;
    }

    setupContent(channelData) {
        this.channelData = channelData;
        this.renderContent(channelData.tags, channelData.type);
        this.attachEvents();
        this.langUnsubscribe = LangState.subscribe((newLang) => {
            this.updateLanguage(newLang);
        });
        this.updateLanguage(LangState.language);
    }

    updateContent(channelData) {
        this.channelData = channelData;
        this.removeEvents();
        this.renderContent(channelData.tags, channelData.type);
        this.attachEvents();
    }

    renderContent(tags, type) {
        const tagList = this.querySelector('[data-role="form-tag-list"]');
        tagList.innerHTML = `<button class="${styles.settingAddBtn}" data-role="add-tags-btn" type="button">Add</button>`;
        for (const tag of tags) {
            const tagEl = document.createElement('div');
            tagEl.classList.add(styles.tag);
            tagEl.dataset.role = `${tag}`;

            const tagName = document.createElement('div');
            tagName.classList.add(styles.tagName);
            tagName.textContent = `${tag}`;
            const deleteTagBtn = document.createElement('span');
            deleteTagBtn.classList.add(styles.deleteTagBtn);

            tagEl.append(tagName, deleteTagBtn);
            tagList.insertBefore(tagEl, tagList.lastElementChild);
        }
        
        if (type === 'closed') {
            const formColumn = this.querySelector(`.${styles.formColumn}`);
            const formRow = document.createElement('div');
            formRow.classList.add(styles.formRow);

            const formLabel = document.createElement('div');
            formLabel.classList.add(styles.formLabel);
            formInput.dataset.role = 'change-password-input-label';
            formLabel.textContent = 'Change password';
            
            const formInput = document.createElement('input');
            formInput.classList.add(styles.formInput);
            formInput.dataset.role = 'change-password-input';
            formInput.type = 'text';
            formInput.placeholder = 'Enter new password here...';

            formRow.append(formLabel, formInput);
            formColumn.insertBefore(formRow, formColumn.lastElementChild);
        }
    }

    updateLanguage(lang) {
        const title = this.querySelector(`.${styles.title}`);
        const nameLabel = this.querySelector('[data-role="change-name-input-label"]');
        const nameInput = this.querySelector('[data-role="change-name-input"]');
        const descLabel = this.querySelector('[data-role="change-description-input-label"]');
        const descInput = this.querySelector('[data-role="change-description-input"]');
        const tagsLabel = this.querySelector('[data-role="change-tags-input-label"]');
        const addBtn = this.querySelector('[data-role="add-tags-btn"]');
        const deleteBtn = this.querySelector('[data-role="delete-channel-btn"]');
        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const saveBtn = this.querySelector('[data-role="save-btn"]');
        const passwordLabel = this.querySelector('[data-role="change-password-input-label"]');
        const passwordInput = this.querySelector('[data-role="change-password-input"]');
        if (lang === 'en'){
            title.textContent = 'Channel settings';
            nameLabel.textContent = 'Change name';
            nameInput.placeholder = 'Enter new name here...';
            descLabel.textContent = 'Change description';
            descInput.placeholder = 'Enter new description here...';
            tagsLabel.textContent = 'Change tags:';
            addBtn.textContent = 'Add';
            deleteBtn.textContent = 'Delete channel';
            cancelBtn.textContent = 'Cancel';
            saveBtn.textContent = 'Save';
            if(this.channelData.type === 'closed') {
                passwordLabel.textContent = 'Change password';
                passwordInput.placeholder = 'Enter new password here...';
            }
        } else if (lang === 'ru') {
            title.textContent = 'Настройки канала';
            nameLabel.textContent = 'Сменить имя';
            nameInput.placeholder = 'Веедите новое имя...';
            descLabel.textContent = 'Сменить описание';
            descInput.placeholder = 'Введите новое описание...';
            tagsLabel.textContent = 'Сменить теги:';
            addBtn.textContent = 'Добавить';
            deleteBtn.textContent = 'Удалить канал';
            cancelBtn.textContent = 'Отмена';
            saveBtn.textContent = 'Сохранить';
            if(this.channelData.type === 'closed') {
                passwordLabel.textContent = 'Сменить пароль';
                passwordInput.placeholder = 'Введите новый пароль...';
            }
        }
    }

    attachEvents() {
        // tag btns
        const tags = this.querySelectorAll(`.${styles.tag}`);
        tags.forEach(tag => {
            const deleteTag = () => tag.remove();
            this.addEvent(tag, 'click', deleteTag);
        });

        // add tags btn
        const addTagsBtn = this.querySelector('[data-role="add-tags-btn"]');
        const openTagSelectorModal = () => {
            const tags = Array.from(this.querySelectorAll(`.${styles.tag}`)).map(tag => tag.dataset.role);
            this.dispatchEvent(new CustomEvent('open-tag-selector-modal', {
                detail: tags,
                bubbles: true,
                composed: true
            }));
        }
        this.addEvent(addTagsBtn, 'click', openTagSelectorModal);

        // delete channel btn
        const deleteChannelBtn = this.querySelector('[data-role="delete-channel-btn"]');
        const deleteChannel = async () => {
            try {
                await ChannelsService.deleteChannel(UserState.connectedChannelInfo.channelId);
                UserState.connectedChannelInfo.channelId = 'none';
                UserState.connectedChannelInfo.channelName = 'none';
                Router.init();
            } catch(e) {
                console.error(`delete channel error: ${e}`);
            }
        }
        this.addEvent(deleteChannelBtn, 'click', deleteChannel);

        // cancel btn
        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const closeMenu = () => {
            this.dispatchEvent(new CustomEvent('close-channel-settings-menu', {
                bubbles: true,
                composed: true
            }));
        }
        this.addEvent(cancelBtn, 'click', closeMenu);

        // form
        const form = this.querySelector('[data-role="form"]');
        const submitForm = async (event) => {
            event.preventDefault();
            try {
                const name = this.querySelector('[data-role="change-name-input"]').value.trim();
                const description = this.querySelector('[data-role="change-description-input"]').value.trim();
                const tags = Array.from(this.querySelectorAll(`.${styles.tag}`)).map(tag => tag.dataset.role);
                const type = this.channelData.type;
                let password = type === 'closed' ? this.querySelector('[data-role="change-password-input"]').value.trim() : null;

                const channelData = { name, type, description, tags };
                if (password) channelData.password = password;

                const updatedChannelData = await ChannelsService.editChannel(UserState.connectedChannelInfo.channelId, channelData);

                if(updatedChannelData) {
                    this.dispatchEvent(new CustomEvent('update-channel-data', {
                        detail: { updatedChannelData },
                        bubbles: true,
                        composed: true
                    }));
                }
            } catch(e) {
                console.error(e);
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

    addSelectedTags(selectedTags) {
        this.removeEvents();
        this.renderContent(selectedTags, this.channelData.type);
        this.attachEvents();
    }

    static define() {
        if (!customElements.get('channel-settings-menu')) {
            customElements.define('channel-settings-menu', ChannelSettingsMenu);
        }
    }
}

export default ChannelSettingsMenu;
