const sequelize = require('../../../core/config1')
const {DataTypes} = require('sequelize')
const queryInterface = sequelize.getQueryInterface()


async function up(tableName){
    return await queryInterface.createTable(`user__${tableName}`,{
        user_id:{
            primaryKey:true,
            autoIncrement:true,
            type:DataTypes.INTEGER,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        cab:{
            type:DataTypes.INTEGER,
            defaultValue: 1,
            allowNull:false
        },
        isActive:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
            allowNull:false
        },
        isReg:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        },
        isNotice:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        },
        sendNotice:{
            type:DataTypes.BOOLEAN,
            allowNull:false
        }
    })
}
async function down(tableName,id){
    return await queryInterface.dropTable(`user__${tableName}`,{
        user_id:id
    })
}

module.exports = {
    up,
    down
}