const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();


exports.addNewTerminal = (req,res)=>{
    const {terminalName,descriptionText}= req.body;
    console.log(descriptionText,terminalName);
    connection.query(`INSERT into terminal(terminal_id,nameTerminal,isActive) VALUES(NULL,'${terminalName}',true)`)
        .then(result=>{
            if(result){
                res.json({"success":true})
            }
        })
        .catch(err=>res.json({"error":err}));
    connection.query(`INSERT into description__term(description_id,description__text,terminalName) VALUES(NULL,'${descriptionText}','${terminalName}')`);
    connection.query(`CREATE TABLE tvinfo__${terminalName} (tvinfo_id INT NOT NULL AUTO_INCREMENT,time VARCHAR(45) NULL,
    date VARCHAR(45) NULL,service VARCHAR(45) NULL,number VARCHAR(45) NULL,terminalName VARCHAR(45) NULL,Privilege VARCHAR(45) NULL,
    cabinet VARCHAR(45) NULL,isChecked TINYINT(4) NULL,isCalledAgain TINYINT(4) NULL,isCall TINYINT(4) NULL,services_id VARCHAR(45),PRIMARY KEY (tvinfo_id))`);
}