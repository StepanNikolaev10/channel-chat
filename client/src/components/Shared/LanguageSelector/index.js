import styles from './styles.module.scss';

class LanguageSelector extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.title}">Language:</div>
                <div class="${styles.flag}">
                    <img class="${styles.flagImg}" src="./src/assets/united-states.svg" alt="united-states-flag" />
                </div>
                <button class="${styles.dropdownBtn}">
                    <div class="${styles.dropdownIcon}">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.82 7.77L3.12 8.52L8.05 13.76L12.97 19L17.92 13.73L22.87 8.47L22.18 7.73L21.49 7L17.24 11.51L12.99 16.03L8.76 11.52L4.52 7.02L3.82 7.77Z"/>
                        </svg>
                    </div>
                </button>
            </div>
        `;
    }

    static define() {
        if (!customElements.get('language-selector')) {
            customElements.define('language-selector', LanguageSelector);
        }
    }
}

export default LanguageSelector;