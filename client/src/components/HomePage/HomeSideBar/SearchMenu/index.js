import styles from './styles.module.scss';
import ChannelsService from '../../../../services/ChannelsService.js';
import LangState from '../../../../state/LangState.js';

class SearchMenu extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
        this.langUnsubscribe = null;
        this.selectedTags = [];
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
        this.style.width = '100%';
        this.style.height = '100%';
        this.style.display = 'none';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.header}">
                    <div class="${styles.title}" data-role="title">Enter details</div>
                </div>
                <form class="${styles.form}" data-role="form">
                    <div class="${styles.formRow}">
                        <label class="${styles.formLabel}" data-role="search-by-name-label" for="name-input">Search by name</label>
                        <input class="${styles.formInput}" data-role="form-input" type="text" id="name-input" placeholder="Enter name here..." />
                    </div>
                    <div class="${styles.formRow}">
                        <div class="${styles.formLabel}" data-role="filter-label">Filter by tags:</div>
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

    updateLanguage(lang) {
        const title = this.querySelector('[data-role="title"]');
        const searchByNameLabel = this.querySelector('[data-role="search-by-name-label"]');
        const formInput = this.querySelector('[data-role="form-input"]');
        const filterLabel = this.querySelector('[data-role="filter-label"]');
        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const continueBtn = this.querySelector('[data-role="continue-btn"]');
        const tags = Array.from(this.querySelectorAll(`.${styles.tag}`));

        if (lang === 'en') {
            title.textContent = 'Enter details';
            searchByNameLabel.textContent = 'Search by name';
            formInput.placeholder = 'Enter name here...';
            filterLabel.textContent = 'Filter by tags:';
            cancelBtn.textContent = 'Cancel';
            continueBtn.textContent = 'Continue';

            const enTags = {
                Art: 'Art', Books: 'Books', Chatting: 'Chatting', Cooking: 'Cooking',
                Education: 'Education', Esports: 'Esports', Fitness: 'Fitness', Friends: 'Friends',
                Gaming: 'Gaming', Hobbies: 'Hobbies', Humor: 'Humor', Movies: 'Movies',
                Music: 'Music', News: 'News', Podcasts: 'Podcasts', Programming: 'Programming',
                Sports: 'Sports', Technology: 'Technology', Travel: 'Travel', Work: 'Work'
            };
            tags.forEach(tag => tag.textContent = enTags[tag.dataset.tagType] || tag.dataset.tagType);

        } else if (lang === 'ru') {
            title.textContent = 'Введите данные';
            searchByNameLabel.textContent = 'Поиск по имени';
            formInput.placeholder = 'Введите имя...';
            filterLabel.textContent = 'Фильтр по тегам:';
            cancelBtn.textContent = 'Отмена';
            continueBtn.textContent = 'Продолжить';

            const ruTags = {
                Art: 'Искусство', Books: 'Книги', Chatting: 'Чат', Cooking: 'Кулинария',
                Education: 'Образование', Esports: 'Киберспорт', Fitness: 'Фитнес', Friends: 'Друзья',
                Gaming: 'Игры', Hobbies: 'Хобби', Humor: 'Юмор', Movies: 'Фильмы',
                Music: 'Музыка', News: 'Новости', Podcasts: 'Подкасты', Programming: 'Кодинг',
                Sports: 'Спорт', Technology: 'Технологии', Travel: 'Путешествия', Work: 'Работа'
            };
            tags.forEach(tag => tag.textContent = ruTags[tag.dataset.tagType] || tag.dataset.tagType);
        }
    }

    attachEvents() {
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

        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const closeSearchMenu = () => {
            this.dispatchEvent(new CustomEvent('close-search-menu', {
                bubbles: true,
                composed: true
            }));
        }
        this.addEvent(cancelBtn, 'click', closeSearchMenu);

        const form = this.querySelector('[data-role="form"]');
        const submitForm = async (event) => {
            event.preventDefault();
            try {
                const name = this.querySelector('[data-role="form-input"]').value.trim();
                let searchParamsCounter = this.selectedTags.length;
                if(name !== '') searchParamsCounter += 1;
                if(searchParamsCounter <= 0) {
                    this.dispatchEvent(new CustomEvent('empty-search-response', {
                        bubbles: true,
                        composed: true
                    }));
                } else {
                    const response = await ChannelsService.getSearchedChannels({ name, selectedTags: this.selectedTags });
                    this.dispatchEvent(new CustomEvent('search-response', {
                        detail: { response, searchParamsCounter },
                        bubbles: true,
                        composed: true
                    }));
                }
            } catch(e) {
                console.error(e);
            }
        }
        this.addEvent(form, 'submit', submitForm);
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

    clearSearchSelectors() {
        const input = this.querySelector('[data-role="form-input"]');
        input.value = '';
        this.selectedTags = [];
        const tags = Array.from(this.querySelectorAll(`.${styles.tag}`));
        for(const tag of tags) {
            if(tag.classList.contains(styles.selected)) tag.classList.remove(styles.selected);
        }
    }

    static define() {
        if (!customElements.get('search-menu')) {
            customElements.define('search-menu', SearchMenu);
        }
    }
}

export default SearchMenu;