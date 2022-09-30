const sequelize = require('../../../core/config1')
const {Sequelize,QueryTypes} = require('sequelize')
const queryInterface = sequelize.getQueryInterface()


async function select(tableName,id){
   return await queryInterface.sequelize.query(`SELECT * FROM service__${tableName} WHERE service_id = :service_id`,{
        type:QueryTypes.SELECT,
        replacements:{service_id:id}
    })
}
async function selectAll(tableName){
    return await queryInterface.sequelize.query(`SELECT * FROM service__${tableName}`,{
        type:QueryTypes.SELECT
    })
}
async function selectUserService(tableName,user_id){
    return await queryInterface.sequelize.query(`SELECT * FROM service__${tableName} INNER JOIN roles__${tableName} 
        WHERE service__${tableName}.service_id = roles__${tableName}.service_id and roles__${tableName}.user_id = ${user_id}`,{
        type:QueryTypes.SELECT
    })
}


module.exports = {
    select,
    selectAll,
    selectUserService
}