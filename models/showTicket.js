const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

// Сейчас работает,но это костыль и в будущем нужно обязательно переделать
exports.showTicket = async(request,response)=>{
    await connection.query(`SELECT * FROM role 
INNER JOIN roles ON role.role_id = roles.users_id 
INNER JOIN tvinfo__${request.session.terminal} ON roles.services_id = tvinfo__${request.session.terminal}.services_id WHERE role.setPrivilege = '${request.session.username}' AND isCall = 0 
ORDER BY tvinfo_id ASC LIMIT 1`)
        .then(res=>{
            res[0].map(item=>{
                connection.query(`SELECT * from tvinfo__${request.session.terminal} WHERE tvinfo_id='${item.tvinfo_id}' and isCall = 0`)
                    .then(data=>{
                        response.json(data[0]);
                    })
            })
            })
}
//