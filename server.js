require('dotenv').config()
const express = require('express'),
 app = express(),
 socket =  require('socket.io'),
 http = require('http').createServer(app),
 mysql = require('mysql2'),
 bodyParser = require('body-parser'),
 io = socket(http,{
     cors:{
         origin:'*',
         methods:['GET','POST'],
         withCredentials: true
     }
 });
 cors = require('cors'),
 events = require('events'),
 cron = require('cron').CronJob,
 port = process.env.port || 5000,
 session = require('express-session'),
 sessionStorage = require('express-mysql-session'),
 cookieParser = require('cookie-parser');
 config = require('./core/config.js');
 multer = require('multer');
 sharedSession = require('express-socket.io-session');

const fs = require('fs');
const moment =  require('moment')();
// const  amqp = require('amqplib/callback_api')
 const {Sequelize,QueryTypes,Op} = require('sequelize')
const User = require('./models/model__test/User')
const Ticket = require('./models/model__test/Ticket')
const Terminal = require('./models/model__test/Terminal')
const Service = require('./models/model__test/Service')
const Roles = require('./models/model__test/Roles')
//
// amqp.connect('amqp://localhost',(err,connection)=>{
//     if(err) throw err
//
//     connection.createChannel((err1,channel)=>{
//         if(err1) throw  err1
//         const queue = 'hello'
//         const msg = 'hello'
//         channel.assertQueue(queue,{
//             durable:false
//         })
//         channel.sendToQueue(queue,Buffer.from(msg))
//         console.log(`sent ${msg}`)
//
//     })
//     setTimeout(()=>{
//         connection.close()
//         process.exit(0)
//     },500)
// })

const user = require('./midlleware/user');
const terminalRouter = require('./routes/terminalRouter.js');
const tvRouter = require('./routes/tvRouter.js');
const opRouter = require('./routes/opRouter.js');
const dashboardRouter = require('./routes/dashboardRouter');
const loginRouter = require('./routes/loginRouter');
const videoRouter = require('./routes/videosRouter');
const sequelize = require('./core/config1');

events.EventEmitter.prototype._maxListeners = Infinity;



const connection = mysql.createConnection(config).promise();
app.use(cookieParser());
const sessionMiddleWare = session({
    secret:"keyboard cat",
    name:"cookie_name",
    store:new sessionStorage(config),
    resave:false,
    saveUninitialized: true,
})
app.use(sessionMiddleWare)
io.use(sharedSession(sessionMiddleWare,{
    autoSave:true
}))

app.set(__dirname,'ejs');
app.set('view engine','ejs');
app.use(express.static(__dirname+'/'));
app.use(cors());
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 1000000,
    extended: true
}));
const jSonParser = bodyParser.json();

app.use('/ts',terminalRouter);
app.use('/op',user,opRouter);
app.use('/tv',tvRouter);
app.use('/dashboard',dashboardRouter);
app.use('/login',loginRouter);
app.use('/videos',videoRouter);

const delay = (ms)=>new Promise(resolve => setTimeout(resolve,ms))
async function init(){
    try{
        await Terminal.findAll().then(async (service)=>{
            service.map(async (terminal)=>{
                const {nameTerminal} = terminal
                await sequelize.query(`CREATE TABLE tvinfo__${nameTerminal}${moment.format('DMMYYYY')} (tvinfo_id INT NOT NULL AUTO_INCREMENT,time VARCHAR(45) NULL,
        date VARCHAR(45) NULL,service VARCHAR(45) NULL,number VARCHAR(45) NULL,terminalName VARCHAR(45) NULL,Privilege VARCHAR(45) NULL,
        cabinet VARCHAR(45) NULL,isCalledAgain TINYINT(4) NULL,isCall TINYINT(4) NULL,services_id VARCHAR(45),PRIMARY KEY (tvinfo_id))`)
                await delay(5000)
            })
        })
    }catch (e) {
        console.log(e)
    }
}
// init()

