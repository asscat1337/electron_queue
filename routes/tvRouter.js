const express = require('express');
const tvController = require('../controller/tvController.js');
const tvRouter = express.Router();

tvRouter.use('/',tvController.tv);

module.exports = tvRouter;