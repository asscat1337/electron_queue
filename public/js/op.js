const socket = io.connect('http://localhost:8000', {
    withCredentials: true,
    reconnection: true,
    transport: ['websocket'],
    forceNew: true,
    extraHeaders: {
        'my-custom-headers': 'abcd'
    }
});

const ticketText = document.querySelector('.ticket__text');
const nextButton = document.querySelector('.next__button');
const repeatButton = document.querySelector('.repeat__button');
const transferButton = document.querySelector('.transfer__button');
const buttonMain = document.querySelectorAll('.op__main-button button');
const ticket__text = document.querySelector('.ticket__text')
const service___text = document.querySelector('.service__text');
const inputNotice = document.querySelector('.input-notice')

let number, service, terminal = '';
let numberSocket, roomId;
const btnComplete = document.querySelector('.next__complete');
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
let dataTicket = {}

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

const getStringParams = query => {
    return query.slice(1).split('&').reduce((params, param) => {
        let [key, value] = param.split('=')
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
    }, {})
}

const ButtonDisabled = (btn1, btn2) => {
    for (let i = 1; i < buttonMain.length; i++) {
        if (ticketText.textContent) {
            buttonMain[i].disabled = btn1
            nextButton.disabled = btn2
        }
    }
}
const isEmpty = (object) => Object.keys(object).length === 0
const userInfo = getStringParams(`${Object.values(window.location.search).join('')}`)

window.addEventListener('unload', () => {
    socket.emit('end')
    const isEmptyObject = isEmpty(dataTicket)
    if (!isEmptyObject) {
        localStorage.setItem('currentTicket', JSON.stringify(dataTicket))
    }
})
let tickets = []


const getTicket = async () => {
    const response = await fetch('/op/get-ticket')

    const data = await response.json()

    return data
}

