const socket = io.connect('http://localhost:8000',{
    transport:['pooling'],
    withCredentials:true
});
const tvInfo = document.querySelector('.columns__container');

setInterval(()=>{
    document.querySelector('.clock').textContent = moment().format('HH:mm:ss')
    document.querySelector('.date').textContent = moment().format('DD/MM/YYYY')
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
const getRoomId = getQueryStringParams(`${window.location.search}`)
socket.on('connect',()=>{
    socket.emit('room',getRoomId.id)
    if(document.querySelectorAll('.preloader')){
        document.querySelectorAll('.preloader').forEach(item=>item.remove())
        document.body.classList.remove('loaded')
    }
});

window.addEventListener('unload',()=>{
    socket.emit('end')
})
document.querySelector('.sound-container').insertAdjacentHTML(`beforebegin`,`<audio class="player" autoplay></audio>`)

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
if(getRoomId.status === "0"){
    socket.on('show result',data=>{
        data.map(item=>{
            tvInfo.insertAdjacentHTML('beforeend',`<div class="ticket">
                    <div class="number">${item.number}</div> 
                      <div class="status">Ожидание</div>
            </div>`)
        })
        let score = 0
        const testtest = document.querySelectorAll('.ticket:not(.hide)')
        if(testtest.length >= 20){
            score = testtest.length
            testtest[score-1].classList.add('hide')
        }
        setInterval(()=>{
            document.querySelectorAll('.left-ticket').forEach(item=>item.remove())
        },15000)
    })
}
let test;
socket.on('completed',data=>{
   const numbers = Array.from(document.querySelectorAll('.number'));
   numbers.forEach(number=>{
       if(number.textContent === data.number){
               if(getRoomId.status === "1"){
                   number.parentNode.classList.remove('active')
               }
               if(getRoomId.status === "0"){
                   number.parentNode.remove()
               }
       }
   })
    if(document.querySelectorAll('.ticket').length<20){
        Array.from(document.querySelectorAll('.hide')).reverse().forEach(item=>item.classList.remove('hide'))
    }
})
async function testFunction(data){
    const sound = data.sound
    let index = 0;


    function recursive_play(){
        if(index+1 === sound.length){
            playAudio(new Audio(sound[index]),null)
            console.log(123)
            socket.emit('delete sound',data.ticket)
        }else{
            playAudio(new Audio(sound[index]),()=>{
                index++;
                recursive_play()
            })
        }
    }

    recursive_play()
}
async function playAudio(sound,callback){
    sound.play()
    if(callback){
        sound.addEventListener('ended',callback)
    }
    // await new Promise((resolve,reject)=>{
    //     sound.addEventListener('ended',()=>{
    //         prev+=sound.duration
    //         resolve()
    //     })
    //     sound.addEventListener('error',()=>{
    //         reject()
    //     })
    // })

}

function play_all(data){
    testFunction(data)
}

setInterval(()=>{
    const start = Date.now();
    socket.volatile.emit('ping',getRoomId.id,(data)=>{
        if(data===null) return;
        // const latency = Date.now() - start
        const dataSound = JSON.parse(data)
        play_all(dataSound)
        if(dataSound.hasOwnProperty('data')){
            const {cabinet,isCab,ticket} = dataSound?.data
             // if(getRoomId.status === "1"){

            if(getRoomId.status === "0"){
                const tickets = document.querySelectorAll('.ticket')

                tickets.forEach(ticketBlock=>{
                    const number = ticketBlock.querySelector('.number');
                    const status = ticketBlock.querySelector('.status')

                    if(number.textContent === ticket){
                        ticketBlock.classList.add('active')
                        if(isCab) {
                            status.textContent = `Окно ${cabinet}`
                        }
                        if(!isCab){
                            status.textContent = `Кабинет ${cabinet}`
                        }
                    }
                })
            }else{
                tvInfo.insertAdjacentHTML('afterbegin',`<div class="ticket active">
                    <div class="number">${ticket}</div> 
                      <div class="status">
                        ${isCab ? `Окно ${cabinet}` : `Кабинет ${cabinet}` }                      
                      </div>
            </div>`)
            }
                if(document.querySelectorAll('.ticket').length>=20){
                    tvInfo.lastChild.remove()
                }
//                 document.querySelector('.left-ticket__container').insertAdjacentHTML('afterbegin',
//                     `
// 	   <div class="ticket-call">
// 	    <span>${ticket}</span>
// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="arrow_down" x="0px" y="0px" width="128px" height="128px" viewBox="0 0 512 512" style="enable-background:new 0 0 256 256;" xml:space="preserve">
// <g>
// 	<path d="M256,512l256-256H352V0.001L160,0v256H0L256,512z"/>
// </g>
// </svg>
//             <span>${isCab ? `Окно ${cabinet}` : `Кабинет ${cabinet}` }</span>
//            </div>
// 	`)
//                 setTimeout(()=>{
//                     document.querySelector('.ticket-call').remove()
//                 },10000)
           // }
            play_all(dataSound,ticket)
        }
        socket.on('repeat ticket',data=> {
            console.log(data)
            // play_all(data?.sound)
        });


    })

},10000)

socket.on('message',data=>{
    console.log(data)
})
// document.addEventListener('DOMContentLoaded',async()=>{
//      socket.on('message',data=>{
//         console.log(socket.volatile)
//         if(data===undefined) return;
//         let ticketArr = []
//         document.querySelectorAll('.number').forEach(item=>ticketArr.push(item.textContent))
//         const {cabinet,isCab,ticket} = data.data
//         if(getRoomId.status === "1"){
//             tvInfo.insertAdjacentHTML('afterbegin',`<div class="ticket active">
//                     <div class="number">${ticket}</div>
//                       <div class="status">
//                         ${isCab ? `Окно ${cabinet}` : `Кабинет ${cabinet}` }
//                       </div>
//             </div>`)
//             if(document.querySelectorAll('.ticket').length>=20){
//                 tvInfo.lastChild.remove()
//             }
// 	document.querySelector('.left-ticket__container').insertAdjacentHTML('afterbegin',
// 	`
// 	   <div class="ticket-call">
// 	    <span>${ticket}</span>
// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="arrow_down" x="0px" y="0px" width="128px" height="128px" viewBox="0 0 512 512" style="enable-background:new 0 0 256 256;" xml:space="preserve">
// <g>
// 	<path d="M256,512l256-256H352V0.001L160,0v256H0L256,512z"/>
// </g>
// </svg>
//             <span>${isCab ? `Окно ${cabinet}` : `Кабинет ${cabinet}` }</span>
//            </div>
// 	`)
// 	setTimeout(()=>{
// 		document.querySelector('.ticket-call').remove()
// 	},10000)
//         }
//          ticketArr.find(el=>{
//              if(el===ticket){
//                  document.querySelectorAll('.number').forEach(block=>{
//                      if(block.textContent === el){
//                          isCab ? block.parentNode.querySelector('.status').textContent = `Окно ${cabinet}`
//                              :block.parentNode.querySelector('.status').textContent = `Кабинет ${cabinet}`
//                          block.parentNode.classList.add('active')
//                      }
//                  })
//              }
//          })
//          play_all(Object.values(data.sound).map(item=>item),ticket)
//          socket.emit('start queue',true)
//         });
//         socket.on('repeat ticket',data=> {
//             play_all(data.sound)
//         });
//     });