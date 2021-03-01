const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.showFreeUsers = (req,res)=>{
    connection.query('SELECT role_id,setPrivilege,cab,terminalName from role WHERE terminalName =""')
        .then(response=>res.json(response[0]))
}