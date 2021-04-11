const wrapper = document.querySelector('.wrapper');
const take__ticket = document.querySelectorAll('.btn__ticket');
const time =  moment().format('HH:mm:ss');
const socket = io('localhost:5000',{
    transport:['websocket']
});
take__ticket.forEach((item)=>{
    item.addEventListener('click',async()=>{
         await fetch('/getTicket', {
             method: 'POST',
               headers:{
                 'Content-type':'application/json;charset=utf-8'
               },
               body:JSON.stringify({'data':item.getAttribute('data-id')})
     })
         .then(res => res.json())
        .then(data => {
            socket.emit('update queue',data);
            let res = data;
            res.forEach(item=>{
                if(time>=item.end_time || time<=item.start_time){
                    document.body.insertAdjacentHTML('beforeend',`
                    <div class="modal">
                        <div class="modal__wrap">
                          <div class="tv__end">
                               <h5>Время работы услуги завершена</h5>
                          </div>
                        </div>
                    </div>
                    `)
                    setTimeout(()=>{
                        document.location.reload()
                    },3000)
                }else{
                    if(item.ServiceName){
                        wrapper.insertAdjacentHTML('afterend', `<div class="modal__ticket">
        <div class="ticket">
                <div class="tick__logo"><img src="/public/img/logo-tick.png" /></div>
                <div class="org_name">ГБУЗ РБ ГКБ №13 г. Уфа</div>
                <div class="tick__numb">${item.Letter}${item.pointer}</div>
                <div class="tick__date">${moment().format('L')}</div>
        </div>
    </div>`);
                        if(item.pointer===999){
                            fetch('/updatePointerNull',{
                                method:'POST',
                                headers:{
                                    "Content-type":"application/json;charset=utf-8"
                                },
                                body:JSON.stringify({"pointer":item.ServiceName})
                            })
                        }
                        let object = {
                            "id":`${item.id}`,
                            "number": `${item.Letter}${item.pointer}`,
                            "service":`${item.ServiceName}`,
                            "Privilege":`${item.setService}`,
                            "nameTerminal":`${item.setTerminalName}`,
                            "cabinet":`${item.cabinet}`
                        };
                        const fetchData = async()=>{
                            const response = await fetch('/setStateTicket', {
                                method: 'POST',
                                mode:'cors',
                                headers:{
                                    "Content-type":"application/json;charset=utf-8"
                                },
                                body:JSON.stringify(object)
                            })
                            const data = await response.json();
                            console.log(data)

                        };
                        console.log({"data":item.ServiceName});
                        fetch('/updatePointer',{
                            method:'POST',
                            headers:{
                                "Content-type":"application/json;charset=utf-8"
                            },
                            body:JSON.stringify({"data":item.ServiceName})
                        });
                        fetchData();
                    }
                }
            })

        })
         setTimeout(()=>{
             let ticket = document.querySelector('.ticket');
             let start = Date.now();
             let timer = setInterval(()=>{
                 let timePassed = Date.now() - start;
                 if(timePassed>=2000){
                     clearInterval(timer)
                     window.print(ticket);
                     setTimeout(()=>{
                        location.reload()
                     },1000)
                     return
                 }
                 draw(timePassed);
             },20)

             function draw(timePassed) {
                 ticket.style.top = `${timePassed/5}px`;

             }
          },2000)
    })
    });