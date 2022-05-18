const sequelize = require('../../../core/config1')
const {QueryTypes} = require('sequelize')
const queryInterface = sequelize.getQueryInterface()


async function select(tableName,id){
    return await queryInterface.sequelize.query(`SELECT * FROM user__${tableName} WHERE user_id = :user_id`,{
        type:QueryTypes.SELECT,
        replacements:{user_id:id}
    })
}
async function selectAll(tableName){
    return await queryInterface.sequelize.query(`SELECT * FROM user__${tableName}`,{
        type:QueryTypes.SELECT
    })
}

async function selectFromLogin(tableName,login){
    return await queryInterface.sequelize.query(`SELECT * FROM user__${tableName} WHERE name = :login`,{
        type:QueryTypes.SELECT,
        replacements:{login}
    })
}

module.exports = {
    select,
    selectAll,
    selectFromLogin
}