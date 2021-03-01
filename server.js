const express = require('express'),
 app = express(),
 socket =  require('socket.io'),
 http = require('http').createServer(app),
 mysql = require('mysql2'),
 bodyParser = require('body-parser'),
 io = socket(http),
 cors = require('cors'),
 events = require('events'),
 port = process.env.port || 5000,
 port1 = process.env.port || 3003,
 session = require('express-session'),
 sessionStorage = require('express-mysql-session'),
 cookieParser = require('cookie-parser');
 config = require('./core/config.js');
 moment = require('moment')();
 multer = require('multer');

const terminalRouter = require('./routes/terminalRouter.js');
const tvRouter = require('./routes/tvRouter.js');
const opRouter = require('./routes/opRouter.js');
const dashboardRouter = require('./routes/dashboardRouter');
const loginRouter = require('./routes/loginRouter');
const videoRouter = require('./routes/videosRouter');

const getTicket = require('./models/getTicket');
const setStateTicket = require('./models/setStateticket');
const showService = require('./models/showService');
const addNewRole = require('./models/addNewRole');
const addNewTerminal = require('./models/addNewTerminal');
const updateService = require('./models/updateService');
const addNewService = require('./models/addNewService');
const callTicketAgain = require('./models/callTicketAgain');
const updatePointerNull = require('./models/updatePointerNull');
const updateTvInfo = require('./models/updateTvInfo');
const showUsers = require('./models/showUsers');
const showTicket = require('./models/showTicket');
const auth = require('./models/auth');
const deletePrivilege = require('./models/deletePrivilege');
const updateDateTime = require('./models/updateDateTime');
const showFreeUsers = require('./models/showFreeUsers');
const updateUserTerminal = require('./models/updateUserTerminal');
const updatePointer = require('./models/updatePointer');
const uploadFile = require('./models/uploadFiles');
const deleteUser = require('./models/deleteUser');

const http1 = require('http').createServer(app);
const io1 = socket(http1,{
    cors:{
        origin:"*"
    }
});
http1.listen(port1);
const socketObject = io;
const socketObject1 = io1;
module.exports.isObject1 = socketObject1;
module.exports.ioObject = socketObject;
events.EventEmitter.prototype._maxListeners = Infinity;



const connection = mysql.createConnection(config).promise();
app.use(cookieParser());

app.use(session({
    secret:"keyboard cat",
    name:"cookie_name",
    store:new sessionStorage(config),
    resave:false,
    saveUninitialized: true,
}))
app.set(__dirname,'ejs');
app.set('view engine','ejs');

app.use(express.static(__dirname+'/'));
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
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

app.post('/getTicket',getTicket.getTicket);
app.post('/setStateTicket',setStateTicket.setStateTicket);
app.post('/showService',showService.showService);
app.post('/addNewRole',addNewRole.addNewRole);
app.post('/addNewTerminal',addNewTerminal.addNewTerminal);
app.post('/updateService',updateService.updateService);
app.post('/addNewService',addNewService.addNewService);
app.post('/callTicketAgain',callTicketAgain.callTicketAgain);
app.post('/updatePointerNull',updatePointerNull.updatePointerNull);
app.post('/updateTvInfo',updateTvInfo.updateTvInfo);
app.post('/showUsers',showUsers.showUsers);
app.post('/showTicket',showTicket.showTicket);
app.post('/auth',auth.auth);
app.post('/updateDateTime',updateDateTime.updateDateTime);
app.post('/showFreeUsers',showFreeUsers.showFreeUsers);
app.post('/updateUserTerminal',updateUserTerminal.updateUserTerminal);
app.post('/updatePointer',updatePointer.updatePointer);
app.post('/uploads',uploadFile.array('files'),(req,res)=>{
    let filedata = req.files;
    for(let file of filedata){
        let path = (file.path).replace('\\','/');
        connection.query(`INSERT INTO videos(video_id,link) VALUES(NULL,'${path}')`)
            .then(result=>{
                res.json({"size":file.size})
            });
    }
});
app.delete('/deleteUserService',deletePrivilege.deletePrivilege);
app.delete('/deleteUser',deleteUser.deleteUser);


app.use('/ts',terminalRouter);
app.use('/op',opRouter);
app.use('/tv',tvRouter);
app.use('/dashboard',dashboardRouter);
app.use('/login',loginRouter);
app.use('/videos',videoRouter);

http.listen(port,()=>{
    console.log(`Listen in $${port}`);
});
