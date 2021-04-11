const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.auth = async (req,res)=>{
    const {setPrivilege}=req.body;
    await connection.query(`SELECT distinct role.role_id,role.setPrivilege,role.terminalName FROM role INNER JOIN roles ON role.role_id = roles.users_id WHERE role.setPrivilege = '${setPrivilege}'`)
        .then(result=>{
                result[0].find(user=>{
                    if(user.setPrivilege===setPrivilege){
                        req.session.username = setPrivilege;
                        req.session.terminal = user.terminalName;
                        req.session.cabinet = user.cabinet;
                    }
                })
                return res.redirect(301,'/op')
            }
        )
}