import styles from './styles.module.scss';
import ChannelsService from '../../../../services/ChannelsService.js';

class SearchMenu extends HTMLElement {

    constructor() {
        super();
        this.eventListeners = []; 
        this.selectedTags = [];
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
        this.style.width = '100%';
        this.style.height = '100%';
        this.style.display = 'none';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.header}">
                    <div class="${styles.title}">Enter details</div>
                </div>
                <form class="${styles.form}" data-role="form">
                    <div class="${styles.formRow}">
                        <label class="${styles.formLabel}" for="nameInput">Search by name</label>
                        <input class="${styles.formInput}" data-role="form-input" type="text" id="nameInput" placeholder="Enter name here..." />
                    </div>
                    <div class="${styles.formRow}">
                        <div class="${styles.formLabel}">Filter by tags:</div>
                        <ul class="${styles.formTagsList}">
                            <li class="${styles.tag}" data-tag-type="Art">Art</li>
                            <li class="${styles.tag}" data-tag-type="Books">Books</li>
                            <li class="${styles.tag}" data-tag-type="Chatting">Chatting</li>
                            <li class="${styles.tag}" data-tag-type="Cooking">Cooking</li>
                            <li class="${styles.tag}" data-tag-type="Education">Education</li>
                            <li class="${styles.tag}" data-tag-type="Esports">Esports</li>
                            <li class="${styles.tag}" data-tag-type="Fitness">Fitness</li>
                            <li class="${styles.tag}" data-tag-type="Friends">Friends</li>
                            <li class="${styles.tag}" data-tag-type="Gaming">Gaming</li>
                            <li class="${styles.tag}" data-tag-type="Hobbies">Hobbies</li>
                            <li class="${styles.tag}" data-tag-type="Humor">Humor</li>
                            <li class="${styles.tag}" data-tag-type="Movies">Movies</li>
                            <li class="${styles.tag}" data-tag-type="Music">Music</li>
                            <li class="${styles.tag}" data-tag-type="News">News</li>
                            <li class="${styles.tag}" data-tag-type="Podcasts">Podcasts</li>
                            <li class="${styles.tag}" data-tag-type="Programming">Programming</li>
                            <li class="${styles.tag}" data-tag-type="Sports">Sports</li>
                            <li class="${styles.tag}" data-tag-type="Technology">Technology</li>
                            <li class="${styles.tag}" data-tag-type="Travel">Travel</li>
                            <li class="${styles.tag}" data-tag-type="Work">Work</li>
                        </ul>
                    </div>
                    <div class="${styles.formActions}">
                        <button type="button" class="${styles.button} ${styles.buttonCancel}" data-role="cancel-btn">Cancel</button>
                        <button type="submit" class="${styles.button} ${styles.buttonContinue}" data-role="continue-btn">Continue</button>
                    </div>
                </form>
            </div>
        `;
    }

    addEvent(element, eventType, handler) {
        this.eventListeners.push({ element, eventType, handler });
        element.addEventListener(eventType, handler);
    }

    attachEvents() {
        // tag buttons
        const tags = Array.from(this.querySelectorAll(`.${styles.tag}`));
        for(const tag of tags) {
            const selectSearchTag = () => {
                if(!this.selectedTags.includes(tag.dataset.tagType)) {
                    this.selectedTags.push(tag.dataset.tagType);
                    tag.classList.add(styles.selected);
                } else {
                    const indexToRemove = this.selectedTags.indexOf(tag.dataset.tagType);
                    this.selectedTags.splice(indexToRemove, 1);
                    tag.classList.remove(styles.selected);
                }
            }
            this.addEvent(tag, 'click', selectSearchTag);
        }

        // cancel button
        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const closeSearchMenu = () => {
            this.dispatchEvent(new CustomEvent('close-search-menu', {
                bubbles: true,
                composed: true
            }));
        }
        this.addEvent(cancelBtn, 'click', closeSearchMenu);

        // submit form
        const form = this.querySelector('[data-role="form"]');
        const submitForm = async (event) => {

            event.preventDefault();
            try {
                const name = this.querySelector('[data-role="form-input"]').value.trim();
                const selectedTags = this.selectedTags;
                let searchParamsCounter = selectedTags.length;
                if(name !== '') {
                    searchParamsCounter += 1;
                }
                if(searchParamsCounter <= 0) {
                    this.dispatchEvent(new CustomEvent('empty-search-response', {
                        bubbles: true,
                        composed: true
                    }));
                } else {
                    const response = await ChannelsService.getSearchedChannels({ name, selectedTags });
                    this.dispatchEvent(new CustomEvent('search-response', {
                        detail: { response, searchParamsCounter },
                        bubbles: true,
                        composed: true
                    }));
                }
            } catch(e) {
                console.error(e)
            }
        }
        this.addEvent(form, 'submit', submitForm);

    }

    removeEvents() {
        for (const listener of this.eventListeners) {
            listener.element.removeEventListener(listener.eventType, listener.handler);
        }
        this.eventListeners = [];
    }

    clearSearchSelectors() {
        const input = this.querySelector('[data-role="form-input"]');
        input.value = '';
        
        this.selectedTags = [];
        const tags = Array.from(this.querySelectorAll(`.${styles.tag}`));
        for(const tag of tags) {
            if(tag.classList.contains(styles.selected)) {
                tag.classList.remove(styles.selected);
            }
        }
    }

    static define() {
        if (!customElements.get('search-menu')) {
            customElements.define('search-menu', SearchMenu);
        }
    }
    
}

export default SearchMenu;