import styles from './styles.module.scss';
import LangState from '../../../state/LangState';

class TagSelectorModal extends HTMLElement {

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
        this.style.position = 'absolute';
        this.style.top = '50%';
        this.style.left = '50%';
        this.style.transform = 'translate(-50%, -50%)';
        this.style.background = 'rgba(0, 0, 0, 0.5)';
        this.style.zIndex = '1000';
        this.style.display = 'flex';
        this.style.justifyContent = 'center';
        this.style.alignItems = 'center';
        this.style.visibility = 'hidden';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.header}">
                    <div class="${styles.title}">Select tags</div>
                </div>
                <div class="${styles.main}">
                    <ul class="${styles.tagsList}">
                        <li class="${styles.tag}" data-tag-type="Chatting">Chatting</li>
                        <li class="${styles.tag}" data-tag-type="Gaming">Gaming</li>
                        <li class="${styles.tag}" data-tag-type="Technology">Technology</li>
                        <li class="${styles.tag}" data-tag-type="Music">Music</li>
                        <li class="${styles.tag}" data-tag-type="Movies">Movies</li>
                        <li class="${styles.tag}" data-tag-type="Books">Books</li>
                        <li class="${styles.tag}" data-tag-type="Sports">Sports</li>
                        <li class="${styles.tag}" data-tag-type="Education">Education</li>
                        <li class="${styles.tag}" data-tag-type="Hobbies">Hobbies</li>
                        <li class="${styles.tag}" data-tag-type="Travel">Travel</li>
                        <li class="${styles.tag}" data-tag-type="Art">Art</li>
                        <li class="${styles.tag}" data-tag-type="Work">Work</li>
                        <li class="${styles.tag}" data-tag-type="Programming">Programming</li>
                        <li class="${styles.tag}" data-tag-type="Fitness">Fitness</li>
                        <li class="${styles.tag}" data-tag-type="Humor">Humor</li>
                        <li class="${styles.tag}" data-tag-type="Cooking">Cooking</li>
                        <li class="${styles.tag}" data-tag-type="News">News</li>
                        <li class="${styles.tag}" data-tag-type="Esports">Esports</li>
                        <li class="${styles.tag}" data-tag-type="Podcasts">Podcasts</li>
                        <li class="${styles.tag}" data-tag-type="Friends">Friends</li>
                    </ul>
                </div>
                <div class="${styles.footer}">
                    <div class="${styles.btnsContainer}">
                        <div class="${styles.cancelBtn}" data-role="cancel-btn">Cancel</div>
                        <div class="${styles.saveBtn}" data-role="save-btn">Save</div>
                    </div>
                </div>
            </div>
        `;
    }

    updateLanguage(lang) {
        const title = this.querySelector(`.${styles.title}`);
        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const saveBtn = this.querySelector('[data-role="save-btn"]');
        const tags = Array.from(this.querySelectorAll(`.${styles.tag}`));

        if (lang === 'en') {
            title.textContent = 'Select tags';
            cancelBtn.textContent = 'Cancel';
            saveBtn.textContent = 'Save';

            const tagTranslations = {
                Chatting: 'Chatting', Gaming: 'Gaming', Technology: 'Technology',
                Music: 'Music', Movies: 'Movies', Books: 'Books',
                Sports: 'Sports', Education: 'Education', Hobbies: 'Hobbies',
                Travel: 'Travel', Art: 'Art', Work: 'Work',
                Programming: 'Programming', Fitness: 'Fitness', Humor: 'Humor',
                Cooking: 'Cooking', News: 'News', Esports: 'Esports',
                Podcasts: 'Podcasts', Friends: 'Friends'
            };
            tags.forEach(tag => tag.textContent = tagTranslations[tag.dataset.tagType]);
        } 
        else if (lang === 'ru') {
            title.textContent = 'Выберите теги';
            cancelBtn.textContent = 'Отмена';
            saveBtn.textContent = 'Сохранить';

            const tagTranslations = {
                Chatting: 'Общение', Gaming: 'Игры', Technology: 'Технологии',
                Music: 'Музыка', Movies: 'Фильмы', Books: 'Книги',
                Sports: 'Спорт', Education: 'Образование', Hobbies: 'Хобби',
                Travel: 'Путешествия', Art: 'Искусство', Work: 'Работа',
                Programming: 'Кодинг', Fitness: 'Фитнес', Humor: 'Юмор',
                Cooking: 'Готовка', News: 'Новости', Esports: 'Киберспорт',
                Podcasts: 'Подкасты', Friends: 'Друзья'
            };
            tags.forEach(tag => tag.textContent = tagTranslations[tag.dataset.tagType]);
        }
    }

    addEvent(element, eventType, handler) {
        this.eventListeners.push({ element, eventType, handler });
        element.addEventListener(eventType, handler);
    }

    attachEvents() {
        const tags = Array.from(this.querySelectorAll(`.${styles.tag}`));
        for (const tag of tags) {
            const handler = () => {
                if (!this.selectedTags.includes(tag.dataset.tagType)) {
                    this.selectedTags.push(tag.dataset.tagType);
                    tag.classList.add(styles.selected);
                } else {
                    const indexToRemove = this.selectedTags.indexOf(tag.dataset.tagType);
                    this.selectedTags.splice(indexToRemove, 1);
                    tag.classList.remove(styles.selected);
                }
            };
            this.addEvent(tag, 'click', handler);
        }

        const cancelBtn = this.querySelector('[data-role="cancel-btn"]');
        const cancelBtnHandler = () => {
            this.dispatchEvent(new CustomEvent('close-tag-selector-modal', {
                bubbles: true,
                composed: true
            }));
        };
        this.addEvent(cancelBtn, 'click', cancelBtnHandler);

        const saveBtn = this.querySelector('[data-role="save-btn"]');
        const saveBtnHandler = () => {
            this.dispatchEvent(new CustomEvent('save-tags', {
                detail: { tags: this.selectedTags },
                bubbles: true,
                composed: true
            }));
        };
        this.addEvent(saveBtn, 'click', saveBtnHandler);
    }

    removeEvents() {
        for (const listener of this.eventListeners) {
            listener.element.removeEventListener(listener.eventType, listener.handler);
        }
        this.eventListeners = [];
    }

    syncSelectedTags(selectedTags) {
        this.selectedTags = selectedTags;
        const tags = Array.from(this.querySelectorAll(`.${styles.tag}`));
        for (const tag of tags) {
            if (this.selectedTags.includes(tag.dataset.tagType)) {
                tag.classList.add(styles.selected);
            } else {
                tag.classList.remove(styles.selected);
            }
        }
    }

    static define() {
        if (!customElements.get('tag-selector-modal')) {
            customElements.define('tag-selector-modal', TagSelectorModal);
        }
    }
}

export default TagSelectorModal;
