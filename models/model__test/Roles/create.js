const sequelize = require('../../../core/config1')
const {DataTypes} = require('sequelize')
const queryInterface = sequelize.getQueryInterface()



async function up(tableName){
    return await queryInterface.createTable(`roles__${tableName}`,{
        roles_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        service_id:{
            type:DataTypes.INTEGER,
            allowNull: false
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    })
}
async function down(tableName){
    return await queryInterface.dropTable(`roles__${tableName}`)
}

module.exports = {
    up,
    down
}