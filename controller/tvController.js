const sequelize = require('../core/config1');
const {QueryTypes} = require('sequelize')
const Terminal = require('../models/model__test/Terminal')
const moment = require('moment')

class tvController{
    async renderTv(req,res,next){
        await sequelize.query(`SELECT * from tvinfo__${req.query.id} WHERE terminalName = :terminalName 
        AND isComplete = :isComplete AND isCall = :isCall AND date = date_format(now(),"%Y-%m-%d")`,{
            replacements:{terminalName:req.query.id, isComplete:0,isCall:0},
            type:QueryTypes.SELECT
        })
            .then(async(data)=>{
                await Terminal.findAll({where:{
                    nameTerminal:req.query.id
                 }
                }).then(async(data1)=>{
                    res.render('tv',{
                        template:data,
                        template1:data1,
                        isRegistry:req.query.id.toString().includes('reg'),
                        clock:moment().format('HH:mm:ss'),
                        date:moment().format('D/MM/YYYY')
                    })
                })
            })
    }
}


// const tv = async(req,res)=> {
//        await connection.query(`SELECT * FROM tvinfo__${req.query.id} WHERE  terminalName='${req.query.id}' and isComplete=0 AND date = date_format(now(),"%Y-%m-%d")`)
//         .then(async (data) => {
//             await connection.query(`SELECT description__text from description__term WHERE terminalName='${req.query.id}'`)
//                 .then(data1 => {
//                     connection.query(`SELECT link from videos`)
//                         .then(data2 => {
//                             res.render('tv', {
//                                 template: data[0],
//                                 template1: data1[0],
//                                 videos: data2[0],
//                                 isRegistry: req.query.id.toString().includes('reg'),
//                                 clock:moment().format('HH:mm:ss'),
//                                 date:moment().format('D/MM/YYYY')
//                             });
//                         })
//                 })
//         });
// };
module.exports = new tvController()