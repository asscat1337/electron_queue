const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.deletePrivilege=(req,res)=>{
    const {user} = req.body;
    connection.query(`UPDATE role SET terminalName="" WHERE setPrivilege='${user}'`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}));
}