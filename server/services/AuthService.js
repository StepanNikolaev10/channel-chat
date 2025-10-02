import db from '../db.js';
import bcrypt from 'bcrypt';
import TokenService from './TokenService.js';
import ApiError from '../exceptions/ApiError.js';

class AuthService {
    async signUp(username, password) {
        const userQuery = await db.collection('users').where('username', '==', username).get();
        if (!userQuery.empty) {
            throw ApiError.BadRequest(`User "${username}" already exists.`);
        }

        const hashedPassword = bcrypt.hashSync(password, 7);
        const newUserRef = await db.collection('users').add({
            username,
            password: hashedPassword,
            roles: ['user'],
            connectedChannel: 'none',
            createdChannel: 'none'
        });

        const tokenPayload = {
            id: newUserRef.id,
            username,
            roles: ['user']
        };

        const tokens = TokenService.generateTokens(tokenPayload);
        await TokenService.saveToken(newUserRef.id, tokens.refreshToken);

        return {
            ...tokens,
            user: {
                id: newUserRef.id,
                username,
                roles: ['user']
            }
        };
    }

    async signIn(username, password) {
        const userQuery = await db.collection('users').where('username', '==', username).get();
        if (userQuery.empty) {
            throw ApiError.BadRequest(`User "${username}" not found.`);
        }

        const doc = userQuery.docs[0];
        const userData = doc.data();

        const isPasswordValid = bcrypt.compareSync(password, userData.password);
        if (!isPasswordValid) {
            throw ApiError.BadRequest('Incorrect password.');
        }

        const tokenPayload = {
            id: doc.id,
            username: userData.username,
            roles: userData.roles || ['user']
        };

        const tokens = TokenService.generateTokens(tokenPayload);
        await TokenService.saveToken(doc.id, tokens.refreshToken);

        return {
            ...tokens,
            user: {
                id: doc.id,
                username: userData.username,
                roles: userData.roles || ['user']
            }
        };
    }

    async logout(refreshToken) {
        const result = await TokenService.removeToken(refreshToken);
        if (!result) {
            throw ApiError.BadRequest('Refresh token not found or already removed.');
        }
        return { success: true };
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.Unauthorized('Refresh token is missing.');
        }

        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await TokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.Unauthorized('Refresh token is invalid or not found in database.');
        }

        const newTokenPayload = {
            id: userData.id,
            username: userData.username,
            roles: userData.roles
        };

        const tokens = TokenService.generateTokens(newTokenPayload);
        await TokenService.saveToken(userData.id, tokens.refreshToken);

        return {
            ...tokens,
            user: {
                id: userData.id,
                username: userData.username,
                roles: userData.roles
            }
        };
    }
}

export default new AuthService();
