const time = document.querySelector('.time');
const wrapper = document.querySelector('.wrapper');
const take__ticket = document.querySelectorAll('.btn__ticket');
take__ticket.forEach(item=>{
    item.addEventListener('click',()=>{
           fetch('/getTicket', {
             method: 'POST',
               headers:{
                 'Content-type':'application/json;charset=utf-8'
               },
               body:JSON.stringify({'data':item.getAttribute('data-id')})
     })
         .then(res => res.json())
        .then(data => {
            let res = data;
            console.log(res)
            res.forEach(item=>{
                console.log(item);
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
                    console.log(item.ServiceName)
                    let object = {
                        "number": `${item.Letter}${item.pointer}`,
                        "time":moment().format('LTS'),
                        "date":moment().format('L'),
                        "service":`${item.ServiceName}`,
                        "Privilege":`${item.setService}`,
                        "nameTerminal":`${item.setTerminalName}`,
                        "cabinet":`${item.cabinet}`
                    };
                    console.log(JSON.stringify(object));
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
            })

        })
         setTimeout(()=>{
             console.log(location);
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