// const config = require('../core/config.js');
// const mysql = require('mysql2');
// const connection = mysql.createConnection(config).promise();
//
//
// exports.addNewTerminal = async(req,res)=>{
//     const {terminalName,descriptionText}= req.body;
//     await connection.query(`SELECT * from terminal WHERE nameTerminal='${terminalName}'`)
//         .then(async(result)=>{
//             if(result[0].length){
//               return res.json({'message':'Данный терминал уже существует'}).status(400)
//             }
//             else{
//                 await connection.query(`INSERT into terminal(terminal_id,nameTerminal,isActive) VALUES(NULL,'${terminalName}',true)`)
//                     .then(result=>{
//                         if(result){
//                             res.json({"message":true})
//                         }
//                     })
//                     .catch(err=>res.json({"error":err}));
//             }
//         })
//     await connection.query(`CREATE TABLE tvinfo__${terminalName} (tvinfo_id INT NOT NULL AUTO_INCREMENT,time VARCHAR(45) NULL,
//     date VARCHAR(45) NULL,service VARCHAR(45) NULL,number VARCHAR(45) NULL,terminalName VARCHAR(45) NULL,Privilege VARCHAR(45) NULL,
//     cabinet VARCHAR(45) NULL,isCalledAgain TINYINT(4) NULL,isCall TINYINT(4) NULL,services_id VARCHAR(45),PRIMARY KEY (tvinfo_id))`);
// }