const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.updateDateTime = (req,res)=>{
    const {time}=req.body;
    console.log(`select * from service where cast(start_time as time) between cast('20:00:00' as time ) and current_time()`);
    connection.query(`select * from service where cast(start_time as time) between cast('20:00:00' as time ) and current_time()`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}));
}