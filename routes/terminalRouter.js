const express = require('express');
const terminalController = require('../controller/terminalController.js');
const terminalRouter = express.Router();

terminalRouter.use('/',terminalController.ts);
//terminalRouter.use('/getTicket',terminalController.getTicket);

module.exports = terminalRouter;
