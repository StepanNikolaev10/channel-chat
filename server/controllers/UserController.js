import UserService from '../services/UserService.js';

class UserController {
    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const profile = await UserService.getProfile(userId);
            return res.status(200).json(profile);
        } catch (e) {
            console.error(`UserController.getProfile error: ${e.message}`);
            next(e);
        }
    }

    async getConnectedChannel(req, res, next) {
        try {
            const userId = req.user.id;
            const connectedChannel = await UserService.getConnectedChannel(userId);
            return res.status(200).json(connectedChannel);
        } catch (e) {
            console.error(`UserController.getConnectedChannel error: ${e.message}`);
            next(e);
        }
    }
}

export default new UserController();
