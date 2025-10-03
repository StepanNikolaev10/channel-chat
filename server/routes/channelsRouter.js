import express from 'express';
import ChannelsController from '../controllers/ChannelsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { creatorRoleMiddleware } from '../middlewares/creatorRoleMiddleware.js';
import { check } from 'express-validator';

const channelsRouter = express.Router();

channelsRouter.post(
    '/',
    authMiddleware,
    [
        check('name')
        .notEmpty().withMessage('Channel name cannot be empty')
        .isLength({ min: 3, max: 30 }).withMessage('Channel name must be 3–30 characters long')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Channel name can only contain letters, numbers, underscores, and dashes'),

        check('password')
        .optional() 
        .isLength({ min: 4, max: 40 }).withMessage('Password must be 4–40 characters long')
        .matches(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\].,:;"'<>?/|\\\-~]+$/)
        .withMessage('Password can only contain letters, numbers, and common symbols'),

        check('description')
        .optional()
        .isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
    ],
    ChannelsController.createChannel
);

channelsRouter.put('/:id', authMiddleware, creatorRoleMiddleware, ChannelsController.editChannel);
channelsRouter.delete('/:id', authMiddleware, creatorRoleMiddleware, ChannelsController.deleteChannel);
channelsRouter.get('/all', authMiddleware, ChannelsController.getAllChannels);
channelsRouter.post('/searched', authMiddleware, ChannelsController.getSearchedChannels);
channelsRouter.get('/:id', authMiddleware, ChannelsController.getChannelInfo);
channelsRouter.post('/:id/join', authMiddleware, ChannelsController.joinChannel);
channelsRouter.post('/leave', authMiddleware, ChannelsController.leaveChannel);
channelsRouter.get('/:id/members', authMiddleware, ChannelsController.getMembers);
channelsRouter.get('/:id/messages', authMiddleware, ChannelsController.getMessages);

export default channelsRouter;
