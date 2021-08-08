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
            if(!findUser){
                res.status(500).render('template/error',{
                                error:'Не найдено пользователей'
                             })
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    async authUser(req,res,next){
        try{
            const {setPrivilege,terminalVal}=req.body;
            const user = await User.findOne({where:{setPrivilege,terminalName:terminalVal},raw:true})
            const roles = await Roles.findOne({where:{users_id:user.role_id}})
            if(user){
                // req.session.username = setPrivilege;
                // req.session.terminal = user.terminalName;
                // req.session.cabinet = user.cab;
                // req.session.isCab = user.isCab;
                // req.session.user_id = user.role_id;
                 return res.redirect(302,`/op?service=${user.terminalName}&id=${roles.services_id}`)
            }
        }
        catch (e) {
            console.log(e)
            return res.json(e).status(500)
        }
    }
}


// exports.login = (req,res)=>{
//     const query = req.query.uch;
//                 connection.query(`SELECT distinct role.role_id,role.setPrivilege,role.terminalName from role inner JOIN roles ON roles.users_id = role.role_id WHERE role.terminalName= '${query}'`)
//                     .then(data=>{
//                         if(data[0].length){
//                             res.render('login',{
//                                 result:data[0],
//                             });
//                         }
//                         else{
//                             res.status(500).render('template/error',{
//                                 error:'Не найдено пользователей'
//                             })
//                         }
//                     })
// };
module.exports = new LoginController()