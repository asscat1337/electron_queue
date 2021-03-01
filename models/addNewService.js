const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.addNewService = (req,res)=>{
    const {letter,ServiceName,description,pointer,Priority,status,setService,setTerminalName,cabinet} = req.body;
    connection.query(`INSERT into service(id,Letter,ServiceName,description,pointer,Priority,status,setService,setTerminalName,cabinet)
    VALUES(NULL,'${letter}','${ServiceName}','${description}','${pointer}','${Priority}','${status}',
    '${setService}','${setTerminalName}','${cabinet}')`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}));
}