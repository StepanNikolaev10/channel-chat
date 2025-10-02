import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import ChannelService from '../services/ChannelsService.js';

export function setupWebSocket(server, PORT) {
    const wss = new WebSocketServer({ server });
    
    wss.on('listening', () => {
        console.log(`WSS attached to server on PORT: ${PORT}`);
    }); 

    wss.on('connection', (socket, req) => {

        socket.on('message', async function (data) {
            let jsonData = JSON.parse(data);

            if (jsonData.type === 'auth') { // не текст сообщение, а сообщения приходящие от клиента серверу
                try {
                    const userData = jwt.verify(jsonData.token, process.env.JWT_ACCESS_SECRET);
                    socket.userId = userData.id;
                    socket.username = userData.username;
                    socket.isAuthenticated = true;
                } catch (e) {
                    socket.send(JSON.stringify({type: 'error', message: 'Unathorized'}));
                    socket.close();
                }
            }

            else if (jsonData.type === 'connect_to_socket' && socket.isAuthenticated) { // обработка первичному подключению к каналу
                socket.channelId = jsonData.channelId;
                console.log(`User ${socket.username} joined socket ${jsonData.channelId}`);
                const joinMessage = {
                    type: 'system',
                    senderId: 'system',
                    senderUsername: 'system',
                    text: `${socket.username} has joined the channel`,
                    timestamp: new Date().toISOString()
                };
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN && 
                        client.isAuthenticated && 
                        client.channelId === socket.channelId) {
                        client.send(JSON.stringify(joinMessage));
                    }
                });
            }

            else if (jsonData.type === 'reconnect_to_socket' && socket.isAuthenticated) { // обработка переподключения к сокету
                if (jsonData.channelId) {
                    socket.channelId = jsonData.channelId;
                    console.log(`User ${socket.username} reconnected to socket ${socket.channelId}`);
                }
            } 

            else if (jsonData.type === 'disconnect_from_socket' && socket.isAuthenticated) {
                socket.channelId = jsonData.channelId;
                console.log(`User ${socket.username} has left the socket ${jsonData.channelId}`);
                const leaveMessage = {
                    type: 'system',
                    senderId: 'system',
                    senderUsername: 'system',
                    text: `${socket.username} has left the channel`,
                    timestamp: new Date().toISOString()
                };
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN && 
                        client.isAuthenticated && 
                        client.channelId === socket.channelId) {
                        client.send(JSON.stringify(leaveMessage));
                    }
                });
            } 

            else if (jsonData.type === 'message' && socket.isAuthenticated) { // обработка сообщений
                try {
                    await ChannelService.sendMessage(socket.userId, jsonData.text);
                    const messageData = {
                        type: 'message',
                        channelId: jsonData.channelId,
                        senderId: socket.userId, 
                        senderUsername: socket.username, 
                        text: jsonData.text, 
                        timestamp: new Date().toISOString() 
                    };
                    
                    // Рассылаем всем участникам канала
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN && 
                            client.isAuthenticated && 
                            client.channelId === socket.channelId) {
                            client.send(JSON.stringify(messageData));
                        }
                    });
                } catch (e) {
                    ws.send(JSON.stringify({type: 'error', message: e.message}));
                }
            }

        });

        socket.on('error', () => { console.error(error) });
    });
}
