const socket = io('localhost:5000',{
    credentials:true,
    transport:['pooling']
});
const tvInfo = document.querySelector('.columns__container');

setInterval(()=>{
    document.querySelector('.clock').textContent = moment().format('HH:mm:ss')
},1000)


const getQueryStringParams = query => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                    let [key, value] = param.split('=');
                    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                    return params;
                }, {}
            )
        : {}
};
socket.on('connect',()=>{
    socket.emit('room',Object.values(getQueryStringParams(`${window.location.search}`)).join(''))
    if(document.querySelectorAll('.preloader')){
        document.querySelectorAll('.preloader').forEach(item=>item.remove())
        document.body.classList.remove('loaded')
    }
});

window.addEventListener('unload',()=>{
    socket.emit('end')
})

socket.on('disconnect',()=>{
 document.body.insertAdjacentHTML(`beforebegin`,`
 <div class="preloader">
  <svg class="preloader__image" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor"
      d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z">
    </path>
  </svg>
</div>
 `)
    window.setTimeout(function () {
        document.body.classList.add('loaded');
    }, 500);
});
socket.on('show result',data=>{
    console.log(data);
    data.map(item=>{
        tvInfo.insertAdjacentHTML('beforeend',`<div class="ticket">
                    <div class="number">${item.number}</div> 
                      <div class="status">Ожидание</div>
            </div>`)
    })
    if(document.querySelectorAll('.ticket').length>20){
        tvInfo.lastChild.classList.add('hide')
    }
    setInterval(()=>{
        document.querySelectorAll('.left-ticket').forEach(item=>item.remove())
    },15000)
})
let test;
socket.on('completed',data=>{
    console.log(data)
    let ticketArr = []
    document.querySelectorAll('.number').forEach(item=>ticketArr.push(item.textContent))
    ticketArr.find(el=>{
        if(el===data.number){
            document.querySelectorAll('.number').forEach(block=>{
                if(block.textContent === el){
                    block.parentNode.remove()
                }
            })
        }
    })
    if(document.querySelectorAll('.ticket').length<20){
        Array.from(document.querySelectorAll('.hide')).reverse().forEach(item=>item.classList.remove('hide'))
    }
})
let arrQueue = []
document.querySelector('.sound-container').insertAdjacentHTML(`beforebegin`,`<audio class="player" autoplay></audio>`)

async function testFunction(data){
    console.log(data)
    for(let i = 0;i<data.length;i++){
        const audio = new Audio(data[i])
        await playAudio(audio)
    }
}

async function playAudio(sound){
    sound.play()

    await new Promise((resolve,reject)=>{
        sound.addEventListener('ended',()=>{
            resolve()
        })
        sound.addEventListener('error',()=>{
            reject()
        })
    })
}

document.addEventListener('DOMContentLoaded',async()=>{
    await socket.on('message',data=>{
        console.log(data)
        if(data===undefined) return;
        let ticketArr = []
        document.querySelectorAll('.number').forEach(item=>ticketArr.push(item.textContent))
        const {cabinet,isCab,ticket} = data[0].data
         ticketArr.find(el=>{
             if(el===ticket){
                 document.querySelectorAll('.number').forEach(block=>{
                     if(block.textContent === el){
                         isCab ? block.parentNode.querySelector('.status').textContent = `Окно ${cabinet}`
                             :block.parentNode.querySelector('.status').textContent = `Кабинет ${cabinet}`
                         block.parentNode.classList.add('active')
                     }
                 })
             }
         })
         testFunction(Object.values(data[1]).map(item=>item))
        });
        await socket.on('repeat ticket',data=> {
            testFunction(data)
        });
    });