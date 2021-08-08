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
 // port1 = process.env.port || 3003,
 // port2 = process.env.port || 3005,
 session = require('express-session'),
 sessionStorage = require('express-mysql-session'),
 cookieParser = require('cookie-parser');
 config = require('./core/config.js');
 moment = require('moment')();
 multer = require('multer');
 sharedSession = require('express-socket.io-session')


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
const trackingRouter = require('./routes/trackingRouter')
const sequelize = require('./core/config1');
const showService = require('./models/showService');
const addNewRole = require('./models/addNewRole');
const addNewTerminal = require('./models/addNewTerminal');
const updateService = require('./models/updateService');
const addNewService = require('./models/addNewService');
const callTicketAgain = require('./models/callTicketAgain');
const updateTvInfo = require('./models/updateTvInfo');
const showUsers = require('./models/showUsers');
const showTicket = require('./models/showTicket');
const deletePrivilege = require('./models/deletePrivilege');
const updateDateTime = require('./models/updateDateTime');
const showFreeUsers = require('./models/showFreeUsers');
const updateUserTerminal = require('./models/updateUserTerminal');
const uploadFile = require('./models/uploadFiles');
const deleteUser = require('./models/deleteUser');
const updatePointerTime = require('./models/updatePointerTime');
const showTerminalUsers = require('./models/showTerminalUsers')
const watchConroller = require('./controller/watchController')

// const http1 = require('http').createServer(app);
// const io1 = socket(http1,{
//     cors:{
//         origin: "*",
//         credentials:true,
// }});
// http1.listen(port1);

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

app.post('/showService',showService.showService);
app.post('/addNewRole',addNewRole.addNewRole);
app.post('/addNewTerminal',addNewTerminal.addNewTerminal);
app.post('/updateService',updateService.updateService);
app.post('/addNewService',addNewService.addNewService);
app.post('/callTicketAgain',callTicketAgain.callTicketAgain);
app.post('/updateTvInfo',updateTvInfo.updateTvInfo);
app.post('/showUsers',showUsers.showUsers);
app.post('/showTicket',showTicket.showTicket);
app.post('/updateDateTime',updateDateTime.updateDateTime);
app.post('/showFreeUsers',showFreeUsers.showFreeUsers);
app.post('/updateUserTerminal',updateUserTerminal.updateUserTerminal);
app.post('/showTerminalUsers',showTerminalUsers.showTerminalUsers);

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

app.post('/updatePointerTime',updatePointerTime.updatePointerTime)
app.delete('/deleteUserService',deletePrivilege.deletePrivilege);
app.delete('/deleteUser',deleteUser.deleteUser);
app.use('/ts',terminalRouter);
app.use('/op',user,opRouter);
app.use('/tv',tvRouter);
app.use('/dashboard',dashboardRouter);
app.use('/login',loginRouter);
app.use('/videos',videoRouter);
app.use('/tracking',trackingRouter)
app.use('/watch',watchConroller)

const job = new cron('0 22 * * 0-6',async()=>{
    await connection.query(`UPDATE service SET pointer = 1`)
},null,true,'Asia/Yekaterinburg')
job.start()

const connections = new Set()

