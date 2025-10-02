import ChannelService from '../services/ChannelsService.js';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/ApiError.js';

class ChannelsController {
    async createChannel(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }

            const creatorInfo = req.user;
            const { name, type, password, description, tags } = req.body;

            if (type === 'closed' && (!password || password.trim() === '')) {
                return next(ApiError.BadRequest('Password is required for closed channels'));
            }

            const newChannel = await ChannelService.createChannel(
                creatorInfo,
                name,
                type,
                password,
                description,
                tags
            );

            res.status(200).json(newChannel);
        } catch (e) {
            console.error(`ChannelsController.createChannel error: ${e.message}`);
            next(e);
        }
    }

    async editChannel(req, res, next) {
        try {
            const channelId = req.params.id;
            const channelData = req.body;
            console.log(channelData)
            const editedChannel = await ChannelService.editChannel(channelId, channelData);
            res.status(200).json(editedChannel);
        } catch (e) {
            console.error(`ChannelsController.editChannel error: ${e.message}`);
            next(e);
        }
    }

    async deleteChannel(req, res, next) {
        try {
            const channelId = req.params.id;
            const userId = req.user.id;
            await ChannelService.deleteChannel(userId, channelId);
            res.sendStatus(200);
        } catch (e) {
            console.error(`ChannelsController.deleteChannel error: ${e.message}`);
            next(e);
        }
    }

    async getAllChannels(req, res, next) {
        try {
            const channels = await ChannelService.getAllChannels();
            res.status(200).json(channels);
        } catch (e) {
            console.error(`ChannelsController.getAllChannels error: ${e.message}`);
            next(e);
        }
    }

    async getSearchedChannels(req, res, next) {
        try {
            const { name, selectedTags } = req.body;
            const channels = await ChannelService.getSearchedChannels({ name, selectedTags });
            res.status(200).json(channels);
        } catch (e) {
            console.error(`ChannelsController.getSearchedChannels error: ${e.message}`);
            next(e);
        }
    }

    async getChannelInfo(req, res, next) {
        try {
            const channelId = req.params.id;
            const channelInfo = await ChannelService.getChannelInfo(channelId);
            res.status(200).json(channelInfo);
        } catch (e) {
            console.error(`ChannelsController.getChannelInfo error: ${e.message}`);
            next(e);
        }
    }

    async joinChannel(req, res, next) {
        try {
            const userId = req.user.id;
            const channelId = req.params.id;
            const { type, password } = req.body;
            await ChannelService.joinChannel(channelId, userId, type, password);
            res.sendStatus(200);
        } catch (e) {
            console.error(`ChannelsController.joinChannel error: ${e.message}`);
            next(e);
        }
    }

    async leaveChannel(req, res, next) {
        try {
            const userId = req.user.id;
            await ChannelService.leaveChannel(userId);
            res.sendStatus(200);
        } catch (e) {
            console.error(`ChannelsController.leaveChannel error: ${e.message}`);
            next(e);
        }
    }

    async getMembers(req, res, next) {
        try {
            const channelId = req.params.id;
            const members = await ChannelService.getMembers(channelId);
            res.status(200).json(members);
        } catch (e) {
            console.error(`ChannelsController.getMembers error: ${e.message}`);
            next(e);
        }
    }

    async getMessages(req, res, next) {
        try {
            const channelId = req.params.id;
            const messages = await ChannelService.getMessages(channelId);
            res.status(200).json({
                userId: req.user.id,
                messages
            });
        } catch (e) {
            console.error(`ChannelsController.getMessages error: ${e.message}`);
            next(e);
        }
    }
}

export default new ChannelsController();
