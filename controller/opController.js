const Roles = require('../models/model__test/Roles')

class opController{
    async renderOp(req,res,next){
        try{
            if(req.session.userdata.role_id !==Number(req.query.id)){
                res.status(401).json({'error':'Произошла ошибка'})
            }else{
                res.render('op')
            }
        }catch (e) {
            console.log(e)
            // if(!req.session.userdata) return res.redirect(`/login`)
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
