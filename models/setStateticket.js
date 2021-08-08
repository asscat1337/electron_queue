const config = require('../core/config');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.setStateTicket = async(req,res)=>{
 const {number,service,nameTerminal,cabinet,id} = req.body;
    await connection.query(`INSERT into tvinfo__${nameTerminal}(tvinfo_id,time,date,number,service,terminalName,cabinet,isCalledAgain,isCall,services_id) 
    VALUES (NULL,current_time(),current_date(),'${number}','${service}','${nameTerminal}','${cabinet}',0,0,${id})`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}));
}

