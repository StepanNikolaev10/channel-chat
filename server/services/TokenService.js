import jwt from 'jsonwebtoken';
import db from '../db.js';
import { FieldValue } from 'firebase-admin/firestore';
import ApiError from '../exceptions/ApiError.js';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            throw ApiError.Unauthorized('Access token invalid');
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            throw ApiError.Unauthorized('Refresh token invalid');
        }
    }

    async saveToken(userId, refreshToken) {
        if (!userId) {
            throw ApiError.BadRequest('User ID is required');
        }
        const tokensRef = db.collection(`users/${userId}/refreshTokens`);
        const existingTokensSnap = await tokensRef.get();
        if (!existingTokensSnap.empty) {
            const batch = db.batch();
            existingTokensSnap.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }
        return tokensRef.add({
            token: refreshToken,
            createdAt: FieldValue.serverTimestamp()
        });
    }

    async removeToken(refreshToken) {
        const userData = this.validateRefreshToken(refreshToken);
        if (!userData || !userData.id) {
            throw ApiError.Unauthorized('Refresh token invalid');
        }
        const tokensRef = db.collection(`users/${userData.id}/refreshTokens`);
        const tokenSnap = await tokensRef.where('token', '==', refreshToken).get();
        if (tokenSnap.empty) {
            throw ApiError.NotFound('Refresh token not found');
        }
        const batch = db.batch();
        tokenSnap.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        return { success: true };
    }

    async findToken(refreshToken) {
        const userData = this.validateRefreshToken(refreshToken);
        if (!userData || !userData.id) {
            throw ApiError.Unauthorized('Refresh token invalid');
        }
        const tokensRef = db.collection(`users/${userData.id}/refreshTokens`);
        const tokenSnap = await tokensRef.where('token', '==', refreshToken).get();
        if (tokenSnap.empty) {
            throw ApiError.NotFound('Refresh token not found');
        }
        return tokenSnap.docs[0].data();
    }
}

export default new TokenService();
