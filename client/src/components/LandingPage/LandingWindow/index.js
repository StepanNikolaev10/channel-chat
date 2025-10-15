import styles from './styles.module.scss';
import Router from '../../../Router/index.js';
import LangState from '../../../state/LangState.js';

class LandingWindow extends HTMLElement {
    
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
                        <button class="${styles.signInBtn}" data-role="sign-in-btn">Sign in</button>
                        <button class="${styles.signUpBtn}" data-role="sign-up-btn">Sign up</button>
                    </div>
                </div>
            </div>
        `;
    }

    updateLanguage(lang) {
        const greetings = this.querySelector(`.${styles.greetings}`);
        const title = this.querySelector(`.${styles.title}`);
        const signInBtn = this.querySelector(`.${styles.signInBtn}`);
        const signUpBtn = this.querySelector(`.${styles.signUpBtn}`);

        if (lang === 'en') {
            greetings.textContent = 'Welcome!';
            title.textContent = 'To start chatting, please log in or register';
            signInBtn.textContent = 'Sign in';
            signUpBtn.textContent = 'Sign Up';
        } else if (lang === 'ru') {
            greetings.textContent = 'Добро пожаловать!';
            title.textContent = 'Чтобы начать общаться, войдите или зарегистрируйтесь';
            signInBtn.textContent = 'Войти';
            signUpBtn.textContent = 'Регистрация';
        }
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