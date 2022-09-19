const Service = require('../models/model__test/Service');
const Terminal = require('../models/model__test/Terminal')
const TicketService = require('../databases/ticket-service')
const {QueryTypes} = require('sequelize')
const moment = require('moment')
const sequelize = require('../core/config1')
const selectService = require('../models/model__test/Service/select')
const updateService = require('../models/model__test/Service/update')
const {insert} = require('../models/model__test/Tickets/insert')
const {selectByTvInfo} = require('../models/model__test/Tickets/select')

class TerminalController {
    async renderTerminal(req,res,next){
        try{
           const {id} = req.query
            const checkTicket = await TicketService.checkTable(id)
            if(!checkTicket.length){
                await TicketService.createTable(id)
            }
            const service = await selectService.selectAll(id)
            const terminal = await Terminal.findOne({where:{nameTerminal:req.query.id}})
               res.render('ts',{
                   data:service.filter(item=>item.status !== 0),
                   data1:terminal
               })
           //}
        }
        catch (e) {
            console.log(e)
        }
    }
    async getTicket(req,res,next){
        try{
            const {data,terminalId} = req.body
            const findTerminal = await selectService.select(terminalId,data)
            res.status(200).json(findTerminal)
        }catch (e) {
            console.log(e)
        }
    }
    async setStateTicket(req,res){
        try{
            const {number,service,nameTerminal,description,id,type,pointer}=req.body
            const addedData = await insert(nameTerminal,service,nameTerminal,id,type,number,description)
            await updateService.updatePointer(nameTerminal,pointer,id)
            const dataTicket = await selectByTvInfo(nameTerminal,addedData)
            return res.status(200).json(dataTicket)
        }
        catch (e) {
            console.log(e)
            return res.status(500).json({
                message:'Произошла ошибка при выполнении запроса',
                error:e
            })
        }
    }
async updatePointerNull(req,res){
        try{
           const {service,terminal} = req.body
           await Service.update({pointer:1},{
                where:{
                    terminal,
                    service
                }
            }).then(()=>res.json({"success":true}))
        }catch (e) {

        }
}
}
module.exports = new TerminalController()