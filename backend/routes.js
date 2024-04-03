const AuthController = require("./controllers/AuthController")
const FinesController = require("./controllers/FinesController")
const IssuesController = require("./controllers/IssuesController")
const RenewController = require("./controllers/RenewController")
const SuggestController = require("./controllers/SuggestController")
const CheckinController = require("./controllers/CheckinController")
const NotificationController = require("./controllers/NotificationController")

const _routes = [
    ['/login', AuthController],
    ['/fines', FinesController],
    ['/issues',IssuesController],
    ['/renew', RenewController],
    ['/suggest', SuggestController],
    ['/checkin', CheckinController],
    ['/notification', NotificationController]
    // ['/articles', ArticleController],
    // ['/comments', CommentController]
]

const routes = (app) => {
    _routes.forEach(route => {
        const [ url, controller ] = route
        app.use(`${url}`, controller)
    });
}

module.exports = routes;