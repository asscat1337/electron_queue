const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.addNewRole = (req,res)=>{
    const {role,cab,terminalName,isCab}= req.body;
    connection.query(`SELECT * from role WHERE setPrivilege='${role}' AND terminalName='${terminalName}' and cab = '${cab}'`)
        .then(result=>{
            if(result[0].length){
                res.json({"error":"Пользователь существует"})
            }
        })
        .catch(err=>res.json({"error":err}));

    connection.query(`INSERT into role(role_id,setPrivilege,cab,isActive,terminalName,isCab) VALUES(NULL,'${role}','${cab}','1','${terminalName}','${isCab}')`)
        .then(result=>{
            if(result){
               connection.query(`SELECT * from role WHERE setPrivilege='${role}' AND cab='${cab}' AND terminalName='${terminalName}'`)
                   .then(data=>{
                       data[0].map(item=>{
                           connection.query(`INSERT into roles VALUES(NULL,'','${item.role_id}','${item.terminalName}','${item.cab}')`)
                               .then(()=>{
                                   res.json({"success":true})
                               })
                       })
                   })
            }
        })
}