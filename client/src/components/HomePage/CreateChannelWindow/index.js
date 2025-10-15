import styles from './styles.module.scss';
import ChannelsService from '../../../services/ChannelsService.js';
import UserState from '../../../state/UserState.js';
import Router from '../../../Router/index.js';
import WebSocketService from '../../../services/WebSocketService.js';
import TagSelectorModal from '../../Shared/TagSelectorModal/index.js';
import LangState from '../../../state/LangState';

TagSelectorModal.define();

class CreateChannelWindow extends HTMLElement {
    
    constructor() {
        super();
        this.eventListeners = [];
        this.langUnsubscribe = null;
        this.selectedChannelType = 'opened';
        this.selectedTags = [];
        this.additionalSettingsState = 'closed';
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
        this.attachEvents();
        this.langUnsubscribe = LangState.subscribe((newLang) => {
            this.updateLanguage(newLang);
        });
        this.updateLanguage(LangState.language);
    }

    disconnectedCallback() {
        this.removeEvents();
        if (this.langUnsubscribe) this.langUnsubscribe();
    }

    setupStyles() {
        this.style.flexGrow = '1';
        this.style.position = 'relative';
    }

    render() {
        this.innerHTML = `
            <form class="${styles.container}" data-role="create-channel-form">
                <div class="${styles.content}">
                    <p class="${styles.title}">Set up your channel</p>
                    <div class="${styles.mainSettings}">
                        <div class="${styles.setting}">
                            <input class="${styles.settingInput}" data-role="channel-name-input" type="text" data-required="true" placeholder="Name"></input>
                        </div>
                        <div class="${styles.setting}">
                            <div class="${styles.settingTitle}">Type:</div>
                            <div class="${styles.settingTypeSelector}" data-role="type-selector">
                                <button class="${styles.settingTypeSelection} ${styles.openedTypeSelection} ${styles.selectedTypeSelection}" data-role="public" type="button">Public</button>
                                <button class="${styles.settingTypeSelection} ${styles.closedTypeSelection}" data-role="closed" type="button">Closed</button>
                            </div>
                        </div>
                        <div class="${styles.setting}">
                            <input class="${styles.settingInput}" data-role="password-input" type="text" data-required="true" disabled="true" placeholder="Password"></input>
                        </div>
                    </div>
                    <div class="${styles.additionalSettings}">
                        <div class="${styles.additionalSettingsHeader}">
                            <div class="${styles.additionalSettingsTitle}">Additional settings</div>
                            <div class="${styles.openAdditionalSettingsBtn}" data-role="open-additional-settings-btn">
                                <svg width="20" height="20" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M93.5 174.5L256.5 337.5L419.5 174.5" stroke="black" stroke-width="24" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="${styles.additionalSettingsMain}" data-role="additional-settings-main">
                            <div class="${styles.setting}">
                                <input class="${styles.settingInput}" data-role="description-input" type="text" placeholder="Description"></input>
                            </div>
                            <div class="${styles.setting}">
                                <div class="${styles.tagListSettingTitle} ${styles.settingTitle} ">Tags:</div>
                                <div class="${styles.settingTagList}" data-role="setting-tag-list">
                                    <button class="${styles.settingAddBtn}" data-role="add-tags-btn" type="button">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="${styles.actions}">
                    <button class="${styles.button}" data-role="back-to-home-btn" type="button">Back to home</button>
                    <button class="${styles.button}" data-role="create-channel-btn" type="submit">Create</button>
                </div>
            </form>
            <tag-selector-modal></tag-selector-modal>
        `;
    }

    updateLanguage(lang) {
        const title = this.querySelector(`.${styles.title}`);
        const nameInput = this.querySelector('[data-role="channel-name-input"]');
        const passwordInput = this.querySelector('[data-role="password-input"]');
        const typeTitle = this.querySelector(`.${styles.settingTitle}`);
        const publicBtn = this.querySelector(`[data-role="public"]`);
        const closedBtn = this.querySelector(`[data-role="closed"]`);
        const additionalTitle = this.querySelector(`.${styles.additionalSettingsTitle}`);
        const descriptionInput = this.querySelector('[data-role="description-input"]');
        const tagsTitle = this.querySelector(`.${styles.tagListSettingTitle}`);
        const addBtn = this.querySelector('[data-role="add-tags-btn"]');
        const backBtn = this.querySelector('[data-role="back-to-home-btn"]');
        const createBtn = this.querySelector('[data-role="create-channel-btn"]');

        if (lang === 'en') {
            title.textContent = 'Set up your channel';
            nameInput.placeholder = 'Name';
            typeTitle.textContent = 'Type:';
            publicBtn.textContent = 'Public';
            closedBtn.textContent = 'Closed';
            passwordInput.placeholder = 'Password';
            additionalTitle.textContent = 'Additional settings';
            descriptionInput.placeholder = 'Description';
            tagsTitle.textContent = 'Tags:';
            addBtn.textContent = 'Add';
            backBtn.textContent = 'Back to home';
            createBtn.textContent = 'Create';
        } else if (lang === 'ru') {
            title.textContent = 'Настройте свой канал';
            nameInput.placeholder = 'Название';
            typeTitle.textContent = 'Тип:';
            publicBtn.textContent = 'Открытый';
            closedBtn.textContent = 'Закрытый';
            passwordInput.placeholder = 'Пароль';
            additionalTitle.textContent = 'Дополнительные настройки';
            descriptionInput.placeholder = 'Описание';
            tagsTitle.textContent = 'Теги:';
            addBtn.textContent = 'Добавить';
            backBtn.textContent = 'Назад на главную';
            createBtn.textContent = 'Создать';
        }
    }

