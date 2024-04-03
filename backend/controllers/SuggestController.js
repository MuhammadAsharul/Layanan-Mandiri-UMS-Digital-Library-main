const { Router } = require('express')
const m$suggest = require('../modules/suggest.modules')
const response = require('../helpers/response')
const { userSession } = require('../helpers/middleware')

const SuggestController = Router()


SuggestController.post('/', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$suggest.addSuggest(req.user.borrowernumber, req.body))
})

SuggestController.put('/update', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$suggest.updateSuggest(req.user.borrowernumber, req.body))
})

SuggestController.delete('/delete/:id', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$suggest.deleteSuggest(req.user.borrowernumber, req.params.id))
})

SuggestController.get('/list', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$suggest.listMySuggest(req.user.borrowernumber))
})

SuggestController.get('/list/:id', userSession, async (req, res, next) => {
    response.sendResponse(res, await m$suggest.listDetailMySuggest(req.user.borrowernumber, req.params.id))
})

module.exports = SuggestController;

