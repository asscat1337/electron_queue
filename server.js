require('dotenv').config()
const express = require('express'),
 app = express(),
 socket =  require('socket.io'),
 http = require('http').createServer(app),
 bodyParser = require('body-parser'),
 io = socket(http,{
     cors:{
         origin:'http://localhost',
         methods:['GET','POST'],
        allowHeaders:['my-custom-header'],
        credentials:true
     }
 });
 cors = require('cors'),
 events = require('events'),
 cron = require('cron').CronJob,
 port = process.env.port || 8000,
 session = require('express-session'),
 sessionStorage = require('express-mysql-session'),
 cookieParser = require('cookie-parser');
 config = require('./core/config.js');
 multer = require('multer');
 sharedSession = require('express-socket.io-session');

const fs = require('fs');
const moment =  require('moment');
const {QueryTypes} = require('sequelize')
const User = require('./models/model__test/User')
const Terminal = require('./models/model__test/Terminal')
const Roles = require('./models/model__test/Roles')
const client = require('./core/redis')



const user = require('./midlleware/user');
const terminalRouter = require('./routes/terminalRouter.js');
const tvRouter = require('./routes/tvRouter.js');
const opRouter = require('./routes/opRouter.js');
const dashboardRouter = require('./routes/dashboardRouter');
const loginRouter = require('./routes/loginRouter');
const videoRouter = require('./routes/videosRouter');
const sequelize = require('./core/config1');


