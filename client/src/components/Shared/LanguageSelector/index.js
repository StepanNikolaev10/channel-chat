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
                    <div class="${styles.flagImg}" alt="united-states-flag">
                        <svg width="59.763550" height="45.000000" viewBox="0 0 59.7635 45" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <defs>
                                <filter id="filter_17_169_dd" x="0.000000" y="0.000000" width="59.763550" height="45.000000" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                    <feOffset dx="0" dy="0"/>
                                    <feGaussianBlur stdDeviation="3.33333"/>
                                    <feComposite in2="hardAlpha" operator="out" k2="-1" k3="1"/>
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect_dropShadow_1"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect_dropShadow_1" result="shape"/>
                                </filter>
                            </defs>
                            <g filter="url(#filter_17_169_dd)">
                                <path id="path" d="M12.18 10L47.56 10C48.76 10 49.74 10.88 49.74 11.97L49.74 33.02C49.74 34.11 48.76 35 47.56 35L12.18 35C10.97 35 10 34.12 10 33.03L10 11.97C10 10.88 10.97 10 12.18 10Z" fill="#B22234" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="path" d="M10.01 11.77L49.74 11.77C49.75 11.84 49.76 11.9 49.76 11.97L49.76 13.89L10 13.89L10 11.97C10 11.9 10 11.84 10.01 11.77ZM49.75 15.64L49.75 17.75L10 17.75L10 15.64L49.75 15.64ZM49.75 19.51L49.75 21.62L10 21.62L10 19.51L49.75 19.51ZM49.75 23.38L49.75 25.49L10 25.49L10 23.38L49.75 23.38ZM49.75 27.25L49.75 29.36L10 29.36L10 27.25L49.75 27.25ZM49.75 31.11L49.75 33.02C49.75 33.09 49.74 33.16 49.74 33.22L10.01 33.22C10 33.17 10 33.09 10 33.03L10 31.12L49.75 31.11Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="path" d="M24.98 10L24.98 23.46L10 23.46L10 11.97C10 10.88 10.97 10 12.18 10L24.98 10Z" fill="#3C3B6E" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M10.88 11.86L11.38 13.26L10.07 12.39L11.69 12.39L10.38 13.26L10.88 11.86Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M10.88 14.57L11.38 15.97L10.07 15.1L11.69 15.1L10.38 15.97L10.88 14.57Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M10.88 17.28L11.38 18.68L10.07 17.81L11.69 17.81L10.38 18.68L10.88 17.28Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M10.88 19.98L11.38 21.38L10.07 20.52L11.69 20.52L10.38 21.38L10.88 19.98Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M12.64 10.5L13.14 11.9L11.82 11.04L13.46 11.04L12.13 11.9L12.64 10.5Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M12.64 13.21L13.14 14.61L11.82 13.75L13.46 13.75L12.13 14.61L12.64 13.21Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M12.64 15.92L13.14 17.32L11.82 16.45L13.46 16.45L12.13 17.32L12.64 15.92Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M12.64 18.63L13.14 20.03L11.82 19.16L13.46 19.16L12.13 20.03L12.64 18.63Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M12.64 21.34L13.14 22.74L11.82 21.87L13.46 21.87L12.13 22.74L12.64 21.34Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M14.4 11.86L14.91 13.26L13.59 12.39L15.22 12.39L13.9 13.26L14.4 11.86Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M14.4 14.57L14.91 15.97L13.59 15.1L15.22 15.1L13.9 15.97L14.4 14.57Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M14.4 17.28L14.91 18.68L13.59 17.81L15.22 17.81L13.9 18.68L14.4 17.28Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M14.4 19.98L14.91 21.38L13.59 20.52L15.22 20.52L13.9 21.38L14.4 19.98Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M16.17 10.5L16.66 11.9L15.35 11.04L16.98 11.04L15.66 11.9L16.17 10.5Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M16.17 13.21L16.66 14.61L15.35 13.75L16.98 13.75L15.66 14.61L16.17 13.21Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M16.17 15.92L16.66 17.32L15.35 16.45L16.98 16.45L15.66 17.32L16.17 15.92Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M16.17 18.63L16.66 20.03L15.35 19.16L16.98 19.16L15.66 20.03L16.17 18.63Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M16.17 21.34L16.66 22.74L15.35 21.87L16.98 21.87L15.66 22.74L16.17 21.34Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M17.92 11.86L18.43 13.26L17.11 12.39L18.74 12.39L17.42 13.26L17.92 11.86Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M17.92 14.57L18.43 15.97L17.11 15.1L18.74 15.1L17.42 15.97L17.92 14.57Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M17.92 17.28L18.43 18.68L17.11 17.81L18.74 17.81L17.42 18.68L17.92 17.28Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M17.92 19.98L18.43 21.38L17.11 20.52L18.74 20.52L17.42 21.38L17.92 19.98Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M19.69 10.5L20.19 11.9L18.88 11.04L20.5 11.04L19.19 11.9L19.69 10.5Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M19.69 13.21L20.19 14.61L18.88 13.75L20.5 13.75L19.19 14.61L19.69 13.21Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M19.69 15.92L20.19 17.32L18.88 16.45L20.5 16.45L19.19 17.32L19.69 15.92Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M19.69 18.63L20.19 20.03L18.88 19.16L20.5 19.16L19.19 20.03L19.69 18.63Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M19.69 21.34L20.19 22.74L18.88 21.87L20.5 21.87L19.19 22.74L19.69 21.34Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M21.45 11.86L21.95 13.26L20.63 12.39L22.26 12.39L20.95 13.26L21.45 11.86Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M21.45 14.57L21.95 15.97L20.63 15.1L22.26 15.1L20.95 15.97L21.45 14.57Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M21.45 17.28L21.95 18.68L20.63 17.81L22.26 17.81L20.95 18.68L21.45 17.28Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M21.45 19.98L21.95 21.38L20.63 20.52L22.26 20.52L20.95 21.38L21.45 19.98Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M23.21 10.5L23.72 11.9L22.4 11.04L24.02 11.04L22.71 11.9L23.21 10.5Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M23.21 13.21L23.72 14.61L22.4 13.75L24.02 13.75L22.71 14.61L23.21 13.21Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M23.21 15.92L23.72 17.32L22.4 16.45L24.02 16.45L22.71 17.32L23.21 15.92Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M23.21 18.63L23.72 20.03L22.4 19.16L24.02 19.16L22.71 20.03L23.21 18.63Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                                <path id="polygon" d="M23.21 21.34L23.72 22.74L22.4 21.87L24.02 21.87L22.71 22.74L23.21 21.34Z" fill="#FFFFFF" fill-opacity="1.000000" fill-rule="nonzero"/>
                            </g>
                        </svg>
                    </div>
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