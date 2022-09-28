const express = require('express');
const dashboardController = require('../controller/dashboardController');
const dashboardRouter = express.Router();

dashboardRouter.get('/',dashboardController.renderDashboard);
dashboardRouter.post('/showService',dashboardController.showService)
dashboardRouter.post('/showTerminalUsers',dashboardController.showTerminalUser)
dashboardRouter.delete('/deleteUser',dashboardController.deleteUser)
dashboardRouter.post('/disableAcc',dashboardController.disableUser)
dashboardRouter.post('/updateServiceData',dashboardController.updateServiceData)
dashboardRouter.post('/addNewService',dashboardController.addNewService)
dashboardRouter.post('/addNewTerminal',dashboardController.AddNewTerminal)
dashboardRouter.post('/deleteTerminal',dashboardController.deleteTerminal)
dashboardRouter.post('/deleteService',dashboardController.deleteService)
dashboardRouter.post('/registerUser',dashboardController.registerUser)
dashboardRouter.post('/selectUserTerminal',dashboardController.selectUserTerminal)
dashboardRouter.get('/showCurrentUser',dashboardController.showCurrentUser)
dashboardRouter.post('/editUser',dashboardController.editUser)
dashboardRouter.post('/updateServiceUser',dashboardController.updateServiceUser)
dashboardRouter.get('/get-stat',dashboardController.getStat)

module.exports = dashboardRouter;