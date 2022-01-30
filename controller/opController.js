const Roles = require('../models/model__test/Roles')
const User = require('../models/model__test/User')
const {Op} = require('sequelize')

class opController{
    async renderOp(req,res,next){
        try{
            console.log(req.session)
            if(req.session.userdata.role_id !==Number(req.query.id)){
                res.status(401).json({'error':'Произошла ошибка'})
            }else{
                res.render('op',{
                    notice:req.session.userdata.isNotice
                })
            }
        }catch (e) {
            console.log(e)
        }
    }
    async getCabinet(req,res,next){
        try{
	    const {cab} = req.session.userdata
            const {service,id} = req.body
            await User.findAll({
                attributes:['cab'],
                where:{
                    terminalName:service,
		    cab:{
			[Op.not]:cab
		}
                }
            }).then(data=>res.json(data))
        }catch (e) {
	res.status(500).json({'message':`Произошла ошибка:${e}`})
        }
    }
}
////

module.exports = new opController()
