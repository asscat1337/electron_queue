const wrapper = document.querySelector('.wrapper')
const take__ticket = document.querySelectorAll('.btn__ticket');
const abortController = new AbortController()

const time = moment().format('HH:mm:ss');
console.log(time)
const socket = io('http://localhost:8000', {
    transport: ['websocket'],
    forceNew: true
});
window.addEventListener('unload', () => {
    socket.emit('end')
})


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
socket.on('connect', () => {
    socket.emit('room', Object.values(getQueryStringParams(window.location.search)).join(''))
    if (document.querySelectorAll('.preloader')) {
        document.querySelectorAll('.preloader').forEach(item => item.remove())
        document.body.classList.remove('loaded')
    }
})

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

const url = new URL(window.location.href);
const terminalId = url.searchParams.get('id')


const delay = ms => new Promise(((resolve) => setTimeout(resolve, ms)))

let serviceArray = []

const modalTicket = (insertSelect, item) => {
    insertSelect.insertAdjacentHTML('afterend', `<div class="modal__ticket">
<div class="wrapper-ticket">
        <div class="ticket">
                <div class="tick__logo"><img src="/public/img/logo-tick.png"/></div>
                <div class="org_name">ГБУЗ РБ ГКБ №13 г. Уфа</div>
                <div class="tick__numb">
		  <span class="tick__number-letter">${item.letter.toUpperCase()}</span>
		  <span class="tick__numb-pointer">${item.pointer}</span>
		</div>
		<div class="tick__service">
			<p class="service-name">Название услуги:</p>
			<span>${item.description}</span>
		</div>
                <div class="tick__date">${moment().format('DD.MM.YYYY')}</div>
        </div>
</div>
    </div>`)
}

const serviceData = async () => {
    const response = await fetch(`/ts/get-service${url.search}`)
    const data = await response.json()

    return data
}

const generateTicketNumber = (letter, pointer) => {

    return `${letter}${pointer}`
}

window.addEventListener('load', () => {
    serviceData()
        .then((data) => serviceArray.push(...data))
})

socket.on('new pointer', (data) => {
    const {id, pointer} = data
    serviceArray = serviceArray.map(item => {
        if (item.service_id === id) {
            return {
                ...item,
                pointer
            }
        }
        return item
    })

})

const endModal = () => {
    document.body.insertAdjacentHTML('beforeend', `
                    <div class="modal">
                        <div class="modal__wrap">
                          <div class="tv__end">
                               <h5>Время работы услуги завершена</h5>
                          </div>
                        </div>
                    </div>
                    `)
}

take__ticket.forEach((ticketBtn) => {
    ticketBtn.addEventListener('click', async (event) => {
        const target = event.target.closest('.take__ticket')
        const dataId = +event.target.closest('.btn__ticket').dataset.id
        target.classList.add('disable')
        ticketBtn.classList.add('btn__active')
        document.querySelector('.wrapper').classList.add('active')
        const findService = serviceArray.find(item => item.service_id === dataId)

        if (time >= findService.end_time || time <= findService.start_time) {
            endModal()
            setTimeout(() => {
                document.location.reload()
            }, 3000)

            return
        }
        modalTicket(wrapper, findService)
        if (findService.pointer === 999) {
            async function fetchReset() {
                await fetch('ts/updatePointerNull', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json;charset=utf-8"
                    },
                    body: JSON.stringify({
                            "service": findService.ServiceName,
                            "terminal": findService.setTerminalName
                        }),
                })
            }

            fetchReset()
        }
        const object = {
            "id": findService.service_id,
            "description": findService.description,
            "number": generateTicketNumber(findService.letter, findService.pointer),
            "service": findService.name,
            "nameTerminal": terminalId,
            "cabinet": findService.cabinet,
            "type": findService.type,
            "pointer": findService.pointer
        };
        const fetchData = async () => {
            const newPointer = ++findService.pointer
            socket.emit('update pointer', {
                id: findService.service_id,
                pointer: newPointer,
                room: terminalId
            })
            await fetch('ts/setStateTicket', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json;charset=utf-8"
                },
                body: JSON.stringify(object),
                signal: abortController.signal
            })
                .then(res => res.json())
                .then(newTicket => {
                    const ticket = document.querySelector('.ticket');
                    if (ticket) {
                        delay(2000).then(() => {
                            window.print()
                            delay(1000).then(() => {
                                document.querySelector('.modal__ticket').remove()
                                document.querySelector('.wrapper').classList.remove('active')
                                socket.emit('update queue', newTicket);
                                socket.emit('show tv', newTicket);
                                target.classList.remove('disable')
                                ticketBtn.classList.remove('btn__active')
                            })
                        })
                    }
                })
                .catch(e =>{
                   setTimeout(()=>{
                       document.querySelector('.modal__ticket').remove()
                       document.querySelector('.wrapper').classList.remove('active')
                       target.classList.remove('disable')
                   },5000)
                })
        };
        fetchData();
    });
});