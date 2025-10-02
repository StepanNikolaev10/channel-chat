import styles from './styles.module.scss';

class NotFoundErrorWindow extends HTMLElement {
    
    constructor() {
        super();
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
    }

    setupStyles() {
        this.style.display = 'flex';
        this.style.flexGrow = '1';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.content}">
                    <div class="${styles.titleContainer}">
                        <div class="${styles.title}">404 Error</div>
                    </div>
                </div>
            </div>
        `;
    }

    static define() {
        if (!customElements.get('not-found-error-window')) {
            customElements.define('not-found-error-window', NotFoundErrorWindow);
        }
    }
}

export default NotFoundErrorWindow;