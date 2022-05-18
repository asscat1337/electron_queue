const Service = require('../models/model__test/Service');
const Terminal = require('../models/model__test/Terminal')
const TicketService = require('../databases/ticket-service')
const {QueryTypes,Sequelize} = require('sequelize')
const moment = require('moment')
const sequelize = require('../core/config1')
const selectService = require('../models/model__test/Service/select')
const updateService = require('../models/model__test/Service/update')

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
            console.log(service)
               // const service = await Service.findAll({where:{setTerminalName:req.query.id,status:1}})
               res.render('ts',{
                   data:service,
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
    async setStateTicket(req,res,next){
        try{
            console.log(req.body)
              const {number,service,nameTerminal,cabinet,id,type,pointer}=req.body
            const addedData = await sequelize.query(`INSERT into tvinfo__${nameTerminal}${moment().format('DMMYYYY')} VALUES (:tvinfo_id,:time,:date,:service,:number,:terminalName,:cabinet,:isCall,:service_id,:isComplete,:type,:notice)`,{
                replacements:{tvinfo_id:null,time:moment().format('YYYY-MM-DD'),date:moment().format('HH:mm:ss'),service:service,number:number,terminalName:nameTerminal,cabinet:0,isCall:0,service_id:id,isComplete:0,type:type,notice:''},
                type:QueryTypes.INSERT
            })
            const addedDataId = addedData[0]
                    // await Service.increment({pointer:1},{
                    //     where:{id}
                    // })
            await updateService.updatePointer(nameTerminal,pointer,id)
            const dataTicket = await sequelize.query(`SELECT * from tvinfo__${nameTerminal}${moment().format('DMMYYYY')} WHERE tvinfo_id = :tvinfo_id`,{
                replacements:{tvinfo_id:addedDataId},
                type:QueryTypes.SELECT
            })
            return res.status(200).json(dataTicket)
        }
        catch (e) {
            console.log(e)
        }
    }
async updatePointerNull(req,res,next){
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