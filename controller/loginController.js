const mysql = require('mysql2');
const config = require('../core/config');
const connection = mysql.createConnection(config).promise();


exports.login = (req,res)=>{
    const query = req.query.uch;
                connection.query(`SELECT distinct role.role_id,role.setPrivilege,role.terminalName from role inner JOIN roles ON roles.users_id = role.role_id WHERE role.terminalName= '${query}'`)
                    .then(data=>{
                        if(data[0].length){
                            res.render('login',{
                                result:data[0],
                            });
                        }
                        else{
                            res.status(500).render('template/error',{
                                error:'Не найдено пользователей'
                            })
                        }
                    })
};