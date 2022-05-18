const sequelize = require('../../../core/config1')
const {DataTypes} = require('sequelize')
const queryInterface = sequelize.getQueryInterface()

async function up(tableName,data){
    return await queryInterface.bulkInsert(`user__${tableName}`,[{
        name:data.name,
        cab:data.cab,
        isActive:1,
        isReg:data.isReg,
        isNotice:data.isNotice,
        sendNotice:data.sendNotice
    }])
}

async function down(tableName,id){
    return await queryInterface.bulkDelete(`user__${tableName}`,{
        user_id:id
    })
}

module.exports = {
    up,
    down
}