app.use(cookieParser());
const sessionMiddleWare = session({
    secret:"keyboard cat",
    name:"cookie_name",
    resave:false,
    store:new sessionStorage(config),
    saveUninitialized: true,
    cookie:{
	maxAge:30*24*60*60*1000
}
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

app.use('/ts',terminalRouter);
app.use('/op',user,opRouter);
app.use('/tv',tvRouter);
app.use('/dashboard',dashboardRouter);
app.use('/login',loginRouter);
app.use('/videos',videoRouter);

const delay = (ms)=>new Promise(resolve => setTimeout(resolve,ms))
async function init(){
    try{
        const nextDate = moment().add('days',1).format('DMMYYYY')
        await Terminal.findAll().then(async (service)=>{
            service.map(async (terminal)=>{
                const {nameTerminal,isNotice,isActive} = terminal
                if(isActive){
                    await sequelize.query(`CREATE TABLE tvinfo__${nameTerminal}${nextDate} (tvinfo_id INT NOT NULL AUTO_INCREMENT,date VARCHAR(45) NULL,
        time VARCHAR(45) NULL,service VARCHAR(45) NULL,number VARCHAR(45) NULL,terminalName VARCHAR(45) NULL,
        cabinet VARCHAR(45) NULL,isCall TINYINT(4) NULL,services_id VARCHAR(45) NULL,isComplete INTEGER(11) NULL,type INTEGER(11) NULL,${isNotice || 'notice VARCHAR(45) NULL'},PRIMARY KEY (tvinfo_id)) CHARACTER SET utf8 COLLATE utf8_general_ci`)
                    await delay(5000)
                }
            })
        })
    }catch (e) {
        console.log(e)
    }
}

const job = new cron('49 12 * * 0-6',async()=>{
    try{
        await sequelize.query(`UPDATE service SET pointer = 1`,{type:QueryTypes.UPDATE})
	init()
    }catch (e) {
        console.log(`Произошла ошибка ${e}`)
    }
},null,true,'Asia/Yekaterinburg')
job.start()


const connections = new Set()
io.on('connection', async(socket) => {
    connections.add(socket)
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
            const {number,user,tvinfo_id} = data;
            console.log(data)
	    const {userdata} = socket.handshake.session
            await sequelize.query(`UPDATE tvinfo__${userdata.terminalName}${moment().format('DMMYYYY')} set isComplete = 1 WHERE tvinfo_id = :tvinfo_id`, {
                replacements: {tvinfo_id},
                type: QueryTypes.UPDATE
            })
        })
        socket.on('connect data', async (data) => {
            /// подумать как сделать правильно
            const {userdata} = socket.handshake.session
            const {role_id,terminalName} = userdata
                /// говнокод
                if(userdata.sendNotice){
                    await sequelize.query(`SELECT * from tvinfo__${terminalName}${moment().format('DMMYYYY')}  INNER JOIN roles 
                WHERE  tvinfo__${terminalName}${moment().format('DMMYYYY')}.services_id = roles.services_id AND users_id = :users_id AND isComplete = :isComplete AND isCall = :isCall`, {
                        replacements: {isComplete: 0,isCall:0,users_id: role_id},
                        type: QueryTypes.SELECT
                    }).then(data=>socket.emit('show notice',data))
                }
                if(userdata.isNotice){
                    await sequelize.query(`SELECT * from tvinfo__${terminalName}${moment().format('DMMYYYY')}  INNER JOIN roles 
                WHERE  tvinfo__${terminalName}${moment().format('DMMYYYY')}.services_id = roles.services_id AND users_id = :users_id AND isComplete = :isComplete AND isCall = :isCall AND notice !=''`, {
                        replacements: {isComplete: 0,isCall:0,users_id: role_id},
                        type: QueryTypes.SELECT
                    }).then(data=>socket.emit('await notice',data))
                }
               if(!userdata.sendNotice){
                    await sequelize.query(`SELECT * from tvinfo__${terminalName}${moment().format('DMMYYYY')}  INNER JOIN roles 
                WHERE  tvinfo__${terminalName}${moment().format('DMMYYYY')}.services_id = roles.services_id AND users_id = :users_id AND isComplete = :isComplete AND isCall = :isCall AND notice =''`, {
                        replacements: {isComplete: 0,isCall:0,users_id: role_id},
                        type: QueryTypes.SELECT
                    }).then(data=>socket.emit('show data',data))
                }
               ///
        })
        /// переделать
        socket.on('transfer ticket', async (data) => {
            console.log(data)
            const {cabinet, number,service,notice,tvinfo_id} = data;
	    const {userdata} = socket.handshake.session
            const findStateUser = await User.findOne({
                where:{
                    cab:cabinet,
                    terminalName:userdata.terminalName
                },
                include:[
                    {model:Roles,as:'roles',attributes:['services_id','users_id']}
                ],
                raw:true,
                nest:true
            })
             await sequelize.query(`UPDATE tvinfo__${userdata.terminalName}${moment().format('DMMYYYY')}  SET cabinet = :cabinet,notice = :notice,isCall = :isCall,services_id = :services_id WHERE number = :number ORDER BY tvinfo_id DESC LIMIT 1`, {
                replacements: {isCall: 0,cabinet:cabinet,notice,number:number,services_id:findStateUser.roles.services_id},
                type:QueryTypes.UPDATE
             })
            const received = `${findStateUser.terminalName}${findStateUser.role_id}`
            if(userdata.isNotice){
                socket.broadcast.emit('show notice',[data])
            }
            if(userdata.sendNotice){
               socket.to(received).broadcast.emit('await notice',[data])
            }
            if(!userdata.isNotice && !userdata.sendNotice){
                socket.to(received).broadcast.emit('await queue', {
                    number,
                    cabinet,
                    "service":service,
                    tvinfo_id
                })
            }
        });
        ///
        socket.on('test', data => {
            const {number} = data
            socket.broadcast.emit('updates queue', number)
        })
        socket.on('test data', async (data) => {
            const {received} = data
            const {userdata} = socket.handshake.session
            console.log(userdata)
            const getNoticeData = userdata.sendNotice  ? `notice !=''`:`notice = '' `
            await sequelize.query(`SELECT * from tvinfo__${userdata.terminalName}${moment().format('DMMYYYY')}  INNER JOIN roles
                WHERE tvinfo__${userdata.terminalName}${moment().format('DMMYYYY')}.services_id = roles.services_id AND isCall = :isCall 
                AND isComplete = :isComplete AND users_id = :users_id ORDER BY tvinfo_id ASC LIMIT 1`, {
                replacements: {isComplete:0,isCall:0,users_id:userdata.role_id},
                type: QueryTypes.SELECT
            })
                .then((data) => {
                    io.sockets.to(received).emit('show test',data[0])
             })
        })


        socket.on('ping',async(rooms,cb)=>{
            if(typeof cb === 'function'){
                const keys = await client.sendCommand(['keys','*'])
                const data = await client.get(keys[0])
                const toObject = JSON.parse(data)

                if(toObject?.rooms === rooms){
                    console.log(rooms)
                    socket.to(rooms).emit('message',123)
                    socket.to(rooms).emit('message', cb(data))
                }

            }
        })

        socket.on('delete sound',async(data)=>{
            await client.del(data)
        })

        socket.on('clicked',async(data)=>{

            const {userdata} = socket.handshake.session
            const {number,tvinfo_id,date,received} = data
            const findTicket = await sequelize.query(`SELECT * from tvinfo__${userdata.terminalName}${moment().format('DMMYYYY')} WHERE isComplete = :isComplete AND tvinfo_id = :tvinfo_id`,{
                replacements:{isComplete:0,tvinfo_id},
                type:QueryTypes.SELECT
            })

            await sequelize.query(`UPDATE tvinfo__${userdata.terminalName}${moment().format('DMMYYYY')} SET isCall = :isCall,cabinet = :cabinet WHERE tvinfo_id = :tvinfo_id`,{
                replacements:{isCall:1,number,tvinfo_id,cabinet:userdata.cab},
                type:QueryTypes.UPDATE
            })
            const {number:ticket,tvinfo_id:id} = findTicket[0]
            const findUser = await User.findByPk(userdata.role_id)
            const {cab:cabinet,isCab} = findUser
            const result = Object.assign({cabinet,isCab},{ticket,id})


            soundData(ticket,cabinet,isCab)
                .then(async(files)=>{
                    const objects = {
                        data:result,
                        sound:files,
                        ticket,
                        rooms:userdata.terminalName
                    }
                    await client.set(ticket,JSON.stringify(objects))
                                // socket.to(userdata.terminalName).emit('message',objects)
                                // io.sockets.to(received).emit('complete sound',{isDisabled:false})
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
                        let  [numberCabinet,letterTicket,toStatus] = []
                            let sound = []
                            let module
                            let raz
                            let arr = []
                            let arrCabinet = []

                            function toSound(arr){
                                return arr.map(item=>`public/sound/${item}`)
                            }
                            /// переделать в функцию
                            if(number.split('').length >2){
                                module = number%100;
                                raz = number - module
                            }
                            if(String(cabinet).split('').length >2){
                                const remainCab = cabinet%100
                                const intCab = cabinet - remainCab
                                arrCabinet.push(toType(intCab),toType(remainCab))
                            }else{
                                arrCabinet.push(toType(cabinet))
                            }
                            ///
                            files.filter(item=>{
                                if(item===toType(number) || item===toType(module) || item === toType(raz)){
                                    arr.push(item)
                                    numberCabinet = arr;
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
                                    sound = ['public/sound/client.wav',`${letterTicket}`,
                                    toSound(arr),toStatus,toSound(arrCabinet)]
                                    .reduce((acc,val)=>acc.concat(val),[])
                                    resolve(sound)
                            })
                    }
                })
            })
        }
         socket.on('repeat data',async(data)=>{
             const {userdata} = socket.handshake.session
             const {terminal,ticket,date} = data
             const findUser = await User.findByPk(userdata.role_id)
            soundData(ticket,findUser.cab,findUser.isCab)
                 .then(async(files)=> {
                     const objects = {
                         sound:files,
                         rooms:terminal,
                         ticket
                     }
                     await client.set(ticket,JSON.stringify(objects))
                         // setTimeout(()=>{
                         //     socket.to(terminal).emit('repeat ticket',files)
                         // },Date.now() - date)
                 })
                 .catch(err=>console.log(err))


        })
        socket.on('show tv',(data)=>{
            const {terminalName} = data[0]
            socket.broadcast.to(`${terminalName}`).emit('show result', data)
        })
        socket.on('complete data',(data)=>{
	    const {userdata} = socket.handshake.session
            socket.broadcast.to(userdata.terminalName).emit('completed',data)
        })
         socket.on('transfer tv',async(data)=>{
             const {userdata} = socket.handshake.session
	    setTimeout(()=>{
             socket.broadcast.to(`${userdata.terminalName}`).emit('show result',data)
},5000)
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
