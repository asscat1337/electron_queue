const mysql = require('mysql2');
const config = require('../core/config');
const connection = mysql.createConnection(config).promise();


exports.login = (req,res)=>{
    const query = req.query.uch;
    connection.query(`SELECT setPrivilege FROM role`)
        .then(data=>{
        res.render('login',{
            result:data[0]
        });
    })
}