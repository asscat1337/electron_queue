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

async function updateTransferTicket(tableName,cab,isNotice,number,notice,service_id){
    return queryInterface.sequelize.query(`UPDATE tvinfo__${tableName}${moment().format('DMMYYYY')}  SET cabinet = :cabinet,notice = :notice,isCall = :isCall,services_id = :services_id WHERE number = :number ORDER BY tvinfo_id DESC LIMIT 1`, {
        replacements: {isCall: 0,cabinet:cab,notice:isNotice ? notice:"",number:number,services_id:service_id},
        type:QueryTypes.UPDATE
    })
}
async function updateIsCall(tableName,number,tvinfo_id,cab){
    return await queryInterface.sequelize.query(`UPDATE tvinfo__${tableName}${moment().format('DMMYYYY')} SET isCall = :isCall,cabinet = :cabinet WHERE tvinfo_id = :tvinfo_id`,{
        replacements:{isCall:1,number,tvinfo_id,cabinet:cab},
        type:QueryTypes.UPDATE
    })
}

module.exports = {
    updateIsComplete,
    updateTransferTicket,
    updateIsCall
}