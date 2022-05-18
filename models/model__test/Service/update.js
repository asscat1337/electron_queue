const sequelize = require('../../../core/config1')
const queryInterface = sequelize.getQueryInterface()



async function updatePointer(tableName,pointer,id){ /// временное решение
    return await queryInterface.bulkUpdate(`service__${tableName}`,{
        pointer:pointer + 1
    },{
        service_id:id
    })
}
async function updateCurrentService(tableName,data){
    return await queryInterface.bulkUpdate(`service__${tableName}`,{
        name:data.ServiceName,
        letter:data.letter,
        description:data.description,
        start_time:data.startTime,
        end_time:data.endTime
    },{
        service_id:data.id
    })
}



module.exports = {
    updatePointer,
    updateCurrentService
}