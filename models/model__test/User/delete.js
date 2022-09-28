const sequelize = require('../../../core/config1')
const {QueryTypes} = require('sequelize')


const deleteUser=async (object)=>{
    const {id,userTerminal} = object
    return await sequelize.query(`DELETE FROM user__${userTerminal} WHERE user_id = :id`,{
        type:QueryTypes.DELETE,
        replacements:{id}
    })
}


module.exports = {
    deleteUser
}