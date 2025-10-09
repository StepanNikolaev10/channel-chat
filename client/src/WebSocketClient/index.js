class WebSocketClient {
    constructor() {
        this.socket = null;
        this.listeners = { message: [], open: [], close: [], error: [] };
    }

    // метод для запуска веб сокет клиента с обработчиками событий которые обрабатывают данные что приходят и сервера.
    connect() {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('token');
            this.socket = new WebSocket('ws://localhost:5000');

            this.socket.addEventListener('open', (event) => {
                this.socket.send(JSON.stringify({ type: 'auth', token }));
                this.listeners.open.forEach(callback => callback(event));
                resolve();
            });

            this.socket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data);
                this.listeners.message.forEach(callback => callback(data));
            });

            this.socket.addEventListener('close', (event) => {
                this.listeners.close.forEach(callback => callback(event));
            });

            this.socket.addEventListener('error', (event) => {
                this.listeners.error.forEach(cb => cb(event));
                reject(event);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    send(data) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn('Socket not open. Cannot send:', data);
        }
    }

    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }
}


export default new WebSocketClient();