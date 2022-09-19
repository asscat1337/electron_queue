const RolesSelectAll = require("./models/model__test/Roles/select");
const ticketAction = require("./databases/ticket-service");
const TicketUpdate = require('./models/model__test/Tickets/update')
const TicketSelect = require('./models/model__test/Tickets/select')
const soundData = require('./sound/sound')
const cron = require('cron')
const {getSoundQueue,setSoundQueue} = require('./utils/soundQueue')

const connections = new Set()

const mapConnect = new Map()

const socketConnection=(io)=>{
    io.on('connection',(socket)=>{
        connections.add(socket)
        socket.on('room', async (data1) => {
            socket.join(data1);
            mapConnect.set(data1,new Map([['queue',[]],['isPlaying',false]]))
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
                const {tvinfo_id} = data;
                const {userdata} = socket.handshake.session

                await TicketUpdate.updateIsComplete(userdata.terminal,tvinfo_id)
            })

            const cronJob = new cron.job('5 15 * * 0-6',()=>{
                socket.emit('clear')
            },null,null,'Asia/Yekaterinburg')

            cronJob.start()

            socket.on('connect data', async () => {
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
                const {receive, number,notice} = data;
                const {userdata} = socket.handshake.session
                ///update
                await TicketUpdate.updateTransferTicket(userdata.terminal,receive.user_id,userdata.isNotice,number,notice)
                const received = `${userdata.terminal}${receive.user_id}`
                console.log(data)
                if(userdata.isNotice){
                    socket.broadcast.emit('show notice',[data])
                }
                if(userdata.sendNotice){
                    socket.broadcast.to(received).emit('await notice',[data])
                }
                if(!userdata.isNotice && !userdata.sendNotice){
                    socket.broadcast.to(received).emit('await queue',data)
                }
            });
            ///
            socket.on('test',(data)=> {
                const {number} = data
                socket.broadcast.emit('updates queue', number)
            })
            ////
            socket.on('test data', async () => {
                const {userdata} = socket.handshake.session
                const ticketData = await ticketAction.selectTicket({users_id:userdata.user_id,terminalName:userdata.terminal,cabinet:userdata.cab})
                console.log(ticketData)

                socket.emit('show test',ticketData[0])
            })
            socket.on('get current',async(data)=>{
                const {id} = data
                const {userdata} = socket.handshake.session
                const currentTicket = await ticketAction.getCurrentTicket({
                    users_id:userdata.user_id,
                    terminalName:userdata.terminal,
                    user_id:userdata.user_id,
                    tvinfo_id:id
                })
                socket.emit('show test',currentTicket[0])

            })

            socket.on('show active',(data)=>{
                socket.emit('prepare active',data)
            })
            socket.on('clicked',async(data)=>{
                const {userdata} = socket.handshake.session
                const {number,tvinfo_id} = data

                const findTicket = await TicketSelect.selectIsNotComplete(userdata.terminal,tvinfo_id)
                await TicketUpdate.updateIsCall(userdata.terminal,number,tvinfo_id,userdata.user_id)
                const {number:ticket,tvinfo_id:id} = findTicket[0]
                const result = Object.assign({cabinet:userdata.cab,isCab:userdata.isReg},{ticket,id})


                soundData(ticket,userdata.cab,userdata.isReg)
                    .then((files)=>{
                        const objects = {
                            data:result,
                            sound:files,
                            ticket,
                            rooms:userdata.terminal
                        }
                        const soundData = getSoundQueue(mapConnect,userdata.terminal,'queue')
                        const isPlaying = getSoundQueue(mapConnect,userdata.terminal,'isPlaying')
                        soundData.push(objects)
                        if(!isPlaying){
                            setSoundQueue(mapConnect,userdata.terminal,{key:'isPlaying',value:true})
                            const sound = soundData[0]

                            socket.broadcast.to(userdata.terminal).emit('pong',sound)
                        }
                    })
                    .catch(err=>console.log(err))
            })

            let idx = 0
            socket.on('delete sound',(data,cb)=>{
                const queueData = getSoundQueue(mapConnect,data.rooms,'queue')
                const isPlaying = getSoundQueue(mapConnect,data.rooms,'isPlaying')
                if(isPlaying){
                    idx++
                    const sound = queueData[idx]
                    cb(sound)
                }
                if(queueData.length === idx){
                    idx = 0
                    setSoundQueue(mapConnect,data.rooms,{key:'queue',value:[]})
                    setSoundQueue(mapConnect,data.rooms,{key:'isPlaying',value:false})
                }
                console.log(queueData.length,idx)
            })

            socket.on('repeat data',async(data)=>{
                const {userdata} = socket.handshake.session
                const {terminal,ticket} = data
                const sound = getSoundQueue(mapConnect,userdata.terminal,'queue')
                soundData(ticket,userdata.cab,userdata.isReg)
                    .then(async(files)=> {
                        const objects = {
                            sound:files,
                            rooms:terminal,
                            ticket
                        }
                        setSoundQueue(mapConnect,userdata.terminal,{key:'isPlaying',value:true})
                        await sound.unshift(objects)
                        socket.broadcast.to(userdata.terminal).emit('repeat ticket',sound[0])
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
    })
}

module.exports = socketConnection