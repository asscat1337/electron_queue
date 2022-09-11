const {QueryTypes} = require('sequelize')
const sequelize = require('../core/config1')
const createTableTicket = require('../models/model__test/Tickets/create')
const moment = require('moment')()

class TicketService {
    async createTable(service){
        try{
        await createTableTicket(service)
        }catch (e) {
            return e
        }
    }

    async checkTable(table){
        try{
           const data =  await sequelize.query(`SELECT table_name FROM information_schema.tables 
                            WHERE table_schema = '${process.env.DB}' and 
        table_name='tvinfo__${table}${moment.format('DMMYYYY')}'`,{type:QueryTypes.SELECT})
            if(!data.length){
                return {length:false}
            }
            return {length:true}
        }catch (e) {
            console.log(e)
            return e
        }
    }

    async selectTicket(info){
        const {users_id,terminalName} = info
        try{
          const data =  await sequelize.query(`SELECT * from tvinfo__${terminalName}${moment.format('DMMYYYY')}  INNER JOIN roles__${terminalName}
                WHERE tvinfo__${terminalName}${moment.format('DMMYYYY')}.services_id = roles__${terminalName}.service_id AND isCall = :isCall AND roles__${terminalName}.user_id BETWEEN 0 and :user_id
                AND isComplete = :isComplete ORDER BY tvinfo_id ASC LIMIT 1`, {
                replacements: {isComplete:0,isCall:0,user_id:users_id},
                type: QueryTypes.SELECT
            })

            return data
        }catch (e) {
            console.log(e)
        }
    }
    async getCurrentTicket(info){
        const {terminalName,tvinfo_id} = info
        const tableName = `tvinfo__${terminalName}${moment.format('DMMYYYY')}`
        try{
            const data = await sequelize.query(`SELECT * from ${tableName} WHERE tvinfo_id = :tvinfo_id`,{
                replacements:{tvinfo_id},
                type:QueryTypes.SELECT
            })
            return data
        }catch (e) {
            console.log(e)
        }
    }
}


module.exports = new TicketService()