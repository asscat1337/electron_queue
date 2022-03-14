const {QueryTypes} = require('sequelize')
const sequelize = require('../core/config1')
const moment = require('moment')()

class TicketService {
    async createTable(service){
        try{
            await sequelize.query(`CREATE TABLE IF NOT EXISTS tvinfo__${service}${moment.format('DMMYYYY')} 
                (tvinfo_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL ,date DATE NOT NULL,time TIME NOT NULL,service TEXT NOT NULL,number TEXT NOT NULL,terminalName TEXT NOT NULL,cabinet INTEGER NOT NULL,
                isCall BOOLEAN NOT NULL,services_id INTEGER NOT NULL,
                isComplete BOOLEAN NOT NULL,
                type INTEGER NOT NULL, notice TEXT NOT NULL)`)
                .then(()=>{
                    return {message:'Таблица создана!'}
                })
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

    async insertTable(service,fields){
        try{
            await sequelize.query(`INSERT INTO tvinfo__${service}${moment.format('DDMMYYYY')} 
VALUES (${fields})`,{type:QueryTypes.INSERT})
        }catch(e){
            console.log(e)
            return e
        }
    }

    async updateTable(){

    }
}


module.exports = new TicketService()