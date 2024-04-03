const {Router} = require('express');
const m$notification = require('../modules/notifications.module');
const response = require('../helpers/response');
const {userSession} = require('../helpers/middleware');


const NotificationController = Router();

NotificationController.post('/',  async (req, res, next) => {
    response.sendResponse(res, await m$notification.getNotifications(req.body))
})


module.exports = NotificationController;