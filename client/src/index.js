import AuthState from './state/AuthState.js';
import UserState from './state/UserState.js';
import Router from './Router/index.js';

async function startApp() {
    await AuthState.init();
    if (AuthState.isAuthenticated) {
        await UserState.init();
    }
    await Router.init();
}
startApp();
