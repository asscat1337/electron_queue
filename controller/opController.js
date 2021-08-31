const Roles = require('../models/model__test/Roles')

class opController{
    async renderOp(req,res,next){
        try{
            res.render('op',{
                userId:req.session.userdata.role_id,
                sessionTer:req.session.userdata.terminalName,
                sessionCab:req.session.userdata.cab
            })
        }catch (e) {
            if(!req.session.userdata) return res.redirect(`/login`)
        }
    }
    async getCabinet(req,res,next){
        try{
            const {service,id} = req.body
            await Roles.findAll({
                attributes:['cab'],
                where:{
                    terminalName:service
                }
            }).then(data=>res.json(data))
        }catch (e) {

        }
    }
}
////

module.exports = new opController()
