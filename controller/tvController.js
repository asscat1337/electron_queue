const express = require('express')();
const socket = require('socket.io');
const mysql = require('mysql2');
const config = require('../core/config.js');
const connection = mysql.createConnection(config).promise();
const io1 = require('../server');
 exports.tv = async(req,res)=> {
         await connection.query(`SELECT * FROM tvinfo__${req.query.id} WHERE  terminalName='${req.query.id}' and isChecked=1 ORDER BY tvinfo_id DESC LIMIT 6`)
        .then(data => {
            connection.query(`SELECT description__text from description__term WHERE terminalName='${req.query.id}'`)
                        .then(data1=>{
                            connection.query(`SELECT link from videos`)
                                .then(data2=>{
                                    res.render('tv', {
                                        template: data[0],
                                        template1: data1[0],
                                        videos:data2[0],
                                        isRegistry:req.query.id === 'reg'
                                    });
                                })
                        })
                });
     let room;
    io1.isObject1.once('connection',(socket) => {
        socket.on('room',data=>{
            room = data;
            socket.join(data)
            console.log(room);
            // нужно более элеганто разобраться с сокетом,т.к данный фрагмент кода асинхроннен и использование setInterval в данном контексте глуп
            setInterval(()=>{
                 connection.query(`SELECT * FROM tvinfo__${req.query.id} WHERE  terminalName='${req.query.id}' and isChecked=0 ORDER BY tvinfo_id ASC LIMIT 1`)
                    .then(result=>{
                        io1.isObject1.to(room).emit('message',result[0])
                    })
                socket.on('update info', data => {
                    console.log(data)
                    connection.query(`UPDATE tvinfo__${req.query.id} set isChecked=1 WHERE tvinfo_id='${data}'`)
                })
                connection.query(`SELECT id,time,number,service,calledAgain,cabinet FROM stateticket WHERE  calledAgain=1 and terminalName='${req.query.id}' ORDER BY id ASC LIMIT 1`)
                    .then(result => {
                        if (result[0].map(item => item.calledAgain).join('') === '1') {
                            socket.emit('repeat data', result[0]);
                            connection.query(`UPDATE stateticket SET calledAgain=0 WHERE id=${result[0].map(item => item.id).join('')}`);
                        }else{
                            socket.emit('repeat data');
                        }


                    })
            },10000)
            //
        });
    })
};