const sequelize = require('../../core/config1');
const {Sequelize,DataTypes} = require('sequelize')

const Service = sequelize.define('service',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    Letter:{
        type:DataTypes.TEXT
    },
    ServiceName:{
        type:DataTypes.TEXT
    },
    description:{
        type:DataTypes.TEXT
    },
    pointer:{
        type:DataTypes.INTEGER
    },
    status:{
        type:DataTypes.BOOLEAN
    },
    setTerminalName:{
        type:DataTypes.TEXT
    },
    start_time:{
        type:DataTypes.TIME
    },
    end_time:{
        type:DataTypes.TIME
    },
    type:{
        type:DataTypes.INTEGER
    }
},{
    timestamps: false,
    freezeTableName: true,
})
module.exports = Service