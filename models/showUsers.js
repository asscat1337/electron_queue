const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.showUsers = async (req,res)=>{
    const {id} = req.body
   await connection.query(`SELECT *  FROM role WHERE terminalName = '${id}'`)
        .then(result=>{
            res.json(result[0])
        })
};