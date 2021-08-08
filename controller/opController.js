const  io = require('../server');
const mysql = require('mysql2');
const config = require('../core/config.js');
const connection = mysql.createConnection(config).promise();

exports.op = async (req,res)=>{
    if(!req.session.userdata) res.redirect(`/login`);
    else{
        res.render('op',{
            userId:req.session.userdata.role_id,
            sessionTer:req.session.userdata.terminalName,
            sessionCab:req.session.userdata.cab
        });
     }
}
////
