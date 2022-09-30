const Terminal = require('../models/model__test/Terminal');
const {QueryTypes}= require('sequelize')
const sequelize = require('../core/config1')
const createService = require('../models/model__test/Service/create')
const createUser = require('../models/model__test/User/create')
const InsertUser = require('../models/model__test/User/insert')
const createRoles = require('../models/model__test/Roles/create')
const insertService = require('../models/model__test/Service/insert')
const insertRoles = require('../models/model__test/Roles/insert')
const selectService = require('../models/model__test/Service/select')
const selectUser = require('../models/model__test/User/select')
const updateService = require('../models/model__test/Service/update')
const deleteService = require('../models/model__test/Service/delete')
const selectRoles = require('../models/model__test/Roles/select')
const {selectByStat} = require('../models/model__test/Tickets/select')
const {updateUser,updateIsActive} = require('../models/model__test/User/update')
const {deleteUser} = require('../models/model__test/User/delete')
const {deleteRole,deleteServiceRoles} = require('../models/model__test/Roles/delete')
const {selectUserService} = require('../models/model__test/Service/select')
const moment = require('moment')

class dashboardController {
    async renderDashboard(req,res,next){
        const terminal = await Terminal.findAll({raw:true});
        res.render('dashboard',{
            data1:terminal,
        })
    }
    async showService(req,res,next){
        try{
            const {terminal}=req.body

            const data = await selectService.selectAll(terminal)

            return res.status(200).json(data)
        }catch (e) {
            return res.status(500).json(e)
        }
    }
    async showTerminalUser(req,res,next){
        const {data} = req.body
        const allUsers = await selectUser.selectAll(data)
        console.log(allUsers)
        return res.status(200).json(allUsers)
    }
    async registerUser(req,res,next) {
        try{
            const {terminalName} = req.body
            const newUser = await InsertUser.up(terminalName,req.body)

            return res.status(200).json({'message':'Пользователь зарегистрирован',newUser})
        }catch (e) {
            console.log(e)
        }
    }
    async deleteUser(req,res){
        try{
            await deleteUser(req.body)
            await deleteRole(req.body)

            return res.status(200).json({message:'Пользователь удален'})
        }catch (e) {
            console.log(e)
            return res.status(500).json({
                message:'Произошла ошибка при выполнении запроса'
            })
        }
    }
    async disableUser(req,res){
        try{
            const {status} = req.body
            await updateIsActive(req.body)
            return res.status(200).json({message:status ? 'Пользователь активирован':'Пользователь отключен'})
        }catch (e) {
            return res.status(500).json(e)
        }
    }
    async updateServiceData(req,res,next){
        try{
           const {terminalName} = req.body

            await updateService.updateCurrentService(terminalName,req.body)
           return  res.status(200).json({'message':'Данные о терминале обновились'})
        }catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }
    async addNewService(req,res,next){
        try{
            const {setTerminalName,roles} = req.body

            const createService = await insertService.up(setTerminalName,req.body)

            if(roles.length){
                roles.map(async(role)=>{
                    await insertRoles.up(setTerminalName,{user_id:role,service_id:createService})
                })
            }

            return res.status(200).json({message:'услуга добавлена'})

        }catch (e) {
            console.log(e)
        }
    }

    async AddNewTerminal(req,res,next){
        try{
            const {terminalName,descriptionText}= req.body;
            const findTerminal = await Terminal.findAll({
                where:{
                    nameTerminal:terminalName
                }
            })
            if(findTerminal.length){
                return res.status(400).json({'message':'Данный терминал уже существует'})
            }
            await Promise.all([
                Terminal.create({nameTerminal:terminalName,isActive:1,description:descriptionText}),
                createRoles.up(terminalName),
                createService.up(terminalName),
                createUser.up(terminalName)
            ])
                .then(res.status(200).json({message:'Терминал добавлен'}))
        }catch (e) {
            console.log(e)
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
            }).then(async ()=>{
                await sequelize.query(`DROP TABLE tvinfo__${nameTerminal}${moment().format('DMMYYYY')}`,{
                    type:QueryTypes.DELETE
                })
            }).then(res.json({'message':'Терминал удален'}))
        }catch (e) {
        console.log(e)
        }
    }
    async deleteService(req,res,next){
        try{
            const {id,terminalName} = req.body

            await deleteService.deleteService(terminalName,id)

            return res.status(200).json({'message':'Услуга удалена'})
        }catch (e) {
            console.log(e)
        }
    }
    async selectUserTerminal(req,res,next){
        try{
            const {terminalName} = req.body
            const data = await selectUser.selectAll(terminalName)

            return res.status(200).json(data)
        }catch(e){
            console.log(e)
        }
    }
    async showCurrentUser(req,res,next){
        try{
            const {userId,terminal} = req.query
            const userData = await selectUser.select(terminal,userId)
            const currentRoles = await selectRoles.selectCurrent(terminal,userId)
            const userService = await selectUserService(terminal,userId)
            const selectAll= await selectService.selectAll(terminal)
            const serviceUser = currentRoles.map(item=>item.service_id)
            const filterServices = selectAll.filter(item=>{
                return !serviceUser.includes(item.service_id)
            })

            return res.status(200).json({user:userData,services:currentRoles ? filterServices : selectAll,userService})

        }catch (e) {
            console.log(e)
        }
    }
    async editUser(req,res){
        try{
            await updateUser(req.body)
            return res.status(200).json({'message':'Данные о пользователе обновились'})
        }
        catch (e) {
            return res.status(500).json(e)
        }
    }

    async updateServiceUser(req,res,next){
        try{
           const {user_id,service_id,terminal} = req.body
            const data = await insertRoles.up(terminal,{user_id,service_id})

            return res.status(200).json(data)
        }catch (e) {
            return res.status(500).json(e)
        }
    }
    async getStat(req,res,next){
        try{
            const {terminal,date} = req.query
            const selectedDate = moment(date).format('DMMYYYY')
            const getData = await selectByStat(terminal,selectedDate)

            if(!getData){
                return res.status(400).json({
                    message:'Не найдено информации'
                })
            }

            return res.status(200).json(getData)
        }catch (e) {
            console.log(e)
            return res.status(500).json(e)
        }
    }

    async disableUserService(req,res){
        try{
            await deleteServiceRoles(req.query)

            return res.status(200).send()
        }catch (e) {
            return res.status(500).json(e)
        }
    }
}

module.exports = new dashboardController()