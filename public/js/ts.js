const wrapper = document.querySelector('.wrapper');
const take__ticket = document.querySelectorAll('.btn__ticket');
const time =  moment().format('HH:mm:ss');
const socket = io('http://localhost:8000',{
    transport:['websocket'],
    forceNew:true
});
window.addEventListener('unload',()=>{
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
socket.on('connect',()=>{
    socket.emit('room',Object.values(getQueryStringParams(window.location.search)).join(''))
})

const url = new URL(window.location.href);
const terminalId = url.searchParams.get('id')

take__ticket.forEach((item)=> {
    item.addEventListener('click', async (event) => {
        event.target.closest('.take__ticket').classList.add('disable')
        document.querySelector('.wrapper').classList.add('active')
        await fetch('/ts/getTicket', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({'data': item.getAttribute('data-id'),terminalId})
        })
            .then(res => res.json())
            .then(data => {
                let res = data;
                res.forEach(item => {
                    if (time >= item.end_time || time <= item.start_time) {
                        document.body.insertAdjacentHTML('beforeend', `
                    <div class="modal">
                        <div class="modal__wrap">
                          <div class="tv__end">
                               <h5>Время работы услуги завершена</h5>
                          </div>
                        </div>
                    </div>
                    `)
                        setTimeout(() => {
                            document.location.reload()
                        }, 3000)
                    } else {
                        wrapper.insertAdjacentHTML('afterend', `<div class="modal__ticket">
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
                <div class="tick__date">${moment().format('L')}</div>
        </div>
</div>
    </div>`);
                        if (item.pointer === 999) {
                            async function fetchReset() {
                                await fetch('ts/updatePointerNull', {
                                    method: 'POST',
                                    headers: {
                                        "Content-type": "application/json;charset=utf-8"
                                    },
                                    body: JSON.stringify({
                                        "service": item.ServiceName,
                                        "terminal": item.setTerminalName
                                    })
                                })
                            }

                            fetchReset()
                        }
                        let object = {
                            "id": `${item.service_id}`,
                            "description":item.description,
                            "number": `${item.letter}${item.pointer}`,
                            "service": `${item.name}`,
                            "nameTerminal": `${terminalId}`,
                            "cabinet": `${item.cabinet}`,
                            "type":item.type,
                            "pointer":item.pointer
                        };
                        const fetchData = async () => {
                            try {
                                 await fetch('ts/setStateTicket', {
                                    method: 'POST',
                                    headers: {
                                        "Content-type": "application/json;charset=utf-8"
                                    },
                                    body: JSON.stringify(object)
                                })
                                    .then(res=>res.json())
                                    .then(data=>{
                                        socket.emit('update queue', data);
                                        socket.emit('show tv', data);
                                        let ticket = document.querySelector('.ticket');
                                        const delay = ms => new Promise(((resolve, reject) => setTimeout(resolve,ms)))
                                        if(ticket){
                                            delay(2000).then(()=>{
                                                window.print()
                                                delay(1000).then(()=>{
                                                    document.querySelector('.modal__ticket').remove()
                                                    document.querySelector('.wrapper').classList.remove('active')
                                                })
                                            })
                                        }
                                    })

                            } catch (e) {
                                console.log(`Произошла ошибка:${e}`);
                            }
                        };
                        fetchData();
                    }

                });
            })
    });
});