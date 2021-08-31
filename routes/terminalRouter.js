const express = require('express');
const terminalController = require('../controller/terminalController.js');
const terminalRouter = express.Router();

terminalRouter.get('/',terminalController.renderTerminal);
terminalRouter.post('/getTicket',terminalController.getTicket);
terminalRouter.post('/setStateTicket',terminalController.setStateTicket)
terminalRouter.post('/updatePointerNull',terminalController.updatePointerNull)
module.exports = terminalRouter;
