import { validationResult } from 'express-validator';
import AuthService from '../services/AuthService.js';
import ApiError from '../exceptions/ApiError.js';

class AuthController {
    async signUp(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }

            const { username, password } = req.body;
            const userData = await AuthService.signUp(username, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, 
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                path: '/'
            });

            return res.status(200).json(userData);
        } catch (e) {
            console.error(`AuthController.signUp error: ${e.message}`);
            next(e);
        }
    }

    async signIn(req, res, next) {
        try {
            const { username, password } = req.body;
            const userData = await AuthService.signIn(username, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                path: '/'
            });

            return res.status(200).json(userData);
        } catch (e) {
            console.error(`AuthController.signIn error: ${e.message}`);
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            await AuthService.logout(refreshToken);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                path: '/'
            });

            return res.status(200).json({ success: true });
        } catch (e) {
            console.error(`AuthController.logout error: ${e.message}`);
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await AuthService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                path: '/'
            });

            return res.status(200).json(userData);
        } catch (e) {
            console.error(`AuthController.refresh error: ${e.message}`);
            next(e);
        }
    }

    async check(req, res, next) {
        try {
            if (!req.user) {
                return next(ApiError.Unauthorized('User not authenticated'));
            }
            return res.status(200).json({ user: req.user });
        } catch (e) {
            console.error(`AuthController.check error: ${e.message}`);
            next(e);
        }
    }
}

export default new AuthController();
