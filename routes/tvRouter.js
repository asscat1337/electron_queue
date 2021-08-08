const {Router} = require('express');
const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();
const tvController = require('../controller/tvController.js');
const tvRouter = Router();
tvRouter.use('/',tvController);
module.exports = tvRouter;