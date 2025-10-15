import styles from './styles.module.scss';
import UserMenu from './UserMenu/index.js';
import Router from '../../../Router/index.js';

UserMenu.define();

class AuthorizedHeader extends HTMLElement {
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
        this.style.zIndex = '1001';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.section} ${styles.sectionLeft}"></div>
                <div class="${styles.section} ${styles.sectionCenter}">
                    <div class="${styles.appName}" data-role="app-name">Channel chat</div>
                </div>
                <div class="${styles.section} ${styles.sectionRight}">
                    <user-menu></user-menu>
                </div>
            </div>
        `;
    }

    isMobile() {
        return window.innerWidth <= 768; 
    }

    loadMobileContent() {
        const sectionLeft = this.querySelector(`.${styles.sectionLeft}`);
        if (!sectionLeft.querySelector(`.${styles.burger}`)) {
            const toggleSideBarBtn = document.createElement('div');
            toggleSideBarBtn.classList.add(styles.burger);
            toggleSideBarBtn.dataset.role = 'toggle-side-bar-btn';
            const span = document.createElement('span');
            toggleSideBarBtn.append(span);
            sectionLeft.append(toggleSideBarBtn);

            const toggleSideBar = () => {
                this.dispatchEvent(new CustomEvent('toggle-side-bar', {
                    bubbles: true,
                    composed: true
                }));
            }
            this.addEvent(toggleSideBarBtn, 'click', toggleSideBar);
        }
    }

    loadDesktopContent() {
        const burger = this.querySelector(`.${styles.burger}`)
        if(burger) {
            this.removeEvent(burger);
            burger.remove();
        }
    }

    attachEvents() {
        // app name
        const appName = this.querySelector('[data-role="app-name"]');
        const backToLanding = () => {
            Router.navigate('/')
        }
        this.addEvent(appName, 'click', backToLanding);

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
        this.eventListeners = this.eventListeners.filter(listener => {
            if (listener.element === element) {
                listener.element.removeEventListener(listener.eventType, listener.handler);
                return false; 
            }
            return true;
        });
    }


    static define() {
        if (!customElements.get('authorized-header')) {
            customElements.define('authorized-header', AuthorizedHeader);
        }
    }
}

export default AuthorizedHeader;