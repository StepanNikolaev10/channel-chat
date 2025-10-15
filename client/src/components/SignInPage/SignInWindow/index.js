import styles from './styles.module.scss';
import Router from '../../../Router/index.js';
import AuthService from '../../../services/AuthService.js';
import AuthState from '../../../state/AuthState.js';
import UserState from '../../../state/UserState.js';
import LangState from '../../../state/LangState.js';

class SignInWindow extends HTMLElement {
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
                    <p class="${styles.title}">Sign in to Channel Chat</p>
                    <form class="${styles.form}" data-role="sign-in-form">
                        <div class="${styles.inputs}">
                            <input class="${styles.input}" data-role="username-input" type="text" data-required="true" placeholder="Username" autocomplete="username"></input>
                            <input class="${styles.input}" data-role="password-input" type="password" data-required="true" placeholder="Password" autocomplete="password"></input>
                        </div>
                        <div class="${styles.formActions}">
                            <button class="${styles.signInBtn}" data-role="sign-in-btn" type="submit">Sign in</button>
                            <div class="${styles.linkContainer}">
                                <span class="${styles.signUpLinkText}">Not signed up yet?</span>
                                <a class="${styles.signUpLink}" data-role="sign-up-link">Sign up</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    updateLanguage(lang) {
        const title = this.querySelector(`.${styles.title}`);
        const usernameInput = this.querySelector('[data-role="username-input"]');
        const passwordInput = this.querySelector('[data-role="password-input"]');
        const signInBtn = this.querySelector('[data-role="sign-in-btn"]');
        const signUpLinkText = this.querySelector(`.${styles.signUpLinkText}`);
        const signUpLink = this.querySelector('[data-role="sign-up-link"]');

        if (lang === 'en') {
            title.textContent = 'Sign in to Channel Chat';
            usernameInput.placeholder = 'Username';
            passwordInput.placeholder = 'Password';
            signInBtn.textContent = 'Sign in';
            signUpLinkText.textContent = 'Not signed up yet?';
            signUpLink.textContent = 'Sign up';
        } else if (lang === 'ru') {
            title.textContent = 'Вход в приложение';
            usernameInput.placeholder = 'Юзернейм';
            passwordInput.placeholder = 'Пароль';
            signInBtn.textContent = 'Войти';
            signUpLinkText.textContent = 'Ещё не зарегестрированы?';
            signUpLink.textContent = 'Регистрация';
        }
    }

    attachEvents() {
        // Sign up link
        const signUpLink = this.querySelector('[data-role="sign-up-link"]');
        const signUpLinkHandler = () => {
            Router.navigate('/sign-up');
        };
        this.addEvent(signUpLink, 'click', signUpLinkHandler);

        // Form
        const form = this.querySelector('[data-role="sign-in-form"]');
        const formHandler = async (event) => {
            event.preventDefault(); 
            if(this.validation(form) === true) {
                const username = form.querySelector('[data-role="username-input"]').value;
                const password = form.querySelector('[data-role="password-input"]').value;

                try {
                    await AuthService.signIn(username, password);
                    AuthState.isAuthenticated = true;
                    await UserState.init();
                    Router.init();
                } catch(e) {
                    console.error('Failed to log in:', e);
                }
            }
        }
        this.addEvent(form, 'submit', formHandler);
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
            if(input.classList.contains(styles.erroredInput)) {
                input.classList.remove(styles.erroredInput);
            }
        });

        for(const input of inputs) {
            if (input.dataset.role === 'username-input') {
                if(!isEmptyValidation(input)) {
                    return false;
                }
            } else if(input.dataset.role === 'password-input') {
                if(!isEmptyValidation(input)) {
                    return false;
                } 
            } 
        }
        return true;

        function isEmptyValidation(input) {
            if(input.dataset.role === 'username-input' && !input.value.trim()) {
                createError(input, 'Fill in the username field');
                return false;
            } else if (input.dataset.role === 'password-input' && !input.value.trim()) {
                createError(input, 'Fill in the password field');
                return false;
            }
            return true;
        }
        
        function createError(input, text) {
            const errorArea = document.querySelector(`.${styles.container}`);
            input.classList.add(styles.erroredInput);
            const error = document.createElement('div');
            error.classList.add(styles.errorMessage)
            error.innerHTML = text;
            const existentError = errorArea.querySelector(`.${styles.errorMessage}`);
            if(errorArea.contains(existentError)) {
                errorArea.removeChild(existentError);
                errorArea.append(error);
            } else {
                errorArea.append(error);
            }
        }
    }

    static define() {
        if (!customElements.get('sign-in-window')) {
            customElements.define('sign-in-window', SignInWindow);
        }
    }
}

export default SignInWindow;