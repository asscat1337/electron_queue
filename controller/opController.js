const selectUser = require('../models/model__test/User/select')
const TicketSelect = require('../models/model__test/Tickets/select')

class opController{
    async renderOp(req,res,next){
        try{
            const {userdata} = req.session
            console.log(userdata)
            if(req.session.userdata.user_id !==Number(req.query.id)){
                res.status(401).json({'error':'Произошла ошибка'})
            }else{
                res.render('op',{
                    notice:userdata.isNotice,
                    login:userdata.name
                })
            }
        }catch (e) {
            console.log(e)
        }
    }
    async getTicket(req,res,next){
        try{
            const {user_id,terminal} = req.session.userdata
            const data = await TicketSelect.selectTicket(terminal,user_id)

            return res.status(200).json(data)
        }catch (e) {
            return res.status(500).json(e)
        }
    }
    async getCabinet(req,res,next){
        try{
	    const {terminal,user_id} = req.session.userdata
            const data = await selectUser.selectAll(terminal)
            const filteredUser = data.filter(item=>item.user_id !== user_id)

            return res.status(200).json(filteredUser)
        }catch (e) {
	res.status(500).json({'message':`Произошла ошибка:${e}`})
        }
    }
}
////

module.exports = new opController()
