const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.showFreeUsers = (req,res)=>{
    connection.query(`SELECT * from role WHERE terminalName is null or trim(terminalName)=''`)
        .then(response=>res.json(response[0]))
}