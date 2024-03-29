const socket = io.connect('http://localhost:8000', {
    transport: ['pooling'],
    withCredentials: true
});
const tvInfo = document.querySelector('.columns__container');

setInterval(() => {
    document.querySelector('.clock').textContent = moment().format('HH:mm:ss')
    document.querySelector('.date').textContent = moment().format('DD/MM/YYYY')
}, 1000)


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
socket.on('connect', () => {
    socket.emit('room', getRoomId.id)
    if (document.querySelectorAll('.preloader')) {
        document.querySelectorAll('.preloader').forEach(item => item.remove())
        document.body.classList.remove('loaded')
    }
});

window.addEventListener('unload', () => {
    socket.emit('end')
})
document.querySelector('.sound-container').insertAdjacentHTML(`beforebegin`, `<audio class="player" autoplay></audio>`)

socket.on('disconnect', () => {
    document.body.insertAdjacentHTML(`beforebegin`, `
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

const createCurrent = (data) => {
    const isCabCheck = data.isCab ? `Окно ${data.cabinet}` : `Кабинет ${data.cabinet}`
    document.querySelector('.current').insertAdjacentHTML('beforeend', `
        <div class="current__container">
                 <h4 class="current__ticket">${data.ticket}</h4>
                <div class="arrow-down">
                    <img src="../public/img/arrow-down.svg" alt="">
                </div>
                <h4 class="current__cab">${isCabCheck}</h4>
        </div>
    `)
}

if (getRoomId.status === "0") {
    socket.on('show result', data => {
        data.map(item => {
            tvInfo.insertAdjacentHTML('beforeend', `<div class="ticket">
                    <div class="number">${item.number}</div> 
                      <div class="status">Ожидание</div>
            </div>`)
        })
        let score = 0
        const testtest = document.querySelectorAll('.ticket:not(.hide)')
        if (testtest.length >= 20) {
            score = testtest.length
            testtest[score - 1].classList.add('hide')
        }
        setInterval(() => {
            document.querySelectorAll('.left-ticket').forEach(item => item.remove())
        }, 15000)
    })
}
let test;

socket.on('clear', () => {
    window.location.reload()
})



socket.on('completed', data => {
    if (document.querySelectorAll('.ticket').length < 20) {
        Array.from(document.querySelectorAll('.hide')).reverse().forEach(item => item.classList.remove('hide'))
    }
    const currentContainer = document.querySelector('.current__container')
    if (currentContainer) {
        currentContainer.remove()
    }
})

const callTicketFunc = async (data) => {
    if (data === null) return
    play_all(data)
    if (data.hasOwnProperty('data')) {
        const currentContainer = document.querySelector('.current__container')
        const {cabinet, isCab, ticket} = data.data
        if(currentContainer){
            currentContainer.remove()
        }
        createCurrent(data.data)
        if (getRoomId.status === "0") {
            const tickets = document.querySelectorAll('.ticket')

            tickets.forEach(ticketBlock => {
                const number = ticketBlock.querySelector('.number');
                const status = ticketBlock.querySelector('.status')

                if (number.textContent === ticket) {
                    if (isCab) {
                        status.textContent = `Окно ${cabinet}`
                    }
                    if (!isCab) {
                        status.textContent = `Кабинет ${cabinet}`
                    }
                }
            })
        } else {
            tvInfo.insertAdjacentHTML('afterbegin', `<div class="ticket">
                    <div class="number">${ticket}</div>
                      <div class="status">
                        ${isCab ? `Окно ${cabinet}` : `Кабинет ${cabinet}`}
                      </div>
            </div>`)
        }
        if (document.querySelectorAll('.ticket').length >= 20) {
            tvInfo.lastChild.remove()
        }
    }
}


async function testFunction(data) {
    const sound = data.sound
    for (let i = 0; i < sound.length; i++) {
        const audio = new Audio(sound[i])
        await playAudio(audio)
        if (i + 1 === sound.length) {
            socket.emit('delete sound', data, (soundData) => {
                if(soundData){
                    callTicketFunc(soundData)
                }
            })
        }
    }
}

async function playAudio(sound) {
    console.log(sound)
        sound.addEventListener('loadedmetadata', (event)=>{
            sound.play()
        })
    await new Promise((resolve, reject) => {
        sound.addEventListener('ended', () => {
            resolve()
        })
        sound.addEventListener('error', () => {
            reject()
        })
    })
}

async function play_all(data) {
    await testFunction(data)
}


socket.on('pong', async (data) => {
    await callTicketFunc(data)
})
socket.on('repeat ticket', data => {
    play_all(data)
});