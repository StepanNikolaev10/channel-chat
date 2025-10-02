import TokenService from "../services/TokenService.js";

export const authMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError('Missing authorization header'));
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError('Access token not provided'));
        }

        const userData = TokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError('Invalid or expired access token'));
        }

        req.user = userData;
        next();
    } catch (e) {
        console.error(`authMiddleware error: ${e.message}`);
        next(e);
    }
}
