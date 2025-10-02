import NotAuthorizedHeader from '../../components/Shared/NotAuthorizedHeader/index.js'
import SignInWindow from '../../components/SignInPage/SignInWindow/index.js';

NotAuthorizedHeader.define();
SignInWindow.define();

class SignInPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        document.title = 'Sign in - Channel Chat';
        this.setupStyles();
        this.render();
    }

    setupStyles() {
        this.style.height = '100%';
        this.style.display = 'flex';
        this.style.flexDirection = 'column';
    }

    render() {
        this.innerHTML = `
            <not-authorized-header></not-authorized-header>
            <sign-in-window></sign-in-window>
        `;
    }

    static define() {
        if (!customElements.get('sign-in-page')) {
            customElements.define('sign-in-page', SignInPage);
        }
    }
}

export default SignInPage;
