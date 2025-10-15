import styles from './styles.module.scss';
import ChannelsService from '../../../services/ChannelsService.js';  
import UserState from '../../../state/UserState.js';
import WebSocketClient from '../../../WebSocketClient/index.js';
import LangState from '../../../state/LangState.js';

class ChatWindow extends HTMLElement {
    constructor() {
        super();
        this.eventListeners = [];
        this._isSubscribedToSocket = false;
        this.langUnsubscribe = null;
    }

    connectedCallback() {
        this.setupStyles();
        this.render();
        this.initChat();
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
        this.style.flexGrow = '1';
    }

    render() {
        this.innerHTML = `
            <div class="${styles.container}">
                <div class="${styles.messages}" data-role="messages-list"></div>
                <div class="${styles.messageInputContainer}">
                    <input class="${styles.messageInput}" type="text" data-role="message-input" placeholder="Type your message...">
                    <button class="${styles.button}" data-role="send-btn">Send</button>
                </div>
            </div>
        `;
    }

    updateLanguage(lang) {
        const input = this.querySelector('[data-role="message-input"]');
        const sendBtn = this.querySelector('[data-role="send-btn"]');
        if (!input || !sendBtn) return;

        if (lang === 'en') {
            input.placeholder = 'Type your message...';
            sendBtn.textContent = 'Send';
        } else if (lang === 'ru') {
            input.placeholder = 'Введите сообщение...';
            sendBtn.textContent = 'Отправить';
        }
    }

    async initChat() {
        try {
            await this.loadMessages();
            await this.reconnectToSocket();
            this.attachEvents();
        } catch (e) {
            console.error('Chat initialization failed:', e);
        }
    }

    attachEvents() {
        const sendMessage = async () => {
            const input = this.querySelector('[data-role="message-input"]');
            const text = input.value.trim();
            if (!text || !UserState.connectedChannelInfo.channelId) return;
            
            if (!WebSocketClient.socket || WebSocketClient.socket.readyState !== WebSocket.OPEN) {
                await WebSocketClient.connect();
            }

            WebSocketClient.send({
                type: 'message',
                channelId: UserState.connectedChannelInfo.channelId,
                text
            });
            input.value = '';
        }
        
        const sendBtn = this.querySelector('[data-role="send-btn"]');
        this.addEvent(sendBtn, 'click', sendMessage);

        const input = this.querySelector('[data-role="message-input"]');
        this.addEvent(input, 'keydown', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
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

    async loadMessages() {
        const response = await ChannelsService.getMessages(UserState.connectedChannelInfo.channelId);
        const messagesList = this.querySelector('[data-role="messages-list"]');
        messagesList.innerHTML = '';
        response.messages.forEach(messageData => this.addMessageToChat(messageData));
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    addMessageToChat(data) {
        const messagesList = this.querySelector('[data-role="messages-list"]');
        const message = document.createElement('div');
        message.classList.add(styles.message);

        if (data.senderUsername === 'system') {
            message.classList.add(styles.systemMessage);
        } else if (data.senderUsername === UserState.username) {
            message.classList.add(styles.myMessage);
        } else {
            message.classList.add(styles.otherMessage);
        }

        const messageContent = document.createElement('div');
        messageContent.classList.add(styles.messageContent);

        const author = document.createElement('div');
        author.classList.add(styles.author);
        author.textContent = data.senderUsername === 'system' ? '' : data.senderUsername;

        const text = document.createElement('div');
        text.classList.add(styles.text);
        text.textContent = data.text;

        messageContent.append(author, text);
        message.append(messageContent);
        messagesList.appendChild(message);
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    handleIncomingMessage(data) {
        if (data.type === 'message' || data.type === 'system') {
            this.addMessageToChat(data);
        }
    }

    async reconnectToSocket() {
        try {
            if (!WebSocketClient.socket || WebSocketClient.socket.readyState !== WebSocket.OPEN) {
                await WebSocketClient.connect();
                WebSocketClient.send({ type: 'reconnect_to_socket', channelId: UserState.connectedChannelInfo.channelId });
            }
            if (!this._isSubscribedToSocket) {
                WebSocketClient.on('message', (data) => this.handleIncomingMessage(data));
                this._isSubscribedToSocket = true;
            }
        } catch (e) {
            console.error('WebSocket error:', e);
        }
    }

    static define() {
        if (!customElements.get('chat-window')) {
            customElements.define('chat-window', ChatWindow);
        }
    }
}

export default ChatWindow;
