const sequelize = require('../../core/config1');
const {Sequelize,DataTypes} = require('sequelize')
const Roles = require('../model__test/Roles')

const User =  sequelize.define('role',{
    role_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    setPrivilege:{
        type:DataTypes.TEXT
    },
    cab:{
        type:DataTypes.INTEGER
    },
    isActive:{
        type:DataTypes.BOOLEAN
    },
    terminalName:{
        type:DataTypes.TEXT
    },
    isCab:{
        type:DataTypes.BOOLEAN
    },
    isNotice:{
        type:DataTypes.BOOLEAN
    },
    sendNotice:{
        type:DataTypes.BOOLEAN
    }
},{
    createdAt: false,
    updatedAt:false,
    freezeTableName: true,
    timestamps:false
});
User.hasMany(Roles,{as:'roles',foreignKey:'users_id',onDelete:'cascade'});
module.exports = User
