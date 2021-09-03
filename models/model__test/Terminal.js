const sequelize = require('../../core/config1');
const Service = require('./Service');

const {Sequelize,DataTypes} = require('sequelize');

const Terminal = sequelize.define('terminal',{
    terminal_id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    nameTerminal:{
        type:DataTypes.TEXT
    },
    isActive:{
        type:DataTypes.BOOLEAN,
    },
    description:{
        type:DataTypes.TEXT
    },
},{
    createdAt: false,
    updatedAt:false,
    freezeTableName: true
})
Terminal.hasMany(Service,{onDelete:'cascade'});
module.exports = Terminal;