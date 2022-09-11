const sequelize = require('../../../core/config1')
const moment = require("moment");
const {QueryTypes} = require("sequelize");
const queryInterface = sequelize.getQueryInterface()



async function selectTicket(tableName,user_id){
    try{
        return await queryInterface.sequelize.query(`SELECT * from tvinfo__${tableName}${moment().format('DMMYYYY')}  INNER JOIN roles__${tableName}
                WHERE  tvinfo__${tableName}${moment().format('DMMYYYY')}.services_id = roles__${tableName}.service_id AND roles__${tableName}.user_id = :users_id AND isComplete = :isComplete AND isCall = :isCall`, {
            replacements: {isComplete: 0,isCall:0,users_id: user_id},
            type: QueryTypes.SELECT
        })
    }catch{
        return []
    }

}
async function selectIsNotice(tableName,user_id){
    return await queryInterface.sequelize.query(`SELECT * from tvinfo__${tableName}${moment().format('DMMYYYY')}  INNER JOIN roles__${tableName}
                WHERE  tvinfo__${tableName}${moment().format('DMMYYYY')}.services_id = roles__${tableName}.service_id AND user_id = :users_id AND isComplete = :isComplete AND isCall = :isCall AND notice !=''`, {
        replacements: {isComplete: 0,isCall:0,users_id: user_id},
        type: QueryTypes.SELECT
    })
}
async function selectIsNotComplete(tableName,tvinfo_id){
    return await queryInterface.sequelize.query(`SELECT * from tvinfo__${tableName}${moment().format('DMMYYYY')} WHERE isComplete = :isComplete AND tvinfo_id = :tvinfo_id`,{
        replacements:{isComplete:0,tvinfo_id},
        type:QueryTypes.SELECT
    })
}
async function selectByTvInfo(tableName,tvinfo_id){
    return await queryInterface.sequelize.query(`SELECT * FROM tvinfo__${tableName}${moment().format('DMMYYYY')} WHERE tvinfo_id = :tvinfo_id`,{
        type:QueryTypes.SELECT,
        replacements:{tvinfo_id}
    })
}

module.exports = {
    selectTicket,
    selectIsNotice,
    selectIsNotComplete,
    selectTicket,
    selectByTvInfo
}