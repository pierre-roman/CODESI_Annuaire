//import
var express = require('express');
var CUsers = require('./routes/CUsers');

//Router
exports.router = (function () {
    var apiRouter = express.Router();

    apiRouter.route('/users/register/').post(CUsers.register);
    apiRouter.route('/users/login/').post(CUsers.login);
    apiRouter.route('/users/myInfo/').get(CUsers.getUserProfile);
    apiRouter.route('/users/search').get(CUsers.search);
    apiRouter.route('/users/myInfo/update').put(CUsers.update);
    apiRouter.route('/users/delete').delete(CUsers.delete);


    return apiRouter;
})();