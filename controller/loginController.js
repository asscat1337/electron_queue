const sequelize = require('../core/config1');
const User = require('../models/model__test/User');
const Roles = require('../models/model__test/Roles')
const selectUser = require('../models/model__test/User/select')
class LoginController{
    async renderLogin(req,res,next){
        try{
            const findUsers = await selectUser.selectAll(req.query.uch)
            // const findUser = await User.findAll({where:{terminalName:req.query.uch,isActive:1},raw:true})
            res.render('login',{
                result:Array.from(findUsers)
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
            const user = await selectUser.selectFromLogin(terminalVal,setPrivilege)
            //const roles = await Roles.findOne({where:{users_id:user.role_id}})
            if(user){
                req.session.userdata = {...user[0],terminal:terminalVal}
                 return res.redirect(302,`/op?service=${terminalVal}&id=${user[0].user_id}`)
            }
        }
        catch (e) {
            console.log(e)
            return res.json(e).status(500)
        }
    }
}

module.exports = new LoginController()