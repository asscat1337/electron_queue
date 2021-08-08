const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.showTerminalUsers = async (req,res)=>{
    const {data} = req.body
    await connection.query(`SELECT *  FROM role WHERE terminalName = '${data}'`)
        .then(result=>{
            res.json(result[0])
        })
};