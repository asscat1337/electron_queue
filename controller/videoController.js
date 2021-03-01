const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.video = (req,res)=>{
    res.render('videos');
};