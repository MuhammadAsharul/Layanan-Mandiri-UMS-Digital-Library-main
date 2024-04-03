const {Router} = require('express')
const m$checkin = require('../modules/checkin.modules')
const response = require('../helpers/response')
const {userSession, verifyAdmin, adminSession} = require('../helpers/middleware')

const CheckinController = Router()

CheckinController.post('/user/add', async (req, res, next) => {
    response.sendResponse(res, await m$checkin.addChekin(req.body))
})

CheckinController.put('/user/update', async (req, res, next) => {
    response.sendResponse(res, await m$checkin.updateItemsChekin(req.body))
})

CheckinController.delete('/user/delete', async (req, res, next) => {
    response.sendResponse(res, await m$checkin.deleteIssues(req.body))
})

CheckinController.get('/user/list', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$checkin.listMyChekin(req.user.cardnumber))
})

CheckinController.get('/admin/list', adminSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await m$checkin.listPending(req.user.userid))
})

CheckinController.get('/admin/list/success', adminSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await m$checkin.listSuccess(req.user.userid))
})

CheckinController.get('/admin/list/:barcode', adminSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await m$checkin.checkDropbox(req.user.userid, req.params.barcode))
})

CheckinController.get('/mylist/:barcode',  async (req, res, next) => {
    response.sendResponse(res, await m$checkin.checkMyIssues(req.params.barcode))
})

CheckinController.post('/admin/checkbook', adminSession, verifyAdmin, async (req, res, next) => {
    response.sendResponse(res, await m$checkin.updateStatusDropbox(req.user.userid, req.body))
})


module.exports = CheckinController;