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
        this.style.zIndex = '1000';
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

    addEvent(element, eventType, handler) {
        this.eventListeners.push({ element, eventType, handler });
        element.addEventListener(eventType, handler);
    }

    attachEvents() {
        // app name
        const appName = this.querySelector('[data-role="app-name"]');
        const backToLanding = () => {
            Router.navigate('/')
        }
        this.addEvent(appName, 'click', backToLanding);
    }

    removeEvents() {
        for (const listener of this.eventListeners) {
            listener.element.removeEventListener(listener.eventType, listener.handler);
        }
        this.eventListeners = [];
    }

    static define() {
        if (!customElements.get('authorized-header')) {
            customElements.define('authorized-header', AuthorizedHeader);
        }
    }
}

export default AuthorizedHeader;