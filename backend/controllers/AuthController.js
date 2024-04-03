const { Router } = require('express');
const response = require('../helpers/response');
const m$auth = require('../modules/auth.modules');
const { userSession } = require('../helpers/middleware');

const AuthController = Router();


AuthController.post('/', async (req, res, next) => {
    const login = await m$auth.login(req.body)
    response.sendResponse(res, login)
})

AuthController.post('/index', async (req, res, next) => {
    response.sendResponse(res, await m$auth.indexLogin(req.body))
})

AuthController.post('/admin', async (req, res, next) => {
    response.sendResponse(res, await m$auth.adminLogin(req.body))
})

AuthController.post('/logout', async (req, res, next) => {
    response.sendResponse(res, await m$auth.logout(req.body))
})

AuthController.get('/user/image', userSession ,async (req, res, next) => {
    response.sendResponse(res, await m$auth.getImageUser(req.user.cardnumber))
})

AuthController.put('/user/update', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$auth.updateUser(req.user.cardnumber, req.body))
})

AuthController.get('/user/list', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$auth.getDataUser(req.user.cardnumber))
})


module.exports = AuthController;