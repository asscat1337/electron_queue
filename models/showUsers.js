const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.showUsers = (req,res)=>{
    connection.query(`select * from service inner join role on role.TerminalName = service.setTerminalName WHERE status=1`)
        .then(result=>{
            res.json(result[0])
        })
};