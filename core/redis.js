const redis = require('redis');
const client = redis.createClient({
    host:'localhost',
    port:6379,

})


async function init(){
    try{
        await client.connect()
        console.log('connected to redis')
    }catch (e) {
        console.log(e)
    }
}

init()

module.exports = client