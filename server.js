require('dotenv').config()
const express = require('express'),
 app = express(),
 socket =  require('socket.io'),
 http = require('http').createServer(app),
 mysql = require('mysql2'),
 bodyParser = require('body-parser'),
 io = socket(http,{
     cors:{
         origin:'http://localhost:5000',
         methods:['GET','POST'],
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
const moment =  require('moment');
// const  amqp = require('amqplib/callback_api')
 const {Sequelize,QueryTypes,Op} = require('sequelize')
const User = require('./models/model__test/User')
const Ticket = require('./models/model__test/Ticket')
const Terminal = require('./models/model__test/Terminal')
const Service = require('./models/model__test/Service')
const Roles = require('./models/model__test/Roles')

const user = require('./midlleware/user');
const terminalRouter = require('./routes/terminalRouter.js');
const tvRouter = require('./routes/tvRouter.js');
const opRouter = require('./routes/opRouter.js');
const dashboardRouter = require('./routes/dashboardRouter');
const loginRouter = require('./routes/loginRouter');
const videoRouter = require('./routes/videosRouter');
const sequelize = require('./core/config1');

events.EventEmitter.prototype._maxListeners = Infinity;

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
        const nextDate = moment.add('days',1)
        await Terminal.findAll().then(async (service)=>{
            service.map(async (terminal)=>{
                const {nameTerminal} = terminal
                await sequelize.query(`CREATE TABLE tvinfo__${nameTerminal}${moment(nextDate._d).format('DMMYYYY')} (tvinfo_id INT NOT NULL AUTO_INCREMENT,time VARCHAR(45) NULL,
        date VARCHAR(45) NULL,service VARCHAR(45) NULL,number VARCHAR(45) NULL,terminalName VARCHAR(45) NULL,Privilege VARCHAR(45) NULL,
        cabinet VARCHAR(45) NULL,isCalledAgain TINYINT(4) NULL,isCall TINYINT(4) NULL,services_id VARCHAR(45),type INTEGER(11) NULL,PRIMARY KEY (tvinfo_id))`)
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
            const {number,tvinfo_id,user} = data;
            await sequelize.query(`UPDATE tvinfo__${user.service} set isComplete = 1 WHERE number = :number AND tvinfo_id = :tvinfo_id`, {
                replacements: {number,tvinfo_id},
                type: QueryTypes.UPDATE
            })
        })
        socket.on('connect data', async (data) => {
            /// подумать как сделать правильно
            const {userdata} = socket.handshake.session
            const {role_id,setPrivilege,terminalName} = userdata
                const result = await sequelize.query(`SELECT * from tvinfo__${terminalName} INNER JOIN roles 
                WHERE  tvinfo__${terminalName}.services_id = roles.services_id AND users_id = :users_id AND isComplete = :isComplete AND isCall = :isCall `, {
                            replacements: {isComplete: 0,isCall:0,users_id: role_id},
                            type: QueryTypes.SELECT
                        })
                socket.emit('show data',result)
        })
        /// переделать
        socket.on('transfer ticket', async (data) => {
            const {cabinet, number, user} = data;
            const findStateUser = await Roles.findOne({where:{cab:cabinet},raw:true})
            await sequelize.query(`UPDATE tvinfo__${user.service} SET cabinet = :cabinet,isCall = :isCall,services_id = :services_id WHERE number = :number ORDER BY tvinfo_id DESC LIMIT 1`, {
                replacements: {isCall: 0,cabinet,number,services_id:findStateUser.services_id},
                type:QueryTypes.UPDATE
             })
            const received = `${findStateUser.terminalName}`
                socket.to(received).broadcast.emit('await queue', {
                    number,
                    cabinet,
                    "service":user.service
                })
        });
        ///
        socket.on('test', data => {
            const {number} = data
            socket.broadcast.emit('updates queue', number)
        })
        socket.on('test data', async (data) => {
            const {received} = data
            const {userdata} = socket.handshake.session
            await sequelize.query(`SELECT * from tvinfo__${userdata.terminalName} INNER JOIN roles
                WHERE tvinfo__${userdata.terminalName}.services_id = roles.services_id AND isCall = :isCall 
                AND isComplete = :isComplete AND users_id = :users_id ORDER BY tvinfo_id ASC LIMIT 1`, {
                replacements: {isComplete:0,isCall:0,users_id:userdata.role_id},
                type: QueryTypes.SELECT
            })
                .then(async(data)=>{
                    io.sockets.to(received).emit('show test',data[0])
             })
        })
        socket.on('clicked',async(data)=>{
            const {userdata} = socket.handshake.session
            console.log(userdata)
            const {number,tvinfo_id,user,date} = data
            console.log(data)
            const findTicket = await sequelize.query(`SELECT * from tvinfo__${userdata.terminalName} WHERE number = :number  AND isComplete = :isComplete AND tvinfo_id = :tvinfo_id`,{
                replacements:{number,isComplete:0,tvinfo_id},
                type:QueryTypes.SELECT
            })

            await sequelize.query(`UPDATE tvinfo__${userdata.terminalName} SET isCall = :isCall,cabinet = :cabinet WHERE number = :number and tvinfo_id = :tvinfo_id`,{
                replacements:{isCall:1,number,tvinfo_id,cabinet:userdata.cab},
                type:QueryTypes.UPDATE
            })
            const {number:ticket,service} = findTicket[0]
            const findUser = await User.findByPk(userdata.role_id)
            const {cab:cabinet,isCab} = findUser
            const result = Object.assign({cabinet,isCab},{ticket})
            soundData(ticket,cabinet,isCab)
                .then((files)=>{
                 setTimeout(()=>{
                     socket.to(userdata.terminalName).emit('message',[{'data':result},{...files}])
                 },Date.now() - date + 15000)
                })
                .catch(err=>console.log(err))
        })
        function toType(file){
            return `${file}.wav`
        }
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
                                const filesData=JSON.parse(data);
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
                                    resolve(sound)
                            })
                    }
                })
            })
        }
         socket.on('repeat data',async(data)=>{
             const {userdata} = socket.handshake.session
             const {terminal,tvinfo_id,ticket,date} = data
             const findUser = await User.findByPk(userdata.role_id)
            soundData(ticket,findUser.cab,findUser.isCab)
                 .then((files)=> {
                         setTimeout(()=>{
                             socket.to(terminal).emit('repeat ticket',files)
                         },Date.now() - date + 10000)
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
             const {userdata} = socket.handshake.session
             const {cab} = data
            const rolesFind = await Roles.findOne({where:{cab:cab,terminalName:userdata.terminalName},raw:true})
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
