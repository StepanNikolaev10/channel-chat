import styles from './styles.module.scss';

class HomeWindow extends HTMLElement {
    
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
        this.style.flexGrow = '1';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.content}">
                    <p class="${styles.title}">
                        Here you can connect or create a channel for communication.
                    </p>
                </div>
                <div class="${styles.actions}">
                    <div class="${styles.actionContainer}">
                        <button data-role="create-channel-btn">Create a channel</button>
                    </div>
                    <div class="${styles.actionContainer}">
                        <button>Connect by id</button>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents() {
        // create channel btn
        const createChannelBtn = this.querySelector('[data-role="create-channel-btn"]');
        const createChannel = () => {
            this.dispatchEvent(new CustomEvent('create-channel', {
                bubbles: true,
                composed: true
            }));
        }
        this.addEvent(createChannelBtn, 'click', createChannel);
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

    static define() {
        if (!customElements.get('home-window')) {
            customElements.define('home-window', HomeWindow);
        }
    }
}

export default HomeWindow;