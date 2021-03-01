const  io = require('../server');
const mysql = require('mysql2');
const config = require('../core/config.js');
const connection =mysql.createConnection(config).promise();
const interval = 5000;
module.exports.op = (req,res)=>{
    if(!req.session.username) res.redirect('/login');
    else{
        connection.query(`SELECT * from role INNER JOIN service ON role.setPrivilege = service.setService WHERE setPrivilege='${req.session.username}' and cabinet=${req.session.cabinet}`)
            .then(result=>{
                res.render('op');
            })
        io.ioObject.once('connection', socket => {
            setInterval(()=>{
                connection.query(`SELECT * FROM role WHERE  setPrivilege='${req.session.username}'`)
                    .then(res=>{
                            const Privilege = res[0].map(item=>item.terminalName).join()
                            connection.query(`SELECT * from stateticket WHERE terminalName LIKE '%${res[0].map(item=>item.terminalName).join()}%'`)
                                .then(res=>{
                                    connection.query(`SELECT COUNT(id) FROM stateticket  where called = 0 and terminalName LIKE '%${Privilege}%'`)
                                        .then(res => {
                                            socket.emit('await queue', res[0].map(item => Object.values(item)).join())
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                    connection.query(`SELECT * from stateticket WHERE called=0 and terminalName LIKE '%${Privilege}%'`)
                                        .then(res=>{
                                            socket.emit('new data',res[0])
                                        })
                                })
                        }
                    );

            },interval);
        })
    }
}
