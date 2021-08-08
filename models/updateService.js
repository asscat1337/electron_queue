const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.updateService = (req,res)=>{
    const {update,serviceName} = req.body;
    connection.query(`UPDATE service SET status=${update} WHERE ServiceName = '${serviceName}'`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}))
}