let room,responses;
    // io1.on('connection',async(socket)=>{
    //     connections.add(socket)
    //     socket.on('room',async(data)=>{
    //         room = data;
    //         socket.join(data)
    //         socket.on('clicked',async(data)=>{
    //             const {number,cab,terminal,space} = data
    //             const findTicket = await sequelize.query(`SELECT * from tvinfo__${terminal} WHERE number= :number AND isCall = 0`,{
    //                 replacements:{number},
    //                 type:QueryTypes.SELECT
    //             })
    //             const user = await User.findOne({where:{terminalName:terminal,cab}})
    //             const result = Object.assign({isCab:user.isCab},findTicket[0])
    //             await socket.broadcast.to(space).emit('message',[result])
    //         })
    //         await socket.on('repeat data',async(data)=>{
    //             console.log(data)
    //             // const {ticket,terminalName} = data;
    //             // console.log(ticket.split(''))
    //             // connection.query(`UPDATE tvinfo__${terminalName} SET isCalledAgain=1 WHERE number='${ticket}'`)
    //             //     .then(()=>{
    //             //     connection.query(`SELECT * from tvinfo__${terminalName} WHERE number = '${ticket}'`)
    //             //         .then(result=>{
    //             //             arr1 =  updateData.concat(result[0]);
    //             //             socket.to(terminalName).emit('repeat ticket',arr1);
    //             //             connection.query(`UPDATE tvinfo__${terminalName} SET isCalledAgain = 0 WHERE tvinfo_id='${result[0].map(item=>item.tvinfo_id)}'`)
    //             //         })
    //             // })
    //         })
    //         await socket.on('show tv',async(data)=>{
    //             const {setTerminalName,id} = data[0]
    //             await socket.broadcast.to(`${setTerminalName}${id}`).emit('show result',data)
    //         })
    //         await socket.on('transfer tv',async(data)=>{
    //             const rolesFind = await Roles.findOne({where:{cab:data[0].cab,terminalName:data[0].setTerminalName},raw:true})
    //             console.log(rolesFind)
    //             await socket.broadcast.to(`${rolesFind.terminalName}${rolesFind.services_id}`).emit('show result',data)
    //         })
    //     })
    //     socket.on('end',(data)=>{
    //       socket.disconnect(true)
    //       console.log(`socket ${socket.id} disconnected`)
    //       connections.delete(socket)
    //     })
    // });
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
                const findUser = await User.findOne({
                    where: {
                        terminalName: item.setTerminalName, cab: item.cabinet
                    }
                })
                const findStateUser = await sequelize.query(`SELECT * from roles WHERE users_id = :user_id AND cab = :cab`, {
                    replacements: {user_id: findUser.role_id, cab: findUser.cab},
                    type: QueryTypes.SELECT
                })
                    ///
                if(item.cabinet === findStateUser[0].cab){
                    socket.broadcast.to(`${findStateUser[0].terminalName}${findStateUser[0].services_id}`).emit('await queue', {
                        number: `${item.Letter}${item.pointer}`,
                        service: item.ServiceName,
                        cabinet: item.cabinet,
                        terminal: item.setTerminalName
                    })
                }
                ///
            })
        })
        socket.on('add data', async (data) => {
            const {number, terminal,space} = data;
            await sequelize.query(`UPDATE tvinfo__${terminal} set isCall = 1 WHERE number = :number`, {
                replacements: {number},
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
            const {dataValues:userData} = findUser[0]
            const {dataValues:rolesData} = userData.roles[0]
                const result = await sequelize.query(`SELECT * from tvinfo__${userData.terminalName} WHERE isCall = :isCall and cabinet = :cabinet  AND date = date_format(now(),"%Y-%m-%d")`, {
                    replacements: {cabinet: rolesData.cab, isCall: 0, services_id: rolesData.services_id},
                    type: QueryTypes.SELECT
                })
                socket.emit('show data', result)
        })
        /// переделать
        socket.on('transfer ticket', async (data) => {
            const {cabinet, number, terminal, service,patient} = data;
            const findStateUser = await Roles.findOne({where:{cab:cabinet},raw:true})
            await sequelize.query(`UPDATE tvinfo__${terminal} SET cabinet = :cabinet,isCall = :isCall,services_id = :services_id WHERE number = :number ORDER BY tvinfo_id DESC LIMIT 1`, {
                replacements: {isCall: 0,cabinet,number,services_id:findStateUser.services_id},
                type:QueryTypes.UPDATE
             })
            const received = `${findStateUser.terminalName}${findStateUser.services_id}`
            console.log(findStateUser);
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
            await sequelize.query(`SELECT * from tvinfo__${userdata.terminalName} WHERE isCall = :isCall AND cabinet = :cab AND services_id = :services_id ORDER BY tvinfo_id ASC LIMIT 1`, {
                replacements: {cab: userdata.cab, services_id: rolesData.services_id,isCall:0},
                type: QueryTypes.SELECT
            }).then(data =>{
                    io.sockets.to(received).emit('show test',data[0])
            })
        })
        socket.on('call patient',async(data)=>{
            const {terminal,cab,received} = data
            const result = await sequelize.query('SELECT * from patient__ackt WHERE terminal = :terminal AND isCall = :isCall',{
                replacements:{terminal,isCall:0},
                type:QueryTypes.SELECT
            })
            io.sockets.to(received).emit('show test',result[0])
        })
        socket.on('update pointer',async(data)=>{
            const {terminal,service,pointer} = data
            await Service.update({pointer:pointer+1},{
                where:{
                    setTerminalName:terminal,
                    ServiceName:service
                }
            })
        })
        socket.on('clicked',async(data)=>{
            const {number,cab,terminal,space} = data
            const findTicket = await sequelize.query(`SELECT * from tvinfo__${terminal} WHERE number= :number AND isCall = 0`,{
                replacements:{number},
                type:QueryTypes.SELECT
            })
            const user = await User.findOne({where:{terminalName:terminal,cab}})
            const result = Object.assign({isCab:user.isCab},findTicket[0])
            await socket.broadcast.to(space).emit('message',[result])
        })
         socket.on('repeat data',async(data)=>{
             const {terminal} = data
             const {userdata} = socket.handshake.session;
             const repeatData = Object.assign(userdata,data)
             console.log(terminal)
            // const {ticket,terminalName} = data;
            // console.log(ticket.split(''))
            // connection.query(`UPDATE tvinfo__${terminalName} SET isCalledAgain=1 WHERE number='${ticket}'`)
            //     .then(()=>{
            //     connection.query(`SELECT * from tvinfo__${terminalName} WHERE number = '${ticket}'`)
            //         .then(result=>{
            //             arr1 =  updateData.concat(result[0]);
            //             socket.to(terminalName).emit('repeat ticket',arr1);
            //             connection.query(`UPDATE tvinfo__${terminalName} SET isCalledAgain = 0 WHERE tvinfo_id='${result[0].map(item=>item.tvinfo_id)}'`)
            //         })
            // })
        })
        socket.on('show tv',async(data)=>{
            const {setTerminalName,id} = data[0]
            await socket.broadcast.to(`${setTerminalName}${id}`).emit('show result',data)
        })
        socket.on('check ticket',(data)=>{
            const {terminal}=data
            socket.broadcast.to(terminal).emit('completed',data)
        })
         socket.on('transfer tv',async(data)=>{
            const rolesFind = await Roles.findOne({where:{cab:data[0].cab,terminalName:data[0].setTerminalName},raw:true})
            console.log(rolesFind)
            await socket.broadcast.to(`${rolesFind.terminalName}${rolesFind.services_id}`).emit('show result',data)
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
