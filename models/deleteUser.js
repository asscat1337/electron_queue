const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.deleteUser = (req,res)=>{
    const {role} = req.body;
    connection.query(`DELETE FROM role WHERE setPrivilege = '${role}'`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}))
}