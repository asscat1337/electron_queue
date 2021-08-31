const express = require('express');
const config = require('../core/config.js');
const mysql = require('mysql2');
const opController = require('../controller/opController.js');
const connection = mysql.createConnection(config).promise();
const opRouter = express.Router();

opRouter.get('/',opController.renderOp);
opRouter.post('/getCabinet',opController.getCabinet)
module.exports = opRouter;