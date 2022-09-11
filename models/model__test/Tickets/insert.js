const connection = require('../../../core/config1')
const moment = require("moment");
const queryInterface = connection.getQueryInterface()


async function insert(tableName, service, terminalName, services_id, type, number, description,user_id) {
    const dateNow = moment().format('YYYY-MM-DD')
    const tableDate = moment().format('DMMYYYY')
    const timeNow = moment().tz('Asia/Yekaterinburg').format('HH:mm:ss')
    return await queryInterface.bulkInsert(`tvinfo__${tableName}${tableDate}`, [{
        date: dateNow,
        time: timeNow,
        service,
        description,
        number,
        terminalName,
        isCall: 0,
        services_id,
        user_id: null,
        isComplete: 0,
        type,
        notice: ''
    }
    ])
}

module.exports = {
    insert
}