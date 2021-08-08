const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.updatePointer =(req,res)=>{
    const {data} = req.body;
    console.log(req.body);
    connection.query(`UPDATE service SET pointer=pointer+1 WHERE setTerminalName = '${data}'`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
    .catch(err=>res.json({"error":err}));
}