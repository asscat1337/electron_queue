


const getSoundQueue=(map,rooms,searchParams)=>{
    return map.get(rooms).get(searchParams)
}

const setSoundQueue=(map,rooms,params)=>{
    const {key,value} = params
    return map.get(rooms).set(key,value)
}


module.exports = {
    getSoundQueue,
    setSoundQueue
}