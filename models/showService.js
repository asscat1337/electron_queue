const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.showService = (req,res)=>{
    connection.query(`SELECT * from service`)
        .then(result=>res.json(result[0]))
}