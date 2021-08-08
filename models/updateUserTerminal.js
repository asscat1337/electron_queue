const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.updateUserTerminal = (req,response)=>{
    const {serviceName,user} = req.body;
    console.log(serviceName,user);
    connection.query(`SELECT serviceName,setTerminalName from service WHERE serviceName='${serviceName}'`)
        .then(res=>res[0].find(item=>{
            console.log(item);
            connection.query(`UPDATE role SET terminalName='${item.setTerminalName}' WHERE setPrivilege='${user}'`)
                .then(result=>{
                    if(result){
                        response.json({"success":true})
                    }
                })
                .catch(err=>response.json({"error":err}))
        }))
}