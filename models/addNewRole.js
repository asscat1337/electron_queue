const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.addNewRole = (req,res)=>{
    const {role,cab,terminalName}= req.body;
    console.log(req.body);
    connection.query(`INSERT into role(role_id,setPrivilege,cab,terminalName) VALUES(NULL,'${role}','${cab}','${terminalName}')`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}));
    connection.query(`INSERT into ${terminalName}(role_id,setPrivilege,cab,terminalName) VALUES(NULL,'${role}','${cab}','${terminalName}')`)
}