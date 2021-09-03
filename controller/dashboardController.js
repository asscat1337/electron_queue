const Users = require('../models/model__test/User');
const Terminal = require('../models/model__test/Terminal');
const Service = require('../models/model__test/Service');
const Roles = require('../models/model__test/Roles');
const {Op}= require('sequelize')
const sequelize = require('../core/config1')
class dashboardController {
    async renderDashboard(req,res,next){
        const users = await Users.findAll({raw:true})
        const terminal = await Terminal.findAll({raw:true});
        const services = await Service.findAll({raw:true})
        let sum = services.reduce((acc,current)=>acc+current.pointer,0)
        res.render('dashboard',{
            data:users,
            data1:terminal,
            stats:services,
            total:sum
        })
    }
    async deleteUserService(req,res,next){
        const {user} = req.body
        await Users.update({isActive:0},{
            where:{
                setPrivilege:user
            }
        }).then(res.json({'message':'Пользователь отключен'}))
    }
    async showFreeUsers(req,res,next){
        const {terminal} = req.body
        await Users.findAll({where:{terminalName:terminal,isActive:0}})
            .then(data=>res.json(data))
    }
    async showService(req,res,next){
        const {terminal}=req.body
         await Service.findAll({where:{setTerminalName:terminal}})
             .then(data=>res.json(data))
    }
    async showUsers(req,res,next){
        try{
            ///говнокод,педередать позже,возможно мутации
            const {id} = req.body
            let arr = []
            await Roles.findAll({where:{services_id:id}})
                .then(data=>{
                    console.log(data)
                    data.map(item=>arr.push({role_id:item.users_id}))
                }).then(async()=>{
                    await Users.findAll({
                        where:{
                            [Op.or]:arr
                        }
                    }).then(query=>res.json(query))
                })
                ///
        }catch (e) {
            res.status(500).json(e)
        }
    }
    async updateUserTerminal(req,res,next){
        const {serviceName,user} = req.body
        await Users.update({isActive:1},{
            where:{
                setPrivilege: user,
                terminalName:serviceName
            }
        }).then(res.json({'message':'Пользователь активирован'}))
    }
    async enableUser(req,res,next){
        const {user} = req.body
        await Users.update({isActive:1},{
            where:{
                setPrivilege:user
            }
        }).then(res.json({'message':'Пользователь активирован'}))
    }
    async showTerminalUser(req,res,next){
        const {data} = req.body
        await Users.findAll({
            where: {
                terminalName:data
           }
        }).then(data=>res.json(data))
    }
    async addUser(req,res,next){
        const {user,terminal,cabinet,isReg,id} = req.body;
        try{
            const service = await Service.findOne({
                where: {
                    setTerminalName:terminal,
                    id
                },
            });
            if(user === "" || cabinet === '' || isReg ==='' ){
                return res.status(400).json({'message':'Не заполнены поля'})
            }
            const checkUser = await Users.findAll(
                {
                    where:{
                        setPrivilege:user,
                        terminalName:terminal,
                        cab:cabinet
                    }
                })
            if(checkUser.cab === cabinet || checkUser.setPrivilege === user){
                return res.status(400).json({'message':'Данные дублируются'})
            }
            if(!checkUser.length){
                await Users.create({
                    setPrivilege:user,
                    terminalName:terminal,
                    isActive:1,
                    cab:cabinet,
                    isCab:isReg
                },{raw:true}).then(async (data)=>{
                    const {dataValues}=data
                    await Roles.create({
                        services_id:service.id,
                        users_id:dataValues.role_id,
                        terminalName:dataValues.terminalName,
                        cab:dataValues.cab,
                    })
                }).then(res.json({'message':'Пользователь добавлен'}))
            }
            if(checkUser.length){
                res.json({'message':'Пользователь уже существует'})
            }
        }catch (e) {
            console.log(e)
        }
    }
    async deleteUser(req,res,next){
        const {role} = req.body
        await Users.destroy({
            where:{
                setPrivilege:role
            }
        }).then(res.json({'message':'Пользователь удален'}))
    }
    async disableUser(req,res,next){
        const {id,status} = req.body
        console.log(req.body);
        await Users.update({isActive:status},{
            where:{
                role_id:id
            }
        }).then(status ? res.json({'message':'Пользователь активирован'}):res.json({'message':'Пользователь отключен'}))
    }
    async changeUserData(req,res,next){
        const {user,cabinet,terminal} = req.body
        await Users.update({setPrivilege:user,cab:cabinet},
            {
                where:{
                    terminalName:terminal
                }
            }).then(res.json({'message':'Данные о пользователе обновились'}))
    }
    async updateServiceData(req,res,next){
        try{
            console.log(req.body)
            const {ServiceName,description,id,startTime,endTime} = req.body
            await Service.update({
                "start_time":startTime,
                "end_time":endTime,
                ServiceName,description},{
                where:{
                    id:id
                }
            })
                .then(res.json({'message':'Данные о терминале обновились'}))
        }catch (e) {
            res.status(500).json(e)
        }
    }
    async addNewService(req,res,next){
        try{
            const {letter,ServiceName,description,pointer,Priority,status,setTerminalName,roles,start_time,end_time} = req.body;
            await Service.create({
                Letter:letter,ServiceName,description,pointer,Priority,status,setTerminalName,start_time,end_time
            }).then(async(data)=>{
                const {id} = data.dataValues
                if(roles.length){
                    roles.map(async(role)=>{
                        await Roles.update({services_id:id},{
                            where:{
                                users_id:role
                            }
                        })
                    })
                }
               const findTerminal = await Terminal.findOne({where:{
                   nameTerminal:setTerminalName
                   }
               })
                const {terminal_id} = findTerminal
                await Service.update({terminalTerminalId:terminal_id},{
                    where:{
                        id
                    }
                })

            }).then(res.json({'message':'Сервис добавлен'}))

        }catch (e) {
            console.log(e)
        }
    }

    async AddNewTerminal(req,res,next){
        try{
            const {terminalName,descriptionText}= req.body;
            await Terminal.findAll({
                where:terminalName
            }).then(result=>{
                if(result){
                    return res.status(400).json({'message':'Данный терминал уже существует'})
                }
            })
            await Terminal.create({nameTerminal:terminalName,isActive:1,description:descriptionText})
                .then(res.json({'message':'success'}))
            await sequelize.query(`CREATE TABLE tvinfo__${terminalName} (tvinfo_id INT NOT NULL AUTO_INCREMENT,time VARCHAR(45) NULL,
    date VARCHAR(45) NULL,service VARCHAR(45) NULL,number VARCHAR(45) NULL,terminalName VARCHAR(45) NULL,Privilege VARCHAR(45) NULL,
    cabinet VARCHAR(45) NULL,isCalledAgain TINYINT(4) NULL,isCall TINYINT(4) NULL,services_id VARCHAR(45),PRIMARY KEY (tvinfo_id))`)
        }catch (e) {
            return res.json({'error':e}).status(400)
        }
    }
    async deleteTerminal(req,res,next){
        try{
            const {nameTerminal} = req.body;
            await Terminal.destroy({
                where:{
                    nameTerminal
                }
            }).then(res.json({'message':'Терминал удалён'}))
        }catch (e) {

        }
    }

}

module.exports = new dashboardController()