const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();
exports.ts = (req,res)=>{
    let data;
    connection.query(`SELECT * FROM qs.service where  setTerminalName='${req.query.id}' and status = 1`)
        .then(result=>{
        connection.query(`SELECT description__text from description__term WHERE terminalName='${req.query.id}'`)
            .then(res1=>{
                if(result[0].some(item=>item.setTerminalName===req.query.id)){
                    res.render('ts',{
                        data:result[0],
                        data1:res1[0]
                    });
                    data=req.query.id;
                    module.exports.dataExport = data;
                }else{
                    res.status(404).send("404");
                }
            })
        })
        .catch(err=>err);
};
//module.exports.dataExport = data;