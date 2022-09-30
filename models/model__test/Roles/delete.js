const sequelize = require('../../../core/config1')
const {QueryTypes} = require("sequelize");


const deleteRole=async(object)=>{

    const {id,userTerminal} = object
    return await sequelize.query(`DELETE FROM roles__${userTerminal} WHERE user_id = :id`,{
        type:QueryTypes.DELETE,
        replacements:{id}
    })
}

const deleteServiceRoles=async (object)=>{
    const {service,user,terminal} = object

    return await sequelize.query(`DELETE FROM roles__${terminal} WHERE service_id = :service AND user_id = :user`,{
        type:QueryTypes.DELETE,
        replacements:{service,user}
    })
}


module.exports = {
    deleteRole,
    deleteServiceRoles
}