const express = require('express');
const loginController = require('../controller/loginController');
const loginRouter = express.Router();


loginRouter.get('/',loginController.renderLogin);
loginRouter.post('/auth',loginController.authUser);
module.exports = loginRouter;
