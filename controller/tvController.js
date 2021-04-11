const mysql = require('mysql2');
const config = require('../core/config.js');
const connection = mysql.createConnection(config).promise();
const tv = async(req,res)=> {

    await connection.query(`SELECT * FROM tvinfo__${req.query.id} WHERE  terminalName='${req.query.id}' and isChecked=0 ORDER BY tvinfo_id DESC LIMIT 6`)
        .then(async (data) => {
            await connection.query(`SELECT description__text from description__term WHERE terminalName='${req.query.id}'`)
                .then(data1 => {
                    connection.query(`SELECT link from videos`)
                        .then(data2 => {
                            res.render('tv', {
                                template: data[0],
                                template1: data1[0],
                                videos: data2[0],
                                isRegistry: req.query.id.toString().includes('reg')
                            });
                        })
                })
        });
};
module.exports = tv;