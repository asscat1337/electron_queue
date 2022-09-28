const express = require('express');
const terminalController = require('../controller/terminalController.js');
const terminalRouter = express.Router();

terminalRouter.get('/',terminalController.renderTerminal);
terminalRouter.post('/getTicket',terminalController.getTicket);
terminalRouter.post('/setStateTicket',terminalController.setStateTicket)
terminalRouter.post('/updatePointerNull',terminalController.updatePointerNull)
terminalRouter.get('/get-service',terminalController.getServiceData)
module.exports = terminalRouter;
