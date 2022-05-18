const RolesSelectAll = require("./models/model__test/Roles/select");
const sequelize = require("./core/config1");
const moment = require("moment");
const {QueryTypes} = require("sequelize");
const ticketAction = require("./databases/ticket-service");
const client = require("./core/redis");
const fs = require("fs").promises;

const connections = new Set()

async function socket(socket){
    connections.add(socket)
    socket.on('room', data1 => {
        console.log(data1,'test')
        socket.join(data1);
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
            await sequelize.query(`UPDATE tvinfo__${userdata.terminal}${moment().format('DMMYYYY')} set isComplete = 1 WHERE tvinfo_id = :tvinfo_id`, {
                replacements: {tvinfo_id},
                type: QueryTypes.UPDATE
            })
        })
        socket.on('connect data', async (data) => {
            /// подумать как сделать правильно
            const {userdata} = socket.handshake.session
            const {user_id,terminal} = userdata
            /// говнокод
            if(userdata.sendNotice){
                await sequelize.query(`SELECT * from tvinfo__${terminal}${moment().format('DMMYYYY')}  INNER JOIN roles__${terminal}
                WHERE  tvinfo__${terminal}${moment().format('DMMYYYY')}.services_id = roles__${terminal}.service_id AND user_id = :users_id AND isComplete = :isComplete AND isCall = :isCall`, {
                    replacements: {isComplete: 0,isCall:0,users_id: user_id},
                    type: QueryTypes.SELECT
                }).then(data=>socket.emit('show notice',data))
            }
            if(userdata.isNotice){
                await sequelize.query(`SELECT * from tvinfo__${terminal}${moment().format('DMMYYYY')}  INNER JOIN roles__${terminal}
                WHERE  tvinfo__${terminal}${moment().format('DMMYYYY')}.services_id = roles__${terminal}.service_id AND user_id = :users_id AND isComplete = :isComplete AND isCall = :isCall AND notice !=''`, {
                    replacements: {isComplete: 0,isCall:0,users_id: user_id},
                    type: QueryTypes.SELECT
                }).then(data=>socket.emit('await notice',data))
            }
            if(!userdata.sendNotice){
                await sequelize.query(`SELECT * from tvinfo__${terminal}${moment().format('DMMYYYY')}  INNER JOIN roles__${terminal} 
                WHERE  tvinfo__${terminal}${moment().format('DMMYYYY')}.services_id = roles__${terminal}.service_id AND user_id = :users_id AND isComplete = :isComplete AND isCall = :isCall AND notice =''`, {
                    replacements: {isComplete: 0,isCall:0,users_id: user_id},
                    type: QueryTypes.SELECT
                }).then(data=>socket.emit('show data',data))
            }
            ///
        })
        /// переделать
        socket.on('transfer ticket', async (data) => {
            const {receive, number,service,notice,tvinfo_id} = data;
            const {userdata} = socket.handshake.session
            const selectRole = await RolesSelectAll.selectCurrent(userdata.terminal,receive.user_id)
            await sequelize.query(`UPDATE tvinfo__${userdata.terminal}${moment().format('DMMYYYY')}  SET cabinet = :cabinet,notice = :notice,isCall = :isCall,services_id = :services_id WHERE number = :number ORDER BY tvinfo_id DESC LIMIT 1`, {
                replacements: {isCall: 0,cabinet:receive.cab,notice:userdata.isNotice ? notice:"",number:number,services_id:selectRole[0].service_id},
                type:QueryTypes.UPDATE
            })
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
                const keys = await client.sendCommand(['keys','*'])
                const sortedData = keys.sort()
                const data = await client.get(sortedData[0])
                console.log(data)
                const toObject = JSON.parse(data)
                if(toObject?.rooms === rooms){
                    cb(data)
                }

            }
        })

        socket.on('delete sound',async(data)=>{
            await client.del(data)
        })

        socket.on('clicked',async(data)=>{

            const {userdata} = socket.handshake.session
            const {number,tvinfo_id,date,received} = data
            const findTicket = await sequelize.query(`SELECT * from tvinfo__${userdata.terminal}${moment().format('DMMYYYY')} WHERE isComplete = :isComplete AND tvinfo_id = :tvinfo_id`,{
                replacements:{isComplete:0,tvinfo_id},
                type:QueryTypes.SELECT
            })

            await sequelize.query(`UPDATE tvinfo__${userdata.terminal}${moment().format('DMMYYYY')} SET isCall = :isCall,cabinet = :cabinet WHERE tvinfo_id = :tvinfo_id`,{
                replacements:{isCall:1,number,tvinfo_id,cabinet:userdata.cab},
                type:QueryTypes.UPDATE
            })
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
                    await client.set(ticket,JSON.stringify(objects))

                })
                .catch(err=>console.log(err))
        })
        async function soundData(ticket,cabinet,isCab) {
            const initialArray = ['public/sound/client.wav']
            const data = await fs.readdir('public/sound')
            const letters = await fs.readFile('public/sound/russia_letters.json',"utf-8")

            const letter = ticket.slice(0,1)
            const number = ticket.slice(1)
            const findSound=(num)=> {
             const currentSound = data.find(file=>{
                    return file.includes(num)
                })
                return `public/sound/${currentSound}`
            }
            const parseLetters = JSON.parse(letters)
            initialArray.push(parseLetters[letter])

            const checkNumberLength=(number)=>{
                return number.toString().length
            }

            const addStatus=()=>{
                const toStatus = isCab ? 'public/sound/tocabinet.wav' : 'public/sound/towindow.wav'
                initialArray.push(toStatus)
            }

            const generateSound=(object)=>{
                return Object.keys(object).map(item=>{
                    return findSound(object[item])
                }).sort()
            }
            const returnRest=(number)=>{
                const restNumber = number % 100
                return {
                    restNumber,
                    minusRest:number - restNumber
                }
            }
            const generateNumber=()=>{
                if(checkNumberLength(number) === 3){
                    const restNumber = returnRest(number)
                    const sortedNumber = generateSound(restNumber)
                    initialArray.push(...sortedNumber)
                    addStatus()
                    return
                }
                    initialArray.push(findSound(number))
                    addStatus()
            }
            const generateCabinet=()=>{
                if(checkNumberLength(cabinet) === 3){
                    const restCabinet = returnRest(cabinet)
                    const sortedCabinet = generateSound(restCabinet)
                    initialArray.push(...sortedCabinet)
                    return
                }
                    initialArray.push(findSound(cabinet))
            }
            ///
            generateNumber()
            generateCabinet()
            ///

            return initialArray
        }
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
                    await client.set(ticket,JSON.stringify(objects))
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