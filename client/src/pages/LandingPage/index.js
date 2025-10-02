import NotAuthorizedHeader from '../../components/Shared/NotAuthorizedHeader/index.js'
import LandingWindow from '../../components/LandingPage/LandingWindow/index.js';

NotAuthorizedHeader.define();
LandingWindow.define();

class LandingPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        document.title = 'Channel Chat';
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
            <landing-window></landing-window>
        `;
    }

    static define() {
        if (!customElements.get('landing-page')) {
            customElements.define('landing-page', LandingPage);
        }
    }
}

export default LandingPage;
