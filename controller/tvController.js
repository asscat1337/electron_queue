const mysql = require('mysql2');
const config = require('../core/config.js');
const connection = mysql.createConnection(config).promise();
const moment = require('moment')
const tv = async(req,res)=> {
       await connection.query(`SELECT * FROM tvinfo__${req.query.id} WHERE  terminalName='${req.query.id}' and services_id = '${req.query.service}' and isCall=0 AND date = date_format(now(),"%Y-%m-%d")`)
        .then(async (data) => {
            await connection.query(`SELECT description__text from description__term WHERE terminalName='${req.query.id}'`)
                .then(data1 => {
                    connection.query(`SELECT link from videos`)
                        .then(data2 => {
                            res.render('tv', {
                                template: data[0],
                                template1: data1[0],
                                videos: data2[0],
                                isRegistry: req.query.id.toString().includes('reg'),
                                clock:moment().format('HH:mm:ss'),
                                date:moment().format('D/MM/YYYY')
                            });
                        })
                })
        });
};
module.exports = tv;