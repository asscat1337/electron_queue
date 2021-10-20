const Service = require('../models/model__test/Service');
const Terminal = require('../models/model__test/Terminal')
const Ticket = require('../models/model__test/Ticket')
const {QueryTypes,Sequelize} = require('sequelize')
const moment = require('moment')
const sequelize = require('../core/config1')
class TerminalController {
    async renderTerminal(req,res,next){
        try{
        //    const checkTable =  await sequelize.query(`select 1 from tvinfo__${req.query.id}${moment().format('DDMMYYYY')} limit 1`)
        //    if(!checkTable){
        //        await sequelize.query(`CREATE TABLE tvinfo__${req.query.id}${moment().format('DMMYYYY')} (tvinfo_id INT NOT NULL AUTO_INCREMENT,time VARCHAR(45) NULL,
        // date VARCHAR(45) NULL,service VARCHAR(45) NULL,number VARCHAR(45) NULL,terminalName VARCHAR(45) NULL,Privilege VARCHAR(45) NULL,
        // cabinet VARCHAR(45) NULL,isCalledAgain TINYINT(4) NULL,isCall TINYINT(4) NULL,services_id VARCHAR(45) NULL,isComplete INTEGER(11) NULL,type INTEGER(11) NULL,PRIMARY KEY (tvinfo_id)) CHARACTER SET utf8 COLLATE utf8_general_ci`)
        //    }
        //    else{
               const service = await Service.findAll({where:{setTerminalName:req.query.id,status:1}})
               const terminal = await Terminal.findOne({where:{nameTerminal:req.query.id}})
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
            const {data} = req.body
            const findTerminal = await Service.findOne({where:{id:data}})
            res.json([findTerminal])
        }catch (e) {
            console.log(e)
        }
    }
    async setStateTicket(req,res,next){
        try{
            const {number,service,nameTerminal,cabinet,id,type}=req.body
            const addedData = await sequelize.query(`INSERT into tvinfo__${nameTerminal}${moment().format('DMMYYYY')} VALUES (:tvinfo_id,:time,:date,:service,:number,:terminalName,:Privilege,cabinet,:isCalledAgain,:isCall,:service_id,:isComplete,:type,:notice)`,{
                replacements:{tvinfo_id:null,time:moment().format('HH:mm:ss'),date:moment().format('YYYY-MM-DD'),service:service,number:number,terminalName:nameTerminal,Privilege:"",cabinet,isCalledAgain:0,isCall:0,service_id:id,isComplete:0,type:type,notice:''},
                type:QueryTypes.INSERT
            })
            const addedDataId = addedData[0]
                    await Service.increment({pointer:1},{
                        where:{id}
                    })
            await sequelize.query(`SELECT * from tvinfo__${nameTerminal}${moment().format('DMMYYYY')} WHERE tvinfo_id = :tvinfo_id`,{
                replacements:{tvinfo_id:addedDataId},
                type:QueryTypes.SELECT
            }).then(data=>res.json(data))
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