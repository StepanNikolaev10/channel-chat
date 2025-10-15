import styles from './styles.module.scss';
import LangState from '../../../state/LangState.js';

class LanguageSelector extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
    }

    connectedCallback() {
        this.render();
        this.initLangFlagBtns();
        this.attachEvents();
    }

    disconnectedCallback() {
        this.removeEvents();
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.flagBtnContainer}" data-role="flag-btn-container">
                    <div class="${styles.flagBtn}" data-role="selected-flag"></div>
                    <div class="${styles.flagBtn} ${styles.hidden}" data-role="unselected-flag"></div>
                </div>
                <button class="${styles.toggleDropdownBtn}" data-role="toggle-dropdown-menu-btn">
                    <div class="${styles.toggleDropdownBtnIcon}">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.82 7.77L3.12 8.52L8.05 13.76L12.97 19L17.92 13.73L22.87 8.47L22.18 7.73L21.49 7L17.24 11.51L12.99 16.03L8.76 11.52L4.52 7.02L3.82 7.77Z"/>
                        </svg>
                    </div>
                </button>
            </div>
        `;
    }

    initLangFlagBtns() {
        const selectedFlag= this.querySelector('[data-role="selected-flag"]');
        const unselectedFlag = this.querySelector('[data-role="unselected-flag"]');
        selectedFlag.innerHTML = '';
        unselectedFlag.innerHTML = '';
        const aviableLangs = ['en', 'ru'];
        for(let aviableLang of aviableLangs) {
            const flagImg = document.createElement('img');
            flagImg.src = `${aviableLang}-flag.svg`;
            flagImg.alt = `${aviableLang}-flag`;
            if(LangState.language === aviableLang) {
                selectedFlag.prepend(flagImg);
            } else {
                unselectedFlag.prepend(flagImg);
            }
        }
    }

    attachEvents() {
        // toggle dropdown btn
        const toggleDropdownMenuBtn = this.querySelector('[data-role="toggle-dropdown-menu-btn"]');
        const toggleDropdownMenu = () => {
            const flagBtnContainer = this.querySelector('[data-role="flag-btn-container"]');
            const unselectedFlag = flagBtnContainer.children[1];
            if (!toggleDropdownMenuBtn.classList.contains(styles.pressed)) {
                toggleDropdownMenuBtn.classList.add(styles.pressed);
                flagBtnContainer.classList.add(styles.flagBtnContainerOpened);
                unselectedFlag.classList.remove(styles.hidden);
            } else {
                toggleDropdownMenuBtn.classList.remove(styles.pressed);
                flagBtnContainer.classList.remove(styles.flagBtnContainerOpened);
                unselectedFlag.classList.add(styles.hidden)
            }
        };
        this.addEvent(toggleDropdownMenuBtn, 'click', toggleDropdownMenu);
        
        // flag btn 
        const flagBtns = this.querySelectorAll(`.${styles.flagBtn}`);
        flagBtns.forEach(flagBtn => {
            const selectLanguage = () => {
                if(LangState.language === 'en') {
                    localStorage.setItem('language', 'ru');
                    LangState.language = 'ru';
                    this.initLangFlagBtns();
                } else {
                    localStorage.setItem('language', 'en')
                    LangState.language = 'en';
                    this.initLangFlagBtns();
                }
                const flagBtnContainer = this.querySelector('[data-role="flag-btn-container"]');
                const unselectedFlag = flagBtnContainer.children[1];
                toggleDropdownMenuBtn.classList.remove(styles.pressed);
                flagBtnContainer.classList.remove(styles.flagBtnContainerOpened);
                unselectedFlag.classList.add(styles.hidden)
            }
            this.addEvent(flagBtn, 'click', selectLanguage);
        });
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
        if (!customElements.get('language-selector')) {
            customElements.define('language-selector', LanguageSelector);
        }
    }
}

export default LanguageSelector;