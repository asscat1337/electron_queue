const sequelize = require('../../../core/config1')
const Sequelize = require('sequelize')
const moment = require("moment");
const {QueryTypes} = require("sequelize");
const queryInterface = sequelize.getQueryInterface()


async function updateIsComplete(tableName,tvinfo_id){
    return queryInterface.sequelize.query(`UPDATE tvinfo__${tableName}${moment().format('DMMYYYY')} set isComplete = 1 WHERE tvinfo_id = :tvinfo_id`, {
        replacements: {tvinfo_id},
        type: QueryTypes.UPDATE
    })
}

async function updateTransferTicket(tableName,user_id,isNotice,number,notice){
    return queryInterface.sequelize.query(`UPDATE tvinfo__${tableName}${moment().format('DMMYYYY')}  SET user_id = :user_id,notice = :notice,isCall = :isCall WHERE number = :number ORDER BY tvinfo_id DESC LIMIT 1`, {
        replacements: {isCall: 0,user_id,notice:isNotice ? notice:"",number:number},
        type:QueryTypes.UPDATE
    })
}
async function updateIsCall(tableName,number,tvinfo_id,user_id){
    return await queryInterface.sequelize.query(`UPDATE tvinfo__${tableName}${moment().format('DMMYYYY')} SET isCall = :isCall,user_id = :user_id WHERE tvinfo_id = :tvinfo_id`,{
        replacements:{isCall:1,number,tvinfo_id,user_id},
        type:QueryTypes.UPDATE
    })
}

module.exports = {
    updateIsComplete,
    updateTransferTicket,
    updateIsCall
}