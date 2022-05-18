const sequelize = require('../../../core/config1')
const {QueryTypes} = require('sequelize')
const queryInterface = sequelize.getQueryInterface()



async function selectAll(tableName){
    return await queryInterface.sequelize.query(`SELECT * FROM roles__${tableName}`,{
        type:QueryTypes.SELECT
    })
}

async function selectCurrent(tableName,id){
    return await queryInterface.sequelize.query(`SELECT * FROM roles__${tableName} WHERE user_id = :user_id`,{
        type:QueryTypes.SELECT,
        replacements:{user_id:id}
    })

}



module.exports = {
    selectAll,
    selectCurrent
}