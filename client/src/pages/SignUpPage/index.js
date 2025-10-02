import NotAuthorizedHeader from '../../components/Shared/NotAuthorizedHeader/index.js'
import SignUpWindow from '../../components/SignUpPage/SignUpWindow/index.js';

NotAuthorizedHeader.define();
SignUpWindow.define();

class SignUpPage extends HTMLElement {
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
            <sign-up-window></sign-up-window>
        `;
    }

    static define() {
        if (!customElements.get('sign-up-page')) {
            customElements.define('sign-up-page', SignUpPage);
        }
    }
}

export default SignUpPage;
