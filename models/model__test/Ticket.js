// const sequelize = require('../../core/config1');
// const {Sequelize,DataTypes} = require('sequelize')
//
// const Ticket = sequelize.define('tvinfo',{
//     tvinfo_id:{
//         type:DataTypes.INTEGER,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     time:{
//         type:DataTypes.TIME
//     },
//     ServiceName:{
//         type:DataTypes.DATE
//     },
//     service:{
//         type:DataTypes.TEXT
//     },
//    number:{
//         type:DataTypes.INTEGER
//     },
//     terminalName:{
//         type:DataTypes.TEXT
//     },
//     cabinet:{
//         type:DataTypes.TIME
//     },
//     isChecked:{
//         type:DataTypes.BOOLEAN
//     },
//     isCalledAgain:{
//         type:DataTypes.BOOLEAN
//     },
//     isCall:{
//         type:DataTypes.BOOLEAN
//     }
// },{
//     timestamps: false,
//     freezeTableName: true,
// })
// // module.exports = Ticket