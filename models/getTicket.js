const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.getTicket =(req,res)=>{
    const {data} = req.body;
    connection.query(`SELECT * FROM qs.service where id = '${data}' and status=1`)
        .then(result=>{
            res.json(result[0]);
        })
        .catch(err=>res.json(err))
    //console.log(`UPDATE service SET pointer=pointer+1 WHERE ServiceName = '${resultUpdatePointer.data}'`);
};