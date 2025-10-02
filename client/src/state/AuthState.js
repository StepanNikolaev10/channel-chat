import AuthService from '../services/AuthService.js'; // Сервис для работы с аутентификацией (например, обновление токена)

class AuthState {
    constructor() {
        // Приватные поля для хранения состояния аутентификации и статуса проверки
        this._isAuthenticated = false;  // Флаг: пользователь аутентифицирован или нет
        this._isChecked = false;        // Флаг: статус проверки аутентификации (например, проверили ли токен)
        this.subscribers = [];          // Массив функций-подписчиков, которые будут уведомлены при изменениях
    }

    // Геттер для получения текущего состояния аутентификации (без прямого доступа к _isAuthenticated)
    get isAuthenticated() {
        return this._isAuthenticated;
    }

    // Сеттер для обновления состояния аутентификации и оповещения подписчиков
    set isAuthenticated(value) {
        this._isAuthenticated = value;
        this.notify();  // Уведомляем всех, кто подписан на изменения
    }

    // Геттер для получения статуса проверки аутентификации
    get isChecked() {
        return this._isChecked;
    }

    // Сеттер для обновления статуса проверки и оповещения подписчиков
    set isChecked(value) {
        this._isChecked = value;
        this.notify();  // Уведомляем подписчиков о смене статуса проверки
    }

    // Метод для подписки на изменения состояния
    // Принимает функцию callback, которая вызывается при изменениях
    // Возвращает функцию для отписки от обновлений (удаляет callback из массива)
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    // Метод для уведомления всех подписчиков, передавая им актуальный isAuthenticated
    notify() {
        this.subscribers.forEach(cb => cb(this.isAuthenticated));
    }

    // Инициализация состояния аутентификации при старте приложения
    async init() {
        const token = localStorage.getItem('token');  // Берём токен из localStorage

        // Если токена нет — сразу считаем, что не аутентифицированы и проверку провели
        if (!token) {
            this.isAuthenticated = false;
            this.isChecked = true;
            return;
        }

        // Проверка просроченности токена (парсим payload JWT и сравниваем время)
        const isExpired = (() => {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));  // Декодируем payload JWT
                const now = Date.now() / 1000;                         // Текущее время в секундах
                return payload.exp < now;                              // true если срок истёк
            } catch {
                return true; // Если что-то пошло не так — считаем токен просроченным
            }
        })();

        if (isExpired) {
            try {
                // Если токен просрочен — пытаемся обновить через сервис
                await AuthService.refresh();
                this.isAuthenticated = true;
            } catch {
                // Если обновление не удалось — сбрасываем состояние и удаляем токен
                this.isAuthenticated = false;
                localStorage.removeItem('token');
            }
        } else {
            try {
                // Если токен валиден — проверяем его на сервере через API
                await AuthService.check();
                this.isAuthenticated = true;
            } catch(e) {
                // Если сервер вернул ошибку — сбрасываем и удаляем токен
                this.isAuthenticated = false;
                localStorage.removeItem('token');
                console.error(e);   
            }
        }

        // Отмечаем, что проверка завершена (независимо от результата)
        this.isChecked = true;
    }

    // Метод сброса состояния аутентификации (например, при выходе из аккаунта)
    reset() {
        this.isAuthenticated = false;
        this.isChecked = false;
        localStorage.removeItem('token');  // Удаляем токен из localStorage
    }
}

export default new AuthState(); // Экспортируем один экземпляр класса — синглтон для глобального состояния
