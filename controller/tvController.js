const sequelize = require('../core/config1');
const {QueryTypes} = require('sequelize')
const Terminal = require('../models/model__test/Terminal')
const moment = require('moment')

class tvController{
    async renderTv(req,res,next){
        await sequelize.query(`SELECT * from tvinfo__${req.query.id}${moment().format('DMMYYYY')} WHERE terminalName = :terminalName 
        AND isComplete = :isComplete AND isCall = :isCall AND time = date_format(now(),"%Y-%m-%d") ORDER BY tvinfo_id DESC LIMIT 20`,{
            replacements:{terminalName:req.query.id,
                isComplete: req.query.status === "0" ? 0 : 1 ,isCall: req.query.status === "0" ? 0 : 1},
            type:QueryTypes.SELECT
        })
            .then(async(data)=>{
                console.log(data)
                await Terminal.findAll({where:{
                    nameTerminal:req.query.id
                 }
                }).then(async(data1)=>{
                    switch (req.query.status) {
                        case '0' : /// для пунктов забора
                            res.render('status-tv',{
                                template:data.reverse(),
                                template1:data1,
                                isRegistry:req.query.id.toString().includes('reg'),
                                clock:moment().format('HH:mm:ss'),
                                date:moment().format('D/MM/YYYY')
                            })
                            break;
                        case '1' : /// для регистратуры и прочее
                            res.render('ticket-tv',{
                                template:data,
                                template1:data1,
                                isRegistry:req.query.id.toString().includes('reg'),
                                clock:moment().format('HH:mm:ss'),
                                date:moment().format('D/MM/YYYY')
                            })
                            break;
                        default :
                            console.log(123)

                    }
                })
            })
    }
}
module.exports = new tvController()