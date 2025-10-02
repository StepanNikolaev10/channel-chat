import styles from './styles.module.scss';
import LanguageSelector from '../LanguageSelector/index.js';
import Router from '../../../Router/index.js';

LanguageSelector.define();

class NotAuthorizedHeader extends HTMLElement {
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
            <div class="${styles.container}">
                <div class="${styles.section} ${styles.sectionLeft}">
                    <language-selector></language-selector>
                </div>
                <div class="${styles.section} ${styles.sectionCenter}">
                    <div class="${styles.appName}" data-role="app-name">Channel chat</div>
                </div>
                <div class="${styles.section} ${styles.sectionRight}"></div>
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
        if (!customElements.get('not-authorized-header')) {
            customElements.define('not-authorized-header', NotAuthorizedHeader);
        }
    }
}

export default NotAuthorizedHeader;

