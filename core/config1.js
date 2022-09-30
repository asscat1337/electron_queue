const {Sequelize} = require('sequelize')
const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),

    transports:[
        new winston.transports.File({filename:'error.log',level:'error'}),
        new winston.transports.File({filename:'combined.log'})
    ]
});

const sequelize = new Sequelize(process.env.DB,process.env.DB_USER,process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    query:{
        raw:true
    },
    logging:process.env.NODE_ENV === "production" ? false :  (msg)=>logger.debug(msg)
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