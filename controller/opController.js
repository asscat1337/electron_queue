const  io = require('../server');
const mysql = require('mysql2');
const config = require('../core/config.js');
const connection = mysql.createConnection(config).promise();

///нужно будет в будущем обязательно переделать
exports.op = async (req,res)=>{
    if(!req.session.username) res.redirect(`/login`);
    else{
        res.render('op',{
            sessionTer:req.session.terminal
        });
     }
}
////
