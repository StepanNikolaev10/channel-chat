import ApiError from '../exceptions/ApiError.js';
import db from '../db.js';

export const creatorRoleMiddleware = async (req, res, next) => {
    try {
        const channelId = req.params.id;
        const userId = req.user.id;

        if (!channelId) {
            return next(ApiError.BadRequest('Channel ID not specified.'));
        }

        const channelRef = db.collection('channels').doc(channelId);
        const channelDoc = await channelRef.get();

        if (!channelDoc.exists) {
            return next(ApiError.NotFound('Channel not found.'));
        }

        const channelData = channelDoc.data();

        if (channelData.createdBy.id !== userId) {
            return next(ApiError.Forbidden('You do not have permission to modify this channel.'));
        }

        req.channel = channelData;
        req.channelId = channelDoc.id;
        next();

    } catch (e) {
        console.error(`creatorRoleMiddleware error: ${e.message}`);
        next(e);
    }
};
