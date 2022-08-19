const sequelize = require('../../../core/config1')
const {Sequelize,DataTypes} = require('sequelize')
const queryInterface = sequelize.getQueryInterface()


async function up(tableName,data){
    return await queryInterface.bulkInsert(`service__${tableName}`,[{
        name:data.setTerminalName,
        description:data.description,
        letter:data.letter,
        pointer:data.pointer,
        status:data.status,
        start_time:data.start_time,
        end_time:data.end_time,
        isNotice:data.isNotice || 0,
        type:data.type || 0
    }])
}

async function down(tableName,id){
    return await queryInterface.bulkDelete(`service__${tableName}`,{
        service_id:id
    })
}
module.exports = {
    up,
    down
}