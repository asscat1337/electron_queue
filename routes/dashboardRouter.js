const express = require('express');
const mysql = require('mysql2');
const config = require('../core/config');
const dashboardController = require('../controller/dashboardController');
const connection = mysql.createConnection(config).promise();
const dashboardRouter = express.Router();

dashboardRouter.get('/',dashboardController.renderDashboard);
dashboardRouter.post('/disabledUserService',dashboardController.deleteUserService)
dashboardRouter.post('/showService',dashboardController.showService)
dashboardRouter.post('/showUsers',dashboardController.showUsers)
dashboardRouter.post('/showFreeUsers',dashboardController.showFreeUsers)
dashboardRouter.post('/enableUserService',dashboardController.enableUser)
dashboardRouter.post('/showTerminalUsers',dashboardController.showTerminalUser)
dashboardRouter.post('/addUser',dashboardController.addUser)
dashboardRouter.delete('/deleteUser',dashboardController.deleteUser)
dashboardRouter.post('/disableAcc',dashboardController.disableUser)
dashboardRouter.post('/changeUserData',dashboardController.changeUserData);
dashboardRouter.post('/updateServiceData',dashboardController.updateServiceData)
dashboardRouter.post('/addNewService',dashboardController.addNewService)
dashboardRouter.post('/addNewTerminal',dashboardController.AddNewTerminal)

// dashboardRouter.post('/disableAcc',async(req,res)=>{
//     const {id,status} = req.body;
//     connection.query(`UPDATE role SET isActive=${status} WHERE role_id='${id}'`)
//         .then(result=>{
//             if(status===0){
//                 res.json({'message':'Пользователь отключен'})
//             }else{
//                 res.json({'message':'Пользователь активирован'})
//             }
//         })
// })

module.exports = dashboardRouter;