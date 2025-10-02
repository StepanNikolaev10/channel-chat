import styles from './styles.module.scss';
import AuthService from '../../../../services/AuthService.js';
import UserState from '../../../../state/UserState.js';
import AuthState from '../../../../state/AuthState.js';
import Router from '../../../../Router/index.js';

class UserMenu extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    disconnectedCallback() {
        this.removeEvents();
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

    attachEvents() {
        const wrapper = this.querySelector('[data-role="user-menu-wrapper"]');
        const dropdownMenu = this.querySelector('[data-role="dropdown-menu"]');

        // dropdown toggle btn
        const toggleBtn = this.querySelector('[data-role="dropdown-toggle-btn"]');
        const toggleDropdownMenu = () => {
            dropdownMenu.classList.toggle(`${styles.dropdownMenuVisible}`);
        }
        this.addEvent(toggleBtn, 'click', toggleDropdownMenu);

        // outside 
        const closeDropdownMenu = (e) => {
            if (!wrapper.contains(e.target)) {
                dropdownMenu.classList.remove(`${styles.dropdownMenuVisible}`);
            }
        }
        this.addEvent(document, 'click', closeDropdownMenu);

        // logout btn
        const logoutBtn = document.querySelector('[data-role="logout-btn"]');
        const logout = async () => {
            try {
                await AuthService.logout()
                AuthState.isAuthenticated = false;
                Router.init();
            } catch(e) {
                console.error('Log out error:', e)
            }
        }
        this.addEvent(logoutBtn, 'click', logout)
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