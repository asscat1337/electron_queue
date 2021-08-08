const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.callTicketAgain =(req,res)=>{
    const {ticket,terminalName} = req.body;
    connection.query(`UPDATE tvinfo__${terminalName} SET isCalledAgain=1 WHERE number='${ticket}'`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}));
}