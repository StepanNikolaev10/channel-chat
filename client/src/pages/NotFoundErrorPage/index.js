import NotAuthorizedHeader from '../../components/Shared/NotAuthorizedHeader/index.js';
import NotFoundErrorWindow from '../../components/NotFoundErrorPage/NotFoundErrorWindow/index.js';

NotAuthorizedHeader.define();
NotFoundErrorWindow.define();

class NotFoundErrorPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        document.title = 'Not found - Channel Chat';
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
            <not-found-error-window></not-found-error-window>
        `;
    }

    static define() {
        if (!customElements.get('not-found-error-page')) {
            customElements.define('not-found-error-page', NotFoundErrorPage);
        }
    }
}

export default NotFoundErrorPage;
