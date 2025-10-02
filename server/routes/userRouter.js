import express from 'express';
import UserController from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/me', authMiddleware, UserController.getProfile);
userRouter.get('/connected-channel', authMiddleware, UserController.getConnectedChannel);

export default userRouter;