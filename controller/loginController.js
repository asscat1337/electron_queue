const sequelize = require('../core/config1');
const User = require('../models/model__test/User');
const Roles = require('../models/model__test/Roles')
class LoginController{
    async renderLogin(req,res,next){
        try{
            const findUser = await User.findAll({where:{terminalName:req.query.uch,isActive:1},raw:true})
            res.render('login',{
                result:Array.from(findUser)
            })
        }
        catch (e) {
            res.status(500).render('template/error',{
                error:`type ${e}`
            })
        }
    }
    async authUser(req,res,next){
        try{
            const {setPrivilege,terminalVal}=req.body;
            const user = await User.findOne({where:{setPrivilege,terminalName:terminalVal},raw:true})
            const roles = await Roles.findOne({where:{users_id:user.role_id}})
            if(user){
                req.session.userdata = user
                 return res.redirect(302,`/op?service=${user.terminalName}&id=${user.role_id}`)
            }
        }
        catch (e) {
            console.log(e)
            return res.json(e).status(500)
        }
    }
}

module.exports = new LoginController()