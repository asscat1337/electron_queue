const wrapper = document.querySelector('.wrapper');
const take__ticket = document.querySelectorAll('.btn__ticket');
const time =  moment().format('HH:mm:ss');
const socket = io('localhost:5000',{
    transport:['websocket']
});
// const socket1 = io('localhost:3003',{
//     transport:['websocket'],
//     credentials:true
// });
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
take__ticket.forEach((item)=> {
    item.addEventListener('click', async () => {
        await fetch('/ts/getTicket', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({'data': item.getAttribute('data-id')})
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
                <div class="tick__logo"><img src="/public/img/logo-tick.png" /></div>
                <div class="org_name">ГБУЗ РБ ГКБ №13 г. Уфа</div>
                <div class="tick__numb">${item.Letter}${item.pointer}</div>
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
                            "id": `${item.id}`,
                            "number": `${item.Letter}${item.pointer}`,
                            "service": `${item.ServiceName}`,
                            "Privilege": `${item.setService}`,
                            "nameTerminal": `${item.setTerminalName}`,
                            "cabinet": `${item.cabinet}`
                        };
                        const fetchData = async () => {
                            try {
                                const response = await fetch('ts/setStateTicket', {
                                    method: 'POST',
                                    headers: {
                                        "Content-type": "application/json;charset=utf-8"
                                    },
                                    body: JSON.stringify(object)
                                })
                                const data = await response.json();
                                 socket.emit('update queue', data);
                                 socket.emit('show tv', data);

                            } catch (e) {
                                console.log(`Произошла ошибка:${e}`);
                            }
                        };

                        fetchData();
                    }

                });
                let ticket = document.querySelector('.ticket');
                if (ticket) {
                    setTimeout(() => {
                        window.print()
                        setTimeout(() => {
                            document.location.reload()
                        }, 500)
                    }, 1000)
                }
            })
    });
});