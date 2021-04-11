const config = require('../core/config.js');
const mysql = require('mysql2');
const connection = mysql.createConnection(config).promise();
module.exports.dashboard = (request,response)=>{
         connection.query(`SELECT * from role`)
        .then(res=>{
           connection.query('SELECT * from terminal')
              .then(res1=>{
                  connection.query(`SELECT * from service`)
                      .then(stats=>{
                          let total = 0;
                          stats[0].map(item=>{
                             return total +=item.pointer;
                         })
                          response.render('dashboard',{
                              data:res[0],
                              data1:res1[0],
                              stats:stats[0],
                              total
                          });
                      })
               })
        })
};