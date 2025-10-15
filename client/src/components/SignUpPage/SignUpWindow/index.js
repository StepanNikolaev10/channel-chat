import styles from './styles.module.scss';
import Router from '../../../Router/index.js';
import AuthService from '../../../services/AuthService.js';
import AuthState from '../../../state/AuthState.js';
import UserState from '../../../state/UserState.js';
import LangState from '../../../state/LangState.js';

class SignUpWindow extends HTMLElement {
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
                    <p class="${styles.title}">Sign up to Channel Chat</p>
                    <form class="${styles.form}" data-role="sign-up-form">
                        <div class="${styles.inputs}">
                            <input class="${styles.input}" data-role="username-input" type="text" placeholder="Username" autocomplete="username"></input>
                            <input class="${styles.input}" data-role="password-input" type="text" placeholder="Password" autocomplete="password"></input>
                            <input class="${styles.input}" data-role="confirm-password-input" type="text" placeholder="Confirm password"></input>
                        </div>
                        <div class="${styles.formActions}">
                            <button class="${styles.signInBtn}" data-role="sign-up-btn" type="submit">Sign up</button>
                                <div class="${styles.linkContainer}">
                                    <span class="${styles.signInLinkText}">Already signed up?</span>
                                    <a class="${styles.signInLink}" data-role="sign-in-link">Sign in</a>
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
        const signUpBtn = this.querySelector('[data-role="sign-up-btn"]');
        const signInLinkText = this.querySelector(`.${styles.signInLinkText}`);
        const signInLink = this.querySelector('[data-role="sign-in-link"]');

        if (lang === 'en') {
            title.textContent = 'Sign in to Channel Chat';
            usernameInput.placeholder = 'Username';
            passwordInput.placeholder = 'Password';
            signUpBtn.textContent = 'Sign up';
            signInLinkText.textContent = 'Already signed up?';
            signInLink.textContent = 'Sign in';
        } else if (lang === 'ru') {
            title.textContent = 'Вход в приложение';
            usernameInput.placeholder = 'Юзернейм';
            passwordInput.placeholder = 'Пароль';
            signUpBtn.textContent = 'Зарегестрироваться';
            signInLinkText.textContent = 'Уже зарегестрированы?';
            signInLink.textContent = 'Войти';
        }
    }

    attachEvents() {
        // Sign in link
        const signInLink = this.querySelector('[data-role="sign-in-link"]');
        const signInLinkHandler = () => {
            Router.navigate('/sign-in');
        };
        this.addEvent(signInLink, 'click', signInLinkHandler);

        // Form
        const form = this.querySelector('[data-role="sign-up-form"]');
        const formHandler = async (event) => {
            event.preventDefault(); 
            if(this.validation(form) === true) {
                const username = form.querySelector('[data-role="username-input"]').value;
                const password = form.querySelector('[data-role="password-input"]').value;

                try {
                    await AuthService.signUp(username, password);
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
                } else if(!regexValidation(input)) {
                    return false;
                }  
            } else if(input.dataset.role === 'password-input') {
                if(!isEmptyValidation(input)) {
                    return false;
                } else if(!regexValidation(input)) {
                    return false;
                }  
            } else if(input.dataset.role === 'confirm-password-input') {
                if(!isEmptyValidation(input)) {
                    return false;
                } else if(!isPasswordConfirmed(input)) {
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
            } else if (input.dataset.role === 'confirm-password-input' && !input.value.trim()) {
                createError(input, 'Fill in the confirm password field');
                return false;
            }
            return true;
        }

        function isPasswordConfirmed(input) {
            const passwordInputValue = form.querySelector('[data-role="password-input"]').value;
            const confirmPasswordInputValue = input.value;
            if (passwordInputValue !== confirmPasswordInputValue) {
                createError(input, 'Passwords do not match');
                return false;
            }
            return true;
        }

        function regexValidation(input) {
            if (input.dataset.role === 'username-input') {
                const allowedCharacters = /^[a-zA-Z0-9_-]{3,20}$/;
                if (!allowedCharacters.test(input.value)) {
                    createError(input, 'Username must be 3–20 characters, and can only contain letters, numbers, underscores, and dashes.');
                    return false;
                }
            } else if (input.dataset.role === 'password-input') {
                const allowedCharacters = /^[a-zA-Z0-9!@#$%^&*()_+={}\[\].,:;"'<>?/|\\\-~]{4,40}$/;
                if (!allowedCharacters.test(input.value)) {
                    createError(input, 'Password must be 4–40 characters. Letters, numbers, and common symbols are allowed.');
                    return false;
                }
            }
            return true;
        }

        function createError(input, text) {
            const errorArea = document.querySelector(`.${styles.container}`);
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
        if (!customElements.get('sign-up-window')) {
            customElements.define('sign-up-window', SignUpWindow);
        }
    }

}

export default SignUpWindow;