const fs = require("fs").promises;

async function soundData(ticket,cabinet,isCab) {
    const initialArray = ['public/sound/client.wav']
    const letters = await fs.readFile('public/sound/russia_letters.json',"utf-8")

    const letter = ticket.slice(0,1)
    const number = ticket.slice(1)

    const findSound=(num)=> {
        return `public/sound/${num}.wav`
    }
    const parseLetters = JSON.parse(letters)
    initialArray.push(parseLetters[letter])

    const checkNumberLength=(number)=>{
        return number.toString().length
    }

    const addStatus=()=>{
        const toStatus = isCab ? 'public/sound/towindow.wav' : 'public/sound/tocabinet.wav'
        initialArray.push(toStatus)
    }

    const generateSound=(array)=>{
        return array
            .filter(f=>f !== 0)
            .sort((a,b)=>b-a)
            .map(item=>findSound(item))
    }
    const returnRest=(number)=>{
        const restNumber = number % 100
        const minusRest = number - restNumber
        return [
            restNumber,
            minusRest
        ]
    }
    const generateNumber=()=>{
        if(checkNumberLength(number) === 3){
            const restNumber = returnRest(number)
            const sortedNumber = generateSound(restNumber)
            initialArray.push(...sortedNumber)
            addStatus()
            return
        }
        initialArray.push(findSound(number))
        addStatus()
    }
    const generateCabinet=()=>{
        if(checkNumberLength(cabinet) === 3){
            const restCabinet = returnRest(cabinet)
            const sortedCabinet = generateSound(restCabinet)
            initialArray.push(...sortedCabinet)
            return
        }
        initialArray.push(findSound(cabinet))
    }
    generateNumber()
    generateCabinet()
    return initialArray
}

module.exports = soundData