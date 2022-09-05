const express = require('express');
const opController = require('../controller/opController.js');
const opRouter = express.Router();

opRouter.get('/',opController.renderOp);
opRouter.get('/get-ticket',opController.getTicket)
opRouter.post('/getCabinet',opController.getCabinet)


module.exports = opRouter;