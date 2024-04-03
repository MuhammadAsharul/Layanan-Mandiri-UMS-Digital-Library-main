const { Router } = require('express');
const m$loan = require('../modules/issues.modules');
const response = require('../helpers/response');
const { userSession } = require('../helpers/middleware');

const IssuesController = Router();

/**
 * Get all loans in one User
 * @param {string} cardnumber
 */

IssuesController.get('/:barcode', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$loan.getListCheckoutIssues(req.user.cardnumber, req.params.barcode))
})

IssuesController.get('/',userSession, async (req, res, next) => {
    response.sendResponse(res, await m$loan.listMyIssues(req.user.cardnumber))
})

IssuesController.post('/add', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$loan.addIssues(req.user.cardnumber, req.body))
})

IssuesController.put('/update', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$loan.updateIssuesItems(req.user.cardnumber, req.body))
})





module.exports = IssuesController;