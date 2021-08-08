const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.updatePointerTime=(async(req,res)=>{
    const {data} = req.body
    await connection.query(`UPDATE service SET pointer = 1 WHERE setTerminalName='${data}'`)
        .then(result=>{
            return res.json({'message':'Данные обновились'})
        })
})