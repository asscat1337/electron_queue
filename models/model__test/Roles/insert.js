const sequelize = require('../../../core/config1')
const {QueryTypes} = require('sequelize')
const queryInterface = sequelize.getQueryInterface()


async function up(tableName,data){
    return await queryInterface.bulkInsert(`roles__${tableName}`,[{
        user_id:data.user_id,
        service_id:data.service_id
    }])
}

async function down(tableName,data){
    return await queryInterface.bulkDelete(`roles__${tableName}`,{
        roles_id:data
    })
}

module.exports = {
    up,
    down
}