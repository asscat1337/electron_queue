const sequelize = require('../core/config1');
const {QueryTypes} = require('sequelize')
const Terminal = require('../models/model__test/Terminal')
const moment = require('moment')
const {select} = require('../models/model__test/User/select')
const {selectAll} = require('../models/model__test/Roles/select')

class tvController{
    async renderTv(req,res,next){
        await sequelize.query(`SELECT * from tvinfo__${req.query.id}${moment().format('DMMYYYY')}
        INNER JOIN user__${req.query.id}
        WHERE tvinfo__${req.query.id}${moment().format('DMMYYYY')}.user_id = user__${req.query.id}.user_id
        AND isComplete = :isComplete AND isCall = :isCall AND date = :date ORDER BY tvinfo_id DESC LIMIT 20`,{
            replacements:{terminalName:req.query.id,
                isComplete: req.query.status === "0" ? 0 : 1 ,isCall: req.query.status === "0" ? 0 : 1,date:moment().format('YYYY-MM-DD')},
            type:QueryTypes.SELECT
        })
            .then(async(data)=>{
             console.log(data)
                const terminal = await Terminal.findAll({where:{
                    nameTerminal:req.query.id
                 }
                })
                switch (req.query.status) {
                    case '0' : /// для пунктов забора
                        res.render('status-tv',{
                            template:data.reverse(),
                            template1:terminal,
                            isRegistry:req.query.id.toString().includes('reg'),
                            clock:moment().format('HH:mm:ss'),
                            date:moment().format('DD/MM/YYYY')
                        })
                        break;
                    case '1' : /// для регистратуры и прочее
                        res.render('ticket-tv',{
                            template:data,
                            template1:terminal,
                            isRegistry:req.query.id.toString().includes('reg'),
                            clock:moment().format('HH:mm:ss'),
                            date:moment().format('DD/MM/YYYY')
                        })
                        break;
                    default :
                        console.log(123)

                }
            })
    }
    async generateSound(req,res,next){
        try{
            return res.status(200).send('ушло')
        }catch(e){
            console.log(e)
        }
    }
}
module.exports = new tvController()