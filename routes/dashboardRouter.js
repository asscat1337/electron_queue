const express = require('express');
const mysql = require('mysql2');
const config = require('../core/config');
const dashboardController = require('../controller/dashboardController');
const {deleteService} = require("../models/model__test/Service/delete");
const connection = mysql.createConnection(config).promise();
const dashboardRouter = express.Router();

dashboardRouter.get('/',dashboardController.renderDashboard);
dashboardRouter.post('/disabledUserService',dashboardController.deleteUserService)
dashboardRouter.post('/showService',dashboardController.showService)
dashboardRouter.post('/showFreeUsers',dashboardController.showFreeUsers)
dashboardRouter.post('/toggleUserService',dashboardController.enableUser)
dashboardRouter.post('/showTerminalUsers',dashboardController.showTerminalUser)
dashboardRouter.post('/addUser',dashboardController.addUser)
dashboardRouter.delete('/deleteUser',dashboardController.deleteUser)
dashboardRouter.post('/disableAcc',dashboardController.disableUser)
dashboardRouter.post('/changeUserData',dashboardController.changeUserData);
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