window.addEventListener('load', () => {

    let currentTicket
    const current = localStorage.getItem('currentTicket')
    if (current) {
        currentTicket = JSON.parse(current)
    }

    if (currentTicket && currentTicket.isComplete === 0) {
        ticket__text.textContent = currentTicket.number
        service___text.textContent = currentTicket.description
        ButtonDisabled(false, true)
        dataTicket = currentTicket
    }

    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals, {
        onOpenStart: function () {
            document.querySelector('.modal').style.zIndex = 9999
        }
    });
    socket.on('connect', () => {
        socket.emit('room', Object.values(getQueryStringParams(`${window.location.search}`)).join(''))
        socket.emit('connect data', getStringParams(`${Object.values(window.location.search).join('')}`))
        if (document.querySelectorAll('.preloader')) {
            document.querySelectorAll('.preloader').forEach(item => item.remove())
            document.body.classList.remove('loaded')
        }
    })
    const startTimer = (timeTicket, time) => {
        const timer = setInterval(() => {
            timeTicket.textContent = timeManipulate(time)
        }, 1000)
        window.addEventListener('unload', () => clearInterval(timer))
    }
    const callTicket = (event) => {
        const mainNode = event.target.parentNode.parentNode
        const dataId = mainNode.dataset.id
        socket.emit('get current', {'received': socket.id, id: dataId})
        socket.emit('show active', dataTicket)
    }
    const completeTicket = (objectTicket) => {
        nextButton.disabled = false;
        document.querySelectorAll('.result').forEach(item => {
            if (ticketText.textContent === item.querySelector('.result__ticket').textContent) {
                item.remove()
            }
        })
        document.querySelectorAll('.result-notice').forEach(item => {
            if (ticketText.textContent === item.querySelector('.result__ticket').textContent) {
                item.remove()
            }
        })
        socket.emit('complete data', {"number": ticket__text.textContent})
        socket.emit('add data', objectTicket);
        ticket__text.textContent = "";
        service___text.textContent = "";
        Array.from(buttonMain).slice(1).forEach(item => {
            item.disabled = true
        })
        localStorage.removeItem('currentTicket')
        dataTicket = {}

        tickets = tickets.filter(item => item.tvinfo_id !== objectTicket.tvinfo_id)

        disabledButton(false)
    }
    const timeManipulate = (start) => {
        const currentTime = moment().format('HH:mm:ss')
        return moment.utc((moment.duration(currentTime)) - moment.duration(start)).format('HH:mm:ss')
    }

    const disabledButton = (boolean) => {
        document.querySelectorAll('.buttons__block')
            .forEach(item => {
                const callButton = item.querySelector('.call__button')
                const completeButton = item.querySelector('.complete')

                callButton.disabled = boolean
                completeButton.disabled = boolean
            })
    }

    const buttonsTicket=(selector,callback)=>{
        const isCallTicket = isEmpty(dataTicket)
        document.querySelectorAll(selector).forEach(btn=>{
            btn.disabled = !isCallTicket
            btn.addEventListener('click',(event)=>{
                callback(event)
            })
        })
    }

    const generateBlock = (data) => {

        console.log(isEmpty(dataTicket))

        document.querySelector('.op__list').insertAdjacentHTML('beforeend', `
            <div class="result" data-id="${data.tvinfo_id}">
            <div class="container__ticket">
                <span>Талон:</span>
                <span class="result__ticket">${data.number}</span>
            </div>
            <div class="container__service">
                <span>Услуга:</span>
                <span class="result__service">${data.description}</span>
            </div>
              <div class="container__time-queue">
                <span>Время ожидания:</span>
                <span class="time-queue">${timeManipulate(data.time)}</span>
            </div>
            <div class="buttons__block">
             <button class="btn call__button light-green darken-2">Вызвать</button>
             <button class="btn complete light-green darken-2">Обслужен</button>
            </div>
            </div> 
            `)
        document.querySelectorAll('.result').forEach(item => {
            const timeTicket = item.querySelector('.time-queue')
            const resultTicket = item.querySelector('.result__ticket').textContent

            if (data.number === resultTicket) {
                startTimer(timeTicket, data.time)
            }
        })


        buttonsTicket('.call__button',(event)=>{
            const resultId = event.target.parentNode.parentElement.dataset.id

            if(data.tvinfo_id === +resultId){
                console.log('test')
                callTicket(event)
                disabledButton(true)
            }
        })
        buttonsTicket('.complete',(event)=>{
            const result = document.querySelectorAll('.result')

            const parentDiv = event.target.closest('.result')
            const ticketId = parentDiv.getAttribute('data-id')
            result.forEach(res => {
                const dataId = res.dataset.id
                if (dataId === ticketId) {
                    res.remove()
                }
            })

            const ticketNumber = parentDiv.querySelector('.result__ticket').textContent
            const objectTicket = {
                "number": ticketNumber,
                tvinfo_id: ticketId,
                user: userInfo
            }
            completeTicket(objectTicket)
            disabledButton(false)
        })
    }

    const generateQueue = (data) => {
        if (data.length) {
            console.log(data.length)
            data.forEach(item => {
                generateBlock(item)
            })
            return
        }
        if(!Array.isArray(data)){
            generateBlock(data)
        }}


        const generateNotice = (data) => {
            document.querySelector('.op__list h5').insertAdjacentHTML('afterend', `
            <div class="result">
              <div class="container__ticket">
                    <span>Талон:</span>
                    <span class="result__ticket">${data.number}</span>
                </div>
                <div class="container__service">
                    <span>Услуга:</span>
                    <span class="result__service">${data.description}</span>
                </div>
                 <div class="container__notice">
                    <span>Заметка:</span>
                    <span class="result__notice">${data.notice}</span>
                </div>
            </div> 
            `)
        }

        let isVisible
        document.addEventListener('visibilitychange', () => {
            document.visibilityState === "hidden" ?
                isVisible = false
                :
                isVisible = true

        })


        socket.on('await queue', data => {
            tickets.push(data)
            generateQueue(data)

            if (!isVisible) {
                console.log('Вышел за пределы окна')
                showNotification(data)
            }
        })


        const showNotification = (data) => {
            Notification.requestPermission().then((perm) => {
                if (perm === "granted") {
                    const notification = new Notification('Уведомление о талона', {
                        body: `Появился новый талон с номером ${data.number}. Услуга:${data.description}`,
                    });

                    setInterval(() => {
                        notification.close()
                    }, 5000)
                }
            })
        }


        nextButton.addEventListener('click', () => {
            disabledButton(true)
            socket.emit('test data', {'received': socket.id})
        });
        btnComplete.addEventListener('click', () => {

            const objectTicketComplete = {
                tvinfo_id: dataTicket.tvinfo_id,
                number: dataTicket.number,
                user: userInfo
            }
            completeTicket(objectTicketComplete)
            disabledButton(false)
        })

        getTicket()
            .then((data) => {
                tickets.push(...data)
                generateQueue(data)
            })

        socket.on('show notice', (data) => {
            data.map(item => {
                generateNotice(item)
            })
        })
        socket.on('updates queue', data => {
            document.querySelectorAll('.result').forEach(item => {
                if (item.querySelector('.result__ticket').textContent === data) {
                    item.remove()
                }
            })
        })
// });
        socket.on('show test', data => {
            dataTicket = data
            ticket__text.textContent = data.number;
            service___text.textContent = data.description;
            terminal = data.terminalName;
            numberSocket = data.number
            roomId = data.terminalName
            ButtonDisabled(false, true)

            socket.emit('test', {number: ticket__text.textContent})
            socket.emit('clicked', {
                "number": ticket__text.textContent,
                "tvinfo_id": data.tvinfo_id,
                date: Date.now(),
                received: socket.id
            });
        })
        socket.on('await notice', data => {
            dataTicket = data[0]
            data.map(item => {
                document.querySelector('.notice-block h5').insertAdjacentHTML('afterend', `
            <div class="result-notice">
                   <div class="container__ticket">
                    <span>Талон:</span>
                    <span class="result__ticket">${item.number}</span>
                </div>
                <div class="container__service">
                    <span>Услуга:</span>
                    <span class="result__service">${item.description}</span>
                </div>
                 <div class="container__notice">
                    <span>Услуга:</span>
                    <span class="result__notice">${item.notice}</span>
                </div>
                <button class="btn notice-call">Вызвать</button>
            </div> 
            `)
            })
            const noticeButtons = document.querySelectorAll('.notice-call')
            if (noticeButtons) {
                noticeButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        ticket__text.textContent = data[0].ticket;
                        service___text.textContent = data[0].service;
                        ButtonDisabled(false, true)
                        socket.emit('test', {number: ticket__text.textContent})
                        socket.emit('clicked', {
                            "number": ticket__text.textContent,
                            "tvinfo_id": data[0].tvinfo_id,
                            date: Date.now(),
                            received: socket.id
                        });

                    })
                })
            }
        })
        repeatButton.addEventListener('click', () => {
            const data = getStringParams(`${Object.values(window.location.search).join('')}`)
            socket.emit('repeat data', {
                "ticket": document.querySelector('.ticket__text').textContent,
                "terminal": data.service, 'tvinfo_id': dataTicket.tvinfo_id, date: Date.now()
            })
        })
        transferButton.addEventListener('click', () => {
            document.querySelector('.modal-content').insertAdjacentHTML('afterbegin',
                `
            <div class="transfer__block">
            <span>Укажите кабинет для перевода</span>
            <select name="" class="option__transfer browser-default">
            <option disabled selected>Выберите кабинет</option>
            </select>
            <button class="btn accept__transfer">Перевести</button>
            </div>`);
            let transferBlock = document.querySelector('.option__transfer');
            let usersCabinet

            async function fetchGetCab() {
                const data = getStringParams(Object.values(window.location.search).join(''))
                await fetch('/op/getCabinet', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data)
                })
                    .then(res => res.json())
                    .then(data => {
                        usersCabinet = data
                        data.map(num => {
                            let option = document.createElement('option')
                            transferBlock.appendChild(option)
                            option.textContent = num.cab;
                        })
                    })
            }

            fetchGetCab()
            let optionVal;
            transferBlock.addEventListener('change', () => {
                optionVal = transferBlock.value
            });
            let acceptButton = document.querySelector('.accept__transfer');
            acceptButton.addEventListener('click', () => {

                const pointer = Array.from(ticket__text.textContent).splice(1).join('')
                const letter = Array.from(ticket__text.textContent).splice(0, 1).join()
                const noticeText = document.querySelector('.result__notice');
                let getTextNoticeNode
                if (noticeText) {
                    getTextNoticeNode = noticeText.textContent
                }
                const getData = usersCabinet.find(item => item.cab === +optionVal)
                socket.emit('transfer ticket', {
                    "receive": getData,
                    "number": document.querySelector('.ticket__text').textContent,
                    "tvinfo_id": dataTicket.tvinfo_id,
                    service: dataTicket.service,
                    description: dataTicket.description,
                    time: dataTicket.time,
                    notice: inputNotice ? inputNotice.value : getTextNoticeNode
                })
                socket.emit('transfer tv', [{
                    "number": ticket__text.textContent, "cab": optionVal,
                    "Letter": letter, "pointer": pointer
                }])
                dataTicket = {}
                localStorage.removeItem('currentTicket')
                socket.emit('complete data', {"number": ticket__text.textContent})
                ButtonDisabled(true, false)
                document.querySelectorAll('.result').forEach(item => {
                    if (ticketText.textContent === item.querySelector('.result__ticket').textContent) {
                        item.remove()
                    }
                })
                ticket__text.textContent = '';
                service___text.textContent = '';
                if (inputNotice) {
                    inputNotice.value = ''
                }
            });
            document.querySelector('.modal-close').addEventListener('click', () => {
                if (document.querySelector('.transfer__block')) {

                    document.querySelector('.transfer__block').remove();
                }
            })
            document.addEventListener('click', event => {
                if (event.target.className === 'modal-overlay') {
                    if (document.querySelector('.transfer__block')) {
                        document.querySelector('.transfer__block').remove();
                    }
                }
            })
        })
    }
)
    ;
