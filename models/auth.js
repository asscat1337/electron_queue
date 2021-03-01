const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.auth = async (req,res)=>{
    const {setPrivilege}=req.body;
    console.log(setPrivilege);
    console.log(`SELECT * from role  INNER JOIN service ON role.terminalName = service.setTerminalName WHERE role.setPrivilege = '${setPrivilege}'`);
    await connection.query(`SELECT * from role  INNER JOIN service ON role.terminalName = service.setTerminalName WHERE role.setPrivilege = '${setPrivilege}'`)
        .then(result=>{
                console.log(result[0]);
                result[0].find(user=>{
                    if(user.setPrivilege===setPrivilege){
                        req.session.username = setPrivilege;
                        req.session.cabinet = user.cabinet;
                    }
                })
                return res.redirect(301,'/op')
            }
        )
}