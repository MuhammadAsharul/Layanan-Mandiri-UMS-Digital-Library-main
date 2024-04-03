const { Router } = require('express');
const m$fines = require('../modules/fines.modules');
const response = require('../helpers/response');
const { userSession } = require('../helpers/middleware');


const FinesController = Router();

/**
 * Get all fines in one User
 * @param {string} cardnumber
*/


FinesController.get('/user/total',userSession, async (req, res, next) => {
    const fines = await m$fines.totalMyFines(req.user.cardnumber)
    response.sendResponse(res, fines)
})

FinesController.get('/user/list', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$fines.listMyFines(req.user.cardnumber))
})

FinesController.post('/charge', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$fines.chargeFines(req.user.cardnumber, req.body))
})


module.exports = FinesController;

