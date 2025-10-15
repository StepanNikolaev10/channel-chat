import styles from './styles.module.scss';
import AuthService from '../../../../services/AuthService.js';
import UserState from '../../../../state/UserState.js';
import AuthState from '../../../../state/AuthState.js';
import Router from '../../../../Router/index.js';
import LangState from '../../../../state/LangState.js';

class UserMenu extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
        this.langUnsubscribe = null;
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
        this.style.zIndex = '1001';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}" data-role="user-menu-wrapper">
                <button class="${styles.dropdownToggleBtn}" data-role="dropdown-toggle-btn">
                    ${UserState.username}
                </button>
                <div class="${styles.dropdownMenu}" data-role="dropdown-menu">
                    <div class="${styles.dropdownItem}" data-role="logout-btn">Log out</div>
                </div>
            </div>
        `;
    }

    updateLanguage(lang) {
        const logoutBtn = this.querySelector('[data-role="logout-btn"]');
        if (!logoutBtn) return;

        if (lang === 'en') {
            logoutBtn.textContent = 'Log out';
        } else if (lang === 'ru') {
            logoutBtn.textContent = 'Выйти';
        }
    }

    attachEvents() {
        const wrapper = this.querySelector('[data-role="user-menu-wrapper"]');
        const dropdownMenu = this.querySelector('[data-role="dropdown-menu"]');

        const toggleBtn = this.querySelector('[data-role="dropdown-toggle-btn"]');
        const toggleDropdownMenu = () => {
            dropdownMenu.classList.toggle(`${styles.dropdownMenuVisible}`);
        };
        this.addEvent(toggleBtn, 'click', toggleDropdownMenu);

        const closeDropdownMenu = (e) => {
            if (!wrapper.contains(e.target)) {
                dropdownMenu.classList.remove(`${styles.dropdownMenuVisible}`);
            }
        };
        this.addEvent(document, 'click', closeDropdownMenu);

        const logoutBtn = this.querySelector('[data-role="logout-btn"]');
        const logout = async () => {
            try {
                await AuthService.logout();
                AuthState.isAuthenticated = false;
                Router.init();
            } catch(e) {
                console.error('Log out error:', e);
            }
        };
        this.addEvent(logoutBtn, 'click', logout);
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
        if (!customElements.get('user-menu')) {
            customElements.define('user-menu', UserMenu);
        }
    }
}

export default UserMenu;
