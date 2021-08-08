const express = require('express');
const config = require('../core/config.js');
const mysql = require('mysql2');
const opController = require('../controller/opController.js');
const connection = mysql.createConnection(config).promise();
const opRouter = express.Router();

opRouter.get('/',opController.op);
opRouter.post('/findTicketState',async(req,res)=>{
    const {number,service} = req.body;
    await connection.query(`SELECT * from stateticket WHERE number='${number}' AND service='${service}' ORDER BY id DESC LIMIT 1`)
        .then(result=>{
            return result[0].map(item=>{
                connection.query(`INSERT into tvinfo__${item.terminalName}(tvinfo_id,time,date,service,number,terminalName,Privilege,cabinet,isChecked)
                    VALUES(NULL,'${item.time}','${item.date}','${item.service}','${item.number}','${item.terminalName}','${item.Privilege}','${item.cabinet}',0)`)
                    .then(res.json({"message":"success"}))
                connection.query(`UPDATE stateticket SET called=1 WHERE number='${number}'`)
            });
        })
        .then(()=>{
            res.json({'data':'success'})
        })
});
module.exports = opRouter;