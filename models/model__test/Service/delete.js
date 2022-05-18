const sequelize = require('../../../core/config1')
const {QueryTypes} = require('sequelize')
const queryInterface = sequelize.getQueryInterface()



async function deleteService(tableName,id){
    return await queryInterface.bulkDelete(`service__${tableName}`,{
        service_id:id
    })
}


module.exports = {
    deleteService
}