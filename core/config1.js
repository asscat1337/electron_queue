const {Sequelize} = require('sequelize')
const sequelize = new Sequelize(process.env.DB,process.env.DB_USER,process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    query:{
        raw:true
    }
})
async function init(){
    try{
        await sequelize.authenticate()
        // await sequelize.sync({alter:true})
        console.log(`connected to ${process.env.DB}`)
    }
    catch (e) {
        console.log(e)
    }
}
init()

module.exports = sequelize