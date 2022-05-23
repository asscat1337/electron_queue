const redis = require('redis');
const {createAdapter} = require('@socket.io/redis-adapter')
const pubClient = redis.createClient({
    host:'localhost',
    port:6379,

})
const subClient = pubClient.duplicate()


const adapter = createAdapter(pubClient,subClient)

module.exports = {
    adapter,
    pubClient,
    subClient
}