    attachEvents() {
        // Back to home button
        const backBtn = this.querySelector('[data-role="back-to-home-btn"]');
        const backBtnHandler = () => {
            this.dispatchEvent(new CustomEvent('back-to-home', { bubbles: true, composed: true }));
        }
        this.addEvent(backBtn, 'click', backBtnHandler);

        // channel type btns
        const settingTypeSelections = Array.from(this.querySelectorAll(`.${styles.settingTypeSelection}`));
        for (const typeSelection of settingTypeSelections) {
            const changeType = (event) => {
                const settingTypeSelection = event.currentTarget;
                if (settingTypeSelection.classList.contains(styles.openedTypeSelection) && settingTypeSelection.classList.contains(styles.selectedTypeSelection)) {
                    this.selectedChannelType = 'closed';
                    settingTypeSelection.classList.remove(styles.selectedTypeSelection);
                    const newSelectedSelection = settingTypeSelections.find(selection => selection.classList.contains(styles.closedTypeSelection));
                    newSelectedSelection.classList.add(styles.selectedTypeSelection);
                    const passwordInput = this.querySelector('[data-role="password-input"]');
                    passwordInput.disabled = false;
                } else if (settingTypeSelection.classList.contains(styles.closedTypeSelection) && settingTypeSelection.classList.contains(styles.selectedTypeSelection)) {
                    this.selectedChannelType = 'opened';
                    settingTypeSelection.classList.remove(styles.selectedTypeSelection);
                    const newSelectedSelection = settingTypeSelections.find(selection => selection.classList.contains(styles.openedTypeSelection));
                    newSelectedSelection.classList.add(styles.selectedTypeSelection);
                    const passwordInput = this.querySelector('[data-role="password-input"]');
                    passwordInput.disabled = true;
                    if(passwordInput.value !== '') {
                        passwordInput.value = '';
                    }
                }
            }
            
            this.addEvent(typeSelection, 'click', changeType);
        }

        // add tags btn
        const addTagsBtn = this.querySelector('[data-role="add-tags-btn"]');
        const openTagSelectorModal = () => {
            const tagSelectorModal = this.querySelector('tag-selector-modal');
            tagSelectorModal.style.visibility = 'visible';
        }
        this.addEvent(addTagsBtn, 'click', openTagSelectorModal);

        // open additional settings btn
        const openAdditionalSettingsBtn = this.querySelector('[data-role="open-additional-settings-btn"]');
        const openAdditionalSettings = () => {
            const additionalSettingsMain = this.querySelector('[data-role="additional-settings-main"]');
            if (this.additionalSettingsState === 'closed') {
                this.additionalSettingsState = 'opened';
                additionalSettingsMain.classList.add(styles.opened);
                openAdditionalSettingsBtn.classList.add(styles.pressed);
            } else {
                this.additionalSettingsState = 'closed';
                additionalSettingsMain.classList.remove(styles.opened);
                openAdditionalSettingsBtn.classList.remove(styles.pressed);
            }
        }
        this.addEvent(openAdditionalSettingsBtn, 'click', openAdditionalSettings);

        // form submit
        const form = this.querySelector('[data-role="create-channel-form"]');
        const submitForm = async (event) => {
            event.preventDefault(); 
            if(this.validation(form) === true) {
                const name = form.querySelector('[data-role="channel-name-input"]').value;
                const type = this.selectedChannelType;
                const password = form.querySelector('[data-role="password-input"]').value;
                const description = form.querySelector('[data-role="description-input"]').value;
                const tags = this.selectedTags;
                try {
                    const response = await ChannelsService.createChannel({ name, type, password, description, tags });
                    UserState.connectedChannelInfo.channelId = response.id;
                    UserState.connectedChannelInfo.channelName = name;
                    await WebSocketService.connectToSocket(UserState.connectedChannelInfo.channelId);
                    Router.init();
                } catch(e) {
                    console.error('Failed to create channel:', e);
                }
            }
        }
        this.addEvent(form, 'submit', submitForm);

        // TagSelectorModal events
        const tagSelectorModal = this.querySelector('tag-selector-modal');
        if (tagSelectorModal) {
            const closeTagSelectorModal = (event) => {
                event.target.style.visibility = 'hidden';
            }
            this.addEvent(tagSelectorModal, 'close-tag-selector-modal', closeTagSelectorModal);

            const saveTags = (event) => {
                this.selectedTags = event.detail.tags;
                event.target.style.visibility = 'hidden';

                const settingTagList = this.querySelector('[data-role="setting-tag-list"]');
                const tags = settingTagList.querySelectorAll(`.${styles.tag}`);
                tags.forEach(tag => tag.remove());

                for (const selectedTag of this.selectedTags) {
                    const tag = document.createElement('div');
                    tag.classList.add(styles.tag);

                    const deleteTag = () => {
                        const tagToDeleteId = this.selectedTags.indexOf(selectedTag);
                        this.selectedTags.splice(tagToDeleteId, 1);
                        tag.remove();
                        tagSelectorModal.syncSelectedTags(this.selectedTags);
                    }
                    this.addEvent(tag, 'click', deleteTag);

                    const tagName = document.createElement('div');
                    tagName.classList.add(styles.tagName);
                    tagName.textContent = `${selectedTag}`;
                    const deleteTagBtn = document.createElement('span');
                    deleteTagBtn.classList.add(styles.deleteTagBtn);

                    tag.append(tagName, deleteTagBtn);
                    settingTagList.insertBefore(tag, settingTagList.lastElementChild);
                }
            }
            this.addEvent(tagSelectorModal, 'save-tags', saveTags);
        }
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

    validation(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.classList.contains(styles.erroredInput)) {
                input.classList.remove(styles.erroredInput);
            }
        });

        for (const input of inputs) {
            if (input.dataset.role === 'channel-name-input') {
                if (!isEmptyValidation(input)) {
                    return false;
                } else if (!regexValidation(input)) {
                    return false;
                }
            } else if (input.dataset.role === 'password-input' && this.selectedChannelType === 'closed') {
                if (!isEmptyValidation(input)) {
                    return false;
                } else if (!regexValidation(input)) {
                    return false;
                }
            } else if (input.dataset.role === 'description-input') {
                if (!regexValidation(input)) {
                    return false;
                }
            }
        }
        return true;

        function isEmptyValidation(input) {
            if (input.dataset.role === 'channel-name-input' && !input.value.trim()) {
                createError(input, 'Fill in the channel name field');
                return false;
            } else if (input.dataset.role === 'password-input' && !input.value.trim()) {
                createError(input, 'Fill in the password field');
                return false;
            }
            return true;
        }

        function regexValidation(input) {
            if (input.dataset.role === 'channel-name-input') {
                const allowedCharacters = /^[a-zA-Z0-9_-]{3,30}$/;
                if (!allowedCharacters.test(input.value)) {
                    createError(input, 'Channel name must be 3–30 characters, and can only contain letters, numbers, underscores, and dashes.');
                    return false;
                }
            } else if (input.dataset.role === 'password-input') {
                const allowedCharacters = /^[a-zA-Z0-9!@#$%^&*()_+={}\[\].,:;"'<>?/|\\\-~]{4,40}$/;
                if (!allowedCharacters.test(input.value)) {
                    createError(input, 'Password must be 4–40 characters. Letters, numbers, and common symbols are allowed.');
                    return false;
                }
            } else if (input.dataset.role === 'description-input') {
                if (input.value !== '' && input.value.length > 500) {
                    createError(input, 'Description must be less than 500 characters.');
                    return false;
                }
            }
            return true;
        }

        function createError(input, text) {
            const errorArea = document.querySelector(`.${styles.content}`);
            input.classList.add(styles.erroredInput);
            const error = document.createElement('div');
            error.classList.add(styles.errorMessage);
            error.textContent = text;

            const existentError = errorArea.querySelector(`.${styles.errorMessage}`);
            if (existentError) {
                existentError.remove();
            }
            errorArea.append(error);
        }
    }

    static define() {
        if (!customElements.get('create-channel-window')) {
            customElements.define('create-channel-window', CreateChannelWindow);
        }
    }
}

export default CreateChannelWindow;