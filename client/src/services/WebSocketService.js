import WebSocketClient from "../WebSocketClient";

class WebSocketService {
    async connectToSocket(channelId) {
        try {
            if (!WebSocketClient.socket || WebSocketClient.socket.readyState !== WebSocket.OPEN) {
                await WebSocketClient.connect();
                WebSocketClient.send({ type: 'connect_to_socket', channelId: channelId });
            }

        } catch (e) {
            console.error('WebSocket error:', e);
        }
    }

    disconnectFromSocket(channelId) {
        try {
            if (WebSocketClient.socket && WebSocketClient.socket.readyState === WebSocket.OPEN) {
                WebSocketClient.send({ type: 'disconnect_from_socket', channelId: channelId });
                WebSocketClient.disconnect()
            }
        } catch (e) {
            console.error('WebSocket error:', e);
        }
    }
}

export default new WebSocketService();