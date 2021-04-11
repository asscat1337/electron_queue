const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.addNewService = async (req,res)=>{
    const {letter,ServiceName,description,pointer,Priority,status,setTerminalName,cabinet,role,start_time,end_time} = req.body;
     await connection.query(`INSERT into service(id,Letter,ServiceName,description,pointer,Priority,status,setTerminalName,cabinet,start_time,end_time)
      VALUES(NULL,'${letter}','${ServiceName}','${description}','${pointer}','${Priority}','${status}','${setTerminalName}','${cabinet}','${start_time}','${end_time}')`)
         .then(result=>{
              if(result){
                 connection.query(`SELECT id FROM service WHERE serviceName = '${ServiceName}'`)
                     .then(result1=>{
                     role.map(item => {
                         console.log(`INSERT INTO roles VALUES(NULL,'${result1[0].map(item=>item.id).join(',')}','${item}','${setTerminalName}')`);
                         connection.query(`INSERT INTO roles VALUES(NULL,'${result1[0].map(item=>item.id).join(',')}','${item}','${setTerminalName}')`)
                     })
                 })
              }
         })
          .catch(err=>res.json({"error":err}));
}