const job = new cron('0 22 * * 0-6',async()=>{
    try{
        await sequelize.query(`UPDATE service SET pointer = 1`)
    }catch (e) {
        console.log(`Произошла ошибка ${e}`)
    }
},null,true,'Asia/Yekaterinburg')
job.start()

const connections = new Set()
io.on('connection', async(socket) => {
    connections.add(socket)
    socket.on('login',async(data)=>{
        const {user,terminal} = data
        const userData = await User.findOne({
            where:{
                terminalName:terminal,
                setPrivilege:user
            }
        })
        socket.handshake.session.userdata = userData
        socket.handshake.session.save()
    })
    socket.on('room', data1 => {
        socket.join(data1);
        socket.on('update queue', async (data) => {
            data.map(async (item) => {
                const findUser = await Roles.findAll({
                    where: {
                        services_id: item.services_id,
                        terminalName:item.terminalName
                    }
                })
                findUser.map(user=>{
                    socket.broadcast.to(`${user.terminalName}${user.users_id}`).emit('await queue',item)
                })
            })
        })
        socket.on('add data', async (data) => {
            const {number, terminal,space,tvinfo_id} = data;
            await sequelize.query(`UPDATE tvinfo__${terminal} set isComplete = 1 WHERE number = :number AND tvinfo_id = :tvinfo_id`, {
                replacements: {number,tvinfo_id},
                type: QueryTypes.UPDATE
            })
        })
        socket.on('connect data', async (data) => {
            const {userdata} = socket.handshake.session
            const findUser = await User.findAll({
                include:{
                    model:Roles,
                    as:'roles',
                    required:true,
                    where:{
                        users_id:userdata.role_id
                    }
                },
                raw:false
            })
            const {dataValues:userData} = findUser[0] //костыль
            const {dataValues:rolesData} = userData.roles[0] //костыль
                const result = await sequelize.query(`SELECT * from tvinfo__${userData.terminalName} WHERE isComplete = :isComplete AND isCall = :isCall AND services_id = :services_id AND date = date_format(now(),"%Y-%m-%d")`, {
                    replacements: {isComplete: 0,isCall:0,services_id: rolesData.services_id},
                    type: QueryTypes.SELECT
                })
                socket.emit('show data', result)
        })
        /// переделать
        socket.on('transfer ticket', async (data) => {
            const {cabinet, number, terminal, service} = data;
            const findStateUser = await Roles.findOne({where:{cab:cabinet},raw:true})
            await sequelize.query(`UPDATE tvinfo__${terminal} SET cabinet = :cabinet,isCall = :isCall,services_id = :services_id WHERE number = :number ORDER BY tvinfo_id DESC LIMIT 1`, {
                replacements: {isCall: 0,cabinet,number,services_id:findStateUser.services_id},
                type:QueryTypes.UPDATE
             })
            const received = `${findStateUser.terminalName}`
                socket.to(received).broadcast.emit('await queue', {
                    number,
                    cabinet,
                    service
                })
        });
        ///
        socket.on('test', data => {
            const {number} = data
            socket.broadcast.emit('updates queue', number)
        })
        socket.on('test data', async (data) => {
            const {userdata} = socket.handshake.session
            const {received} = data
            const rolesData = await Roles.findOne({
                where:{
                    users_id:userdata.role_id
                }
            })
            await sequelize.query(`SELECT * from tvinfo__${userdata.terminalName} WHERE isComplete = :isComplete AND isCall = :isCall AND services_id = :services_id ORDER BY tvinfo_id ASC LIMIT 1`, {
                replacements: {isComplete:0,isCall:0,services_id:rolesData.services_id},
                type: QueryTypes.SELECT
            })
                .then(async(data)=>{
                    io.sockets.to(received).emit('show test',data[0])
             })
        })
        socket.on('clicked',async(data)=>{
            const {number,cab,terminal,space,tvinfo_id} = data
            const findTicket = await sequelize.query(`SELECT * from tvinfo__${terminal} WHERE number = :number  AND isComplete = :isComplete AND tvinfo_id = :tvinfo_id`,{
                replacements:{number,isComplete:0,tvinfo_id},
                type:QueryTypes.SELECT
            })

            await sequelize.query(`UPDATE tvinfo__${terminal} SET isCall = :isCall WHERE number = :number and tvinfo_id = :tvinfo_id`,{
                replacements:{isCall:1,number,tvinfo_id},
                type:QueryTypes.UPDATE
            })
            const {number:ticket,service} = findTicket[0]
            const user = await User.findOne({where:{terminalName:terminal,cab}})
            const {cab:cabinet,isCab} = user
            const result = Object.assign({cabinet,isCab},{ticket})
            soundData(ticket,cabinet,isCab)
                .then((files)=>socket.to(terminal).emit('message',[{'data':result},{...files}]))
                .catch(err=>console.log(err))
        })
        function toType(file){
            return `${file}.wav`
        }
        let isQueue = true
        function soundData(ticket,cabinet,isCab) {
            return new Promise((resolve,reject)=>{
                fs.readdir('public/sound',(err,files)=>{
                    if(err){
                        reject(err)
                    }else{
                        const ticketToArr = ticket.split('');
                        const letter = ticketToArr.slice(0,1).join('');
                        const number = ticketToArr.slice(1,5).join('');
                        let  [numberCabinet,letterTicket,toStatus,cabinetClient] = []
                            let sound = []
                            let module
                            let raz
                            let arr = []
                            if(number.split('').length >2){
                                module = number%100;
                                raz = number - module
                            }
                            files.filter(item=>{
                                if(item===toType(number) || item===toType(module) || item === toType(raz)){
                                    arr.push(item)
                                    numberCabinet = arr;
                                }
                                if(item===toType(cabinet)){
                                    cabinetClient = item
                                }
                                isCab ? toStatus = 'public/sound/towindow.wav':toStatus = 'public/sound/tocabinet.wav';
                            })
                            fs.readFile('public/sound/russia_letters.json',(error,data)=>{
                                const filesData =JSON.parse(data);
                                Object.entries(filesData).find(([key,value])=>{
                                    if(key===letter){
                                        letterTicket = value
                                    }
                                })
                                    function toSound(arr){
                                        return arr.map(item=>`public/sound/${item}`)
                                    }
                                    sound = ['public/sound/client.wav',`${letterTicket}`,
                                    toSound(arr),toStatus,`public/sound/${cabinetClient}`]
                                    .reduce((acc,val)=>acc.concat(val),[])
                                setTimeout(()=>{
                                    resolve(sound)
                                },6000)
                            })
                    }
                })
            })
        }
         socket.on('repeat data',async(data)=>{
             console.log(isQueue)
             const {terminal,tvinfo_id,ticket} = data
             const {cab:cabinet,isCab} = socket.handshake.session.userdata;
             const repeatData = Object.assign({cabinet,isCab},data)
            soundData(ticket,cabinet,isCab)
                 .then((files)=> {
                     socket.to(terminal).emit('repeat ticket',files)
                 })
                 .catch(err=>console.log(err))


        })
        socket.on('show tv',async(data)=>{
            const {terminalName} = data[0]
            await socket.broadcast.to(`${terminalName}`).emit('show result',data)
        })
        socket.on('complete data',(data)=>{
            const {terminal}=data
            socket.broadcast.to(terminal).emit('completed',data)
        })
         socket.on('transfer tv',async(data)=>{
            const rolesFind = await Roles.findOne({where:{cab:data[0].cab,terminalName:data[0].setTerminalName},raw:true})
            await socket.broadcast.to(`${rolesFind.terminalName}`).emit('show result',data)
        })
        socket.on('end', data => {
            console.log(`socket ${socket.id} disconnected`)
            connections.delete(socket)
            socket.disconnect(true)
        })
    })
})
    http.listen(port, () => {
        console.log(`Listen in $${port}`);
    });
