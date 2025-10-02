import express from 'express';
import AuthController from '../controllers/AuthController.js';
import {check} from 'express-validator';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post(
    '/sign-up',
    [
        check('username')
        .notEmpty().withMessage('Username cannot be empty')
        .isLength({ min: 3, max: 20 }).withMessage('Username must be 3–20 characters long')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and dashes'),

        check('password')
        .notEmpty().withMessage('Password cannot be empty')
        .isLength({ min: 4, max: 40 }).withMessage('Password must be 4–40 characters long')
        .matches(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\].,:;"'<>?/|\\\-~]+$/)
        .withMessage('Password can only contain letters, numbers, and common symbols')
    ],
    AuthController.signUp
);
authRouter.post('/sign-in', AuthController.signIn);
authRouter.post('/logout', AuthController.logout);
authRouter.get('/refresh', AuthController.refresh);
authRouter.get('/check', authMiddleware, AuthController.check);

export default authRouter;