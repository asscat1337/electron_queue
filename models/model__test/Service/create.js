const sequelize = require('../../../core/config1')
const {Sequelize,DataTypes}= require('sequelize')
const queryInterface = sequelize.getQueryInterface()


async function up(tableName){
   return await queryInterface.createTable(`service__${tableName}`,{
        service_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            autoIncrement:true,
            primaryKey:true
        },
       name:{
            type:DataTypes.STRING,
           allowNull: false
       },
       letter:{
            type:DataTypes.STRING,
            allowNull:false
       },
       pointer:{
            type:DataTypes.INTEGER,
            defaultValue:1,
            allowNull:false
       },
       status:{
            type:DataTypes.BOOLEAN,
            defaultValue: true
       },
       start_time:{
            type:DataTypes.TIME,
            allowNull:false
       },
       end_time:{
            type:DataTypes.TIME,
            allowNull:false
       },
       isNotice:{
            type:DataTypes.BOOLEAN,
            allowNull:false
       },
       type:{
            type:DataTypes.INTEGER,
           allowNull:false
       }
    })
}

async function down(tableName){
    return await queryInterface.dropTable(`service__${tableName}`)
}

module.exports = {
    up,
    down
}

