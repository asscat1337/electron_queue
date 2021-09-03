const sequelize = require('../../core/config1');
const {Sequelize,DataTypes} = require('sequelize')

const Roles = sequelize.define('roles',{
    rolesId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    services_id:{
        type:DataTypes.INTEGER
    },
    users_id:{
        type:DataTypes.INTEGER
    },
    terminalName:{
        type:DataTypes.STRING
    },
    cab:{
        type:DataTypes.INTEGER
    }
},{
    createdAt:false,
    updatedAt:false,
    freezeTableName:true,
    timestamps:false
})
module.exports = Roles