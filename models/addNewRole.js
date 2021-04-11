const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.addNewRole = (req,res)=>{
    const {role,cab,terminalName}= req.body;
    console.log(role,cab,terminalName);
    connection.query(`SELECT * from role WHERE setPrivilege='${role}' AND terminalName='${terminalName}' and cab = '${cab}'`)
        .then(result=>{
            if(result[0].length){
                res.json({"error":"Пользователь существует"})
            }
        })
        .catch(err=>res.json({"error":err}));

    connection.query(`INSERT into role(role_id,setPrivilege,cab,isActive,terminalName) VALUES(NULL,'${role}','${cab}','1','${terminalName}')`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
}