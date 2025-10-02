import LandingPage from '../pages/LandingPage/index.js';
import SignInPage from '../pages/SignInPage/index.js';
import SignUpPage from '../pages/SignUpPage/index.js';
import HomePage from '../pages/HomePage/index.js';
import ChatPage from '../pages/ChatPage/index.js';
import NotFoundErrorPage from '../pages/NotFoundErrorPage/index.js';
import AuthState from '../state/AuthState.js';
import UserState from '../state/UserState.js';

LandingPage.define();
SignInPage.define();
SignUpPage.define();
HomePage.define();
ChatPage.define();
NotFoundErrorPage.define();

class Router {
    constructor() {
        this.routes = {
            '/': { pageTagName: 'landing-page', authorization: 'unrequired' },
            '/sign-in': { pageTagName: 'sign-in-page', authorization: 'unrequired' },
            '/sign-up': { pageTagName: 'sign-up-page', authorization: 'unrequired' },
            '/home': { pageTagName: 'home-page', authorization: 'required' },
            '/chat/:id': { pageTagName: 'chat-page', authorization: 'required' },
            '/errors/not-found': { pageTagName: 'not-found-error-page', authorization: 'unrequired' },
            '/errors/unauthorized': { pageTagName: 'unauthorized-error-page', authorization: 'unrequired' }
        };
        window.addEventListener("popstate", () => this.init());
    }

    // Поиск подходящего маршрута и параметров по пути
    getRoute(path) {
        // сначала проверяем маршрута в объекте this.routes на совпадение путём, если не совпадает не с одним из, то вернётся 404.
        for (const route in this.routes) {
            if (route === path) {
                return { ...this.routes[route], params: {} };
            } else if (route.includes(':id')) {
                const base = route.split('/:id')[0];
                if (path.startsWith(base + '/')) {
                    const id = path.slice(base.length + 1);
                    return { ...this.routes[route], params: { id } };
                }
            }
        }
    }

    // Рендер страницы по маршруту и параметрам
    renderPage(pageTagName, params = {}) {
        if (pageTagName === 'chat-page' && params.id) {
            document.getElementById("app").innerHTML = `<${pageTagName} channel-id="${params.id}"></${pageTagName}>`;
        } else {
            document.getElementById("app").innerHTML = `<${pageTagName}></${pageTagName}>`;
        }
    }

    // Основная логика роутинга и редиректов
    async init() {

        if (!AuthState.isChecked) {
            await new Promise(resolve => {
                const unsub = AuthState.subscribe(() => {
                    if (AuthState.isChecked) {
                        unsub();
                        resolve();
                    }
                });
            });
        }
    
        // Проверки при запуске приложения

        if (!AuthState.isAuthenticated) {
            let currentPath = window.location.pathname;
            if (currentPath === '/' || currentPath === '/sign-in' || currentPath === '/sign-up') {
                const { pageTagName, params } = this.getRoute(currentPath);
                window.history.replaceState({}, "", currentPath);
                this.renderPage(pageTagName, params);
            } else if (currentPath === '/home' || currentPath.includes('/chat/')) {
                currentPath = '/';
                const { pageTagName, params } = this.getRoute(currentPath);
                window.history.replaceState({}, "", currentPath);
                this.renderPage(pageTagName, params);
            } else {
                currentPath = '/errors/not-found';
                const { pageTagName, params } = this.getRoute(currentPath);
                window.history.pushState({}, "", currentPath);
                this.renderPage(pageTagName, params);
            }
            return;
        } else {
            if (UserState.connectedChannelInfo.channelId === 'none') {
                const path = "/home";
                const { pageTagName, params } = this.getRoute(path);
                window.history.replaceState({}, "", path);
                this.renderPage(pageTagName, params);
            } else {
                const path = `/chat/${UserState.connectedChannelInfo.channelId}`;
                const { pageTagName, params } = this.getRoute(path);
                // await this.connectToSocket(UserState.connectedChannelInfo.channelId);
                window.history.replaceState({}, "", path);
                this.renderPage(pageTagName, params);
            }
            return;
        }

    }

    // Навигация по приложению
    navigate(path) {
        window.history.pushState({}, "", path);
        this.init();
    }

}

export default new Router();