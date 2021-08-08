const Service = require('../models/model__test/Service');
const Terminal = require('../models/model__test/Terminal')
const Ticket = require('../models/model__test/Ticket')
const {QueryTypes,Sequelize} = require('sequelize')
const moment = require('moment')
const sequelize = require('../core/config1')
class TerminalController {
    async renderTerminal(req,res,next){
        try{
           const service = await Service.findOne({where:{setTerminalName:req.query.id,id:req.query.service}})
            const terminal = await Terminal.findOne({where:{nameTerminal:req.query.id}})
            res.render('ts',{
                data:service,
                data1:terminal
            })
        }
        catch (e) {

        }
    }
    async getTicket(req,res,next){
        try{
            const {data} = req.body
            const findTerminal = await Service.findOne({where:{id:data}})
            res.json([findTerminal])
        }catch (e) {
            console.log(e)
        }
    }
    async setStateTicket(req,res,next){
        try{
            const {number,service,nameTerminal,cabinet,id}=req.body
             await sequelize.query(`INSERT into  tvinfo__${nameTerminal} VALUES (:tvinfo_id,:time,:date,:service,:number,:terminalName,:cabinet,:isCalledAgain,:isCall,:service_id)`,{
                replacements:{tvinfo_id:null,time:moment().format('HH:mm:ss'),date:moment().format('YYYY-MM-DD'),service:service,number:number,terminalName:nameTerminal,cabinet:cabinet,isCalledAgain:0,isCall:0,service_id:id},
                type:QueryTypes.INSERT
            }).then(()=>res.json({'success':true}))
        }
        catch (e) {
            console.log(e)
        }
    }
    async updatePointer(req,res,next){
        try{
            const {terminal,service,pointer} = req.body
            await Service.update({pointer:pointer+1},{
                where:{
                    setTerminalName:terminal,
                    ServiceName:service
                }
            })
                .then(()=>res.json({"success":true}))
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