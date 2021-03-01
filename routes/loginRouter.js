const express = require('express');
const loginController = require('../controller/loginController');
const loginRouter = express.Router();


loginRouter.use('/',loginController.login);
module.exports = loginRouter;
