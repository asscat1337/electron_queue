const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.showTicket = (request,response)=>{
    connection.query(`SELECT * from role WHERE setPrivilege = '${request.session.username}'`)
        .then(res=>{
            console.log(`SELECT * FROM stateticket WHERE called=0 and terminalName='${res[0].map(item=>item.terminalName).join()}' ORDER BY id ASC LIMIT 1`)
            connection.query(`SELECT * FROM stateticket WHERE called=0 and terminalName='${res[0].map(item=>item.terminalName).join()}' ORDER BY id ASC LIMIT 1`)
                .then(result=>{
                    response.json(result[0]);
                    connection.query(`UPDATE stateticket SET called=1 WHERE id='${result[0].map(item=>item.id).join('')}'`)
                })
                .catch(err=>console.log(err))
        })
}