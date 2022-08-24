const RolesSelectAll = require("./models/model__test/Roles/select");
const ticketAction = require("./databases/ticket-service");
const TicketUpdate = require('./models/model__test/Tickets/update')
const TicketSelect = require('./models/model__test/Tickets/select')
const soundData = require('./sound/sound')
const moment = require('moment')()
const cron = require('cron')

const connections = new Set()

const mapConnect = new Map()


async function socket(socket){
    connections.add(socket)
    socket.on('room', async (data1) => {
        socket.join(data1);
        mapConnect.set(data1,new Map([['queue',[]]]))
        socket.on('update queue', async (data) => {
            data.map(async (item) => {
                const findUserAll = await RolesSelectAll.selectAll(item.terminalName)
                findUserAll.map(user=>{
                    if(+item.services_id === user.service_id){
                        socket.broadcast.to(`${item.terminalName}${user.user_id}`).emit('await queue',item)
                    }
                })
            })
        })
        socket.on('add data', async (data) => {
            const {number,user,tvinfo_id} = data;
            const {userdata} = socket.handshake.session

            await TicketUpdate.updateIsComplete(userdata.terminal,tvinfo_id)
        })

        const cronJob = new cron.job('5 15 * * 0-6',()=>{
            socket.emit('clear')
        },null,null,'Asia/Yekaterinburg')

        cronJob.start()

        socket.on('connect data', async (data) => {
            /// подумать как сделать правильно
            const {userdata} = socket.handshake.session
            const {user_id} = userdata
            /// говнокод
            if(userdata.sendNotice){
                await TicketSelect.selectTicket(userdata.terminal,user_id)
                    .then(data=>socket.emit('show notice',data))
            }
            if(userdata.isNotice){
                await TicketSelect.selectIsNotice(userdata.terminal,user_id)
                    .then(data=>socket.emit('await notice',data))
            }
            if(!userdata.sendNotice){
                await TicketSelect.selectTicket(userdata.terminal,user_id)
                    .then(data=>socket.emit('show data',data))
            }
            ///
        })
        /// переделать
        socket.on('transfer ticket', async (data) => {
            const {receive, number,service,notice,tvinfo_id} = data;
            const {userdata} = socket.handshake.session
            const selectRole = await RolesSelectAll.selectCurrent(userdata.terminal,receive.user_id)

            ///update

            await TicketUpdate.updateTransferTicket(userdata,terminal,receive.cab,userdata.isNotice,notice,selectRole[0].service_id)
            const received = `${userdata.terminal}${receive.user_id}`
            if(userdata.isNotice){
                socket.broadcast.emit('show notice',[data])
            }
            if(userdata.sendNotice){
                socket.to(received).broadcast.emit('await notice',[data])
            }
            if(!userdata.isNotice && !userdata.sendNotice){
                socket.to(received).broadcast.emit('await queue', {
                    number,
                    cabinet:receive.cab,
                    "service":service,
                    tvinfo_id
                })
            }
        });
        ///
        socket.on('test',(data)=> {
            const {number} = data
            socket.broadcast.emit('updates queue', number)
        })
        ////
        socket.on('test data', async (data,cb) => {
            const {received} = data
            const {userdata} = socket.handshake.session
            const ticketData = await ticketAction.selectTicket({users_id:userdata.user_id,terminalName:userdata.terminal,cabinet:userdata.cab})

            socket.emit('show test',ticketData[0])
        })

        socket.on('show active',(data)=>{
            socket.emit('prepare active',data)
        })
        socket.on('ping',async(rooms,cb)=>{
            if(typeof cb === 'function'){
                const data = mapConnect.get(rooms).get('queue')[0]
                cb(data)

            }
        })

        socket.on('delete sound',async(data)=>{
            await mapConnect.get(data.rooms).get('queue').shift()
        })

        socket.on('clicked',async(data)=>{

            const {userdata} = socket.handshake.session
            const {number,tvinfo_id,date,received} = data

            const findTicket = await TicketSelect.selectIsNotComplete(userdata.terminal,tvinfo_id)
            await TicketUpdate.updateIsCall(userdata.terminal,number,tvinfo_id,userdata.cab)
            const {number:ticket,tvinfo_id:id} = findTicket[0]
            const result = Object.assign({cabinet:userdata.cab,isCab:userdata.isReg},{ticket,id})


            soundData(ticket,userdata.cab,userdata.isReg)
                .then(async(files)=>{
                    const objects = {
                        data:result,
                        sound:files,
                        ticket,
                        rooms:userdata.terminal
                    }
                    mapConnect.get(userdata.terminal).get('queue').push(objects)

                })
                .catch(err=>console.log(err))
        })
        socket.on('repeat data',async(data)=>{
            const {userdata} = socket.handshake.session
            const {terminal,ticket,date} = data
            soundData(ticket,userdata.cab,userdata.isReg)
                .then(async(files)=> {
                    const objects = {
                        sound:files,
                        rooms:terminal,
                        ticket
                    }
                    await mapConnect.get(userdata.terminal).get('queue').unshift(objects)
                })
                .catch(err=>console.log(err))


        })
        socket.on('show tv',(data)=>{
            const {terminalName} = data[0]
            socket.broadcast.to(`${terminalName}`).emit('show result', data)
        })
        socket.on('complete data',(data)=>{
            const {userdata} = socket.handshake.session
            socket.broadcast.to(userdata.terminal).emit('completed',data)
        })
        socket.on('transfer tv',async(data)=>{
            const {userdata} = socket.handshake.session
            setTimeout(()=>{
                socket.broadcast.to(`${userdata.terminal}`).emit('show result',data)
            },5000)
        })
        socket.on('show active',(data)=>{
            const {userdata} = socket.handshake.session
            socket.broadcast.to(userdata.terminal).emit('prepare active',data)
        })
        socket.on('end', data => {
            console.log(`socket ${socket.id} disconnected`)
            connections.delete(socket)
            socket.disconnect(true)
        })
    })
}

module.exports = socket