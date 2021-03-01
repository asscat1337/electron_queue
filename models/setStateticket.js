const config = require('../core/config');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.setStateTicket = (req,res)=>{
    const {number,time,date,service,Privilege,nameTerminal,cabinet} = req.body;
    connection.query(`INSERT into stateticket(id,time,date,number,service,Privilege,terminalName,called,calledAgain,sound,isChecked,cabinet) 
    VALUES (NULL,'${time}','${date}','${number}','${service}','${Privilege}','${nameTerminal}',0,0,0,0,'${cabinet}')`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}));
}

