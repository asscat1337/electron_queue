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

const moment =  require('moment');
const {QueryTypes} = require('sequelize')
const Terminal = require('./models/model__test/Terminal')



const user = require('./midlleware/user');
const terminalRouter = require('./routes/terminalRouter.js');
const tvRouter = require('./routes/tvRouter.js');
const opRouter = require('./routes/opRouter.js');
const dashboardRouter = require('./routes/dashboardRouter');
const loginRouter = require('./routes/loginRouter');
const videoRouter = require('./routes/videosRouter');
const sequelize = require('./core/config1');
const adapter = require('./core/redis')
const socket1 = require('./socket')


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
	    await init()
    }catch (e) {
        console.log(`Произошла ошибка ${e}`)
    }
},null,true,'Asia/Yekaterinburg')
job.start()

// io.adapter(adapter.adapter)
io.on('connection',socket1)

    http.listen(port, () => {
        console.log(`Listen in $${port}`);
    });
