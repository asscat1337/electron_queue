const {Router} = require('express');
const tvController = require('../controller/tvController.js');
const tvRouter = Router();

tvRouter.get('/',tvController.renderTv);
module.exports = tvRouter;