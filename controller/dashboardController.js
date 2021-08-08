const Users = require('../models/model__test/User');
const Terminal = require('../models/model__test/Terminal');
const Service = require('../models/model__test/Service');
const Roles = require('../models/model__test/Roles');
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
        const {id} = req.body
        await Users.findAll({where:{terminalName:id}})
            .then(data=>res.json(data))
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
        await Users.findOne({
            where: {
                terminalName:data
           }
        },{
            raw:true
        }).then(data=>res.json([data]))
    }
    async addUser(req,res,next){
        const {user,terminal,cabinet} = req.body;

        const test = await Service.findOne({
            where: {
                setTerminalName:terminal
            },
        });
        const {dataValues:service} = test
        const checkUser = await Users.findAll(
            {
                where:{
                    setPrivilege:user,
                    terminalName:terminal,
                    cab:cabinet
                }
            })
        if(!checkUser.length){
            await Users.create({
                setPrivilege:user,
                terminalName:terminal,
                isActive:1,
                cab:cabinet,
                isCab:0
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
    }

}

module.exports = new dashboardController()