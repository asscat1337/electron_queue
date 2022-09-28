const sequelize = require('../../../core/config1')
const {QueryTypes} = require("sequelize");




const updateUser = async(object)=>{
    const {role_id,setPrivilege,cab,isNotice,sendNotice,userTerminal} = object
    return await sequelize.query(`UPDATE user__${userTerminal} SET name = :name,cab = :cab,cab = :cab,isNotice = :isNotice,sendNotice = :sendNotice WHERE user_id = :user_id`,{
        type:QueryTypes.UPDATE,
        replacements:{cab,name:setPrivilege,isNotice,sendNotice,user_id:role_id}
    })
}
const updateIsActive=async (object)=>{
    const {status,id,userTerminal} = object

    return await sequelize.query(`UPDATE user__${userTerminal} SET isActive = :status WHERE user_id = :id`,{
        type:QueryTypes.UPDATE,
        replacements:{status,id}
    })
}

module.exports = {
    updateUser,
    updateIsActive
}