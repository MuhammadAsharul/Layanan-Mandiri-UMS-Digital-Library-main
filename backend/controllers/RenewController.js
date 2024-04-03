const {Router} = require('express')
const m$renew = require('../modules/renew.modules')
const response = require('../helpers/response')
const {userSession} = require('../helpers/middleware')

const RenewController = Router()

RenewController.get('/:barcode', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$renew.renewLoan(req.user.cardnumber, req.params.barcode))
})

RenewController.put('/update', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$renew.updateRenew(req.user.cardnumber, req.body))
})

RenewController.post('/statistics', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$renew.addStatisticUpdate(req.user.cardnumber, req.body))
})

module.exports = RenewController;
