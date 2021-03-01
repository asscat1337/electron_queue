const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.updatePointerNull =(req,res)=>{
    const {pointer} = req.body;
    connection.query(`UPDATE service SET pointer=0 WHERE ServiceName = '${pointer}'`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}));
}