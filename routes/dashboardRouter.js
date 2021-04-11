const express = require('express');
const mysql = require('mysql2');
const config = require('../core/config');
const dashboardController = require('../controller/dashboardController');
const connection = mysql.createConnection(config).promise();
const dashboardRouter = express.Router();

dashboardRouter.get('/',dashboardController.dashboard);

dashboardRouter.post('/disableAcc',async(req,res)=>{
    const {id,status} = req.body;
    console.log(id,status)
    connection.query(`UPDATE role SET isActive=${status} WHERE role_id='${id}'`)
        .then(result=>{
            if(status===0){
                res.json({'message':'Пользователь отключен'})
            }else{
                res.json({'message':'Пользователь активирован'})
            }
        })
})

module.exports = dashboardRouter;