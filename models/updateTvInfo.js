const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();

exports.updateTvInfo = (req,res)=>{
    const {isChecked,cabinet,number} = req.body;
    connection.query(`SELECT * from role WHERE cab='${cabinet}'`)
        .then(res=>{
            res[0].find(item=>{
                connection.query(`UPDATE stateticket SET isChecked='${isChecked}',Privilege='${item.setPrivilege}',cabinet='${cabinet}',called=0 WHERE number='${number}'`)
                    .then(result=>{
                        if(result){
                            res.json({"success":true})
                        }
                    })
                    .catch(err=>res.json({"error":err}))
            })
        })
};