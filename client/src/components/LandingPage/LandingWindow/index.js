import styles from './styles.module.scss';
import Router from '../../../Router/index.js';

class LandingWindow extends HTMLElement {
    
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
        this.style.display = 'flex';
        this.style.flexGrow = '1';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.content}">
                    <div class="${styles.greetingsContainer}">
                        <div class="${styles.greetings}">Welcome!</div>
                        <div class="${styles.title}">To start chatting, please log in or register</div>
                    </div>
                    <div class="${styles.buttonsContainer}">
                        <button class="${styles.signInButton}" data-role="sign-in-btn">Sign in</button>
                        <button class="${styles.signUpButton}" data-role="sign-up-btn">Sign up</button>
                    </div>
                </div>
            </div>
        `;
    }

    addEvent(element, eventType, handler) {
        this.eventListeners.push({ element, eventType, handler });
        element.addEventListener(eventType, handler);
    }

    attachEvents() {
        // Sign in button
        const signInBtn = this.querySelector('[data-role="sign-in-btn"]');
        const signInBtnHandler = () => {
            Router.navigate('/sign-in');
        }
        this.addEvent(signInBtn, 'click', signInBtnHandler);
        
        // Sign up button
        const signUpBtn = this.querySelector('[data-role="sign-up-btn"]');
        const signUpBtnHandler = () => {
            Router.navigate('/sign-up');
        }
        this.addEvent(signUpBtn, 'click', signUpBtnHandler);
    }

    removeEvents() {
        for (const listener of this.eventListeners) {
            listener.element.removeEventListener(listener.eventType, listener.handler);
        }
        this.eventListeners = [];
    }

    static define() {
        if (!customElements.get('landing-window')) {
            customElements.define('landing-window', LandingWindow);
        }
    }
}

export default LandingWindow;