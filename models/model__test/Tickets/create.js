const sequelize = require('../../../core/config1')
const moment = require('moment')()

const createTableTicket=async (service,date = moment.format('DMMYYYY') )=>{
    await sequelize.query(`CREATE TABLE IF NOT EXISTS tvinfo__${service}${date} 
                (tvinfo_id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,date DATE NOT NULL,time TIME NOT NULL,service TEXT NOT NULL,description TEXT NOT NULL,number TEXT NOT NULL,terminalName TEXT NOT NULL,cabinet INTEGER NOT NULL,
                isCall BOOLEAN NOT NULL,services_id INTEGER NOT NULL,
                isComplete BOOLEAN NOT NULL,
                type INTEGER NOT NULL, notice TEXT NOT NULL) CHARACTER SET utf8 COLLATE utf8_general_ci`)
        .then(()=>{
            return {message:'Таблица создана!'}
        })
}


module.exports = createTableTicket