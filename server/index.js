import http from 'http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import channelRouter from './routes/channelsRouter.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import { setupWebSocket } from './websocket/index.js';

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app); 

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 1000,
    message: 'Too many requests, please try again later.',
});

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://channel-chat-amber.vercel.app' 
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api', apiLimiter);

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/channels', channelRouter)

app.use(errorMiddleware);

setupWebSocket(server, PORT);

server.listen(PORT, () => console.log('Server started on PORT: ' + PORT));