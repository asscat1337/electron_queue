const socket = io.connect('http://localhost:5000',{
	withCredentials:true,
	extraHeaders:{
	'my-custom-headers':'abcd'
}
});
const ticketText =document.querySelector('.ticket__text');
const nextButton = document.querySelector('.next__button');
const repeatButton = document.querySelector('.repeat__button');
const transferButton = document.querySelector('.transfer__button');
const buttonMain = document.querySelectorAll('.op__main-button button');
const ticket__text = document.querySelector('.ticket__text')
const service___text = document.querySelector('.service__text');
const inputNotice = document.querySelector('.input-notice')

let number,service,terminal = '';
let numberSocket,roomId;
const btnComplete = document.querySelector('.next__complete');
let isDisabled = true
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

const getStringParams = query=>{
    return query.slice(1).split('&').reduce((params,param)=>{
        let [key,value] = param.split('=')
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
    },{})
}

document.addEventListener('DOMContentLoaded',()=>{
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals,{
        onOpenStart:function () {
            document.querySelector('.modal').style.zIndex = 9999
        }
    });
    socket.on('connect',()=>{
        socket.emit('room',Object.values(getQueryStringParams(`${window.location.search}`)).join(''))
        socket.emit('connect data',getStringParams(`${Object.values(window.location.search).join('')}`))
        if(document.querySelectorAll('.preloader')){
            document.querySelectorAll('.preloader').forEach(item=>item.remove())
            document.body.classList.remove('loaded')
        }
    })
    window.addEventListener('unload',()=>{
        socket.emit('end')
    })
    socket.on('await queue',data=>{
        document.querySelector('.op__list h5').insertAdjacentHTML('afterend',`
            <div class="result">
            <span class="result__ticket">${data.number}</span>
            <span class="result__service">${data.service}</span>
            </div> 
            `)
        let list = document.querySelectorAll('.result')
        list.forEach(item=> {
            item.addEventListener('click', () => {
                list.forEach(el=>el.classList.remove('active'))
                item.classList.add('active')
            })
        });
            })
    nextButton.addEventListener('click',(event)=>{
        isDisabled = true
        socket.emit('test data',{'received':socket.id})
    });
    socket.on('show data',data=>{
        data.map(item=>{
                document.querySelector('.op__list h5').insertAdjacentHTML('afterend',`
            <div class="result">
            <span class="result__ticket">${item.number}</span>
            <span class="result__service">${item.service}</span>
            </div> 
            `)
        })
        let list = document.querySelectorAll('.result')
            /// дублируется код,позже переделать
        list.forEach(item=> {
            item.addEventListener('click', () => {
                list.forEach(el=>el.classList.remove('active'))
                item.classList.add('active')
            })
        });
    })
    socket.on('show notice',(data)=>{
        //if(!data.length) return false;
        data.map(item=>{
            document.querySelector('.op__list h5').insertAdjacentHTML('afterend',`
            <div class="result">
            <span class="result__ticket">${item.number}</span>
            <span class="result__service">${item.service}</span>
            <span class="result__notice">${item.notice}</span>
            </div> 
            `)
        })
        let list = document.querySelectorAll('.result')
        /// дублируется код,позже переделать
        list.forEach(item=> {
            item.addEventListener('click', () => {
                list.forEach(el=>el.classList.remove('active'))
                item.classList.add('active')
            })
        });
    })
    socket.on('updates queue',data=>{
            document.querySelectorAll('.result').forEach(item=>{
                console.log(item.querySelector('.result__ticket').textContent)
                if(item.querySelector('.result__ticket').textContent===data){
                    item.remove()
                }
            })
    })
});
let dataTicket
socket.on('show test',data=>{
        dataTicket = data
        ticket__text.innerHTML = data.number;
        service___text.innerHTML = data.service;
        terminal = data.terminalName;
        numberSocket=data.number
        roomId=data.terminalName
        for (let i=1;i<buttonMain.length;i++) {
            if (ticketText.textContent) {
                buttonMain[i].disabled = false
                nextButton.disabled = true
            }
        }
        socket.emit('test',{number:ticket__text.textContent})
        socket.emit('clicked',{"number":ticket__text.textContent,"tvinfo_id":data.tvinfo_id,date:Date.now(),received:socket.id});
})
socket.on('await notice',data=>{
    dataTicket = data
    data.map(item=>{
        document.querySelector('.notice-block h5').insertAdjacentHTML('afterend',`
            <div class="result-notice">
                <span class="result__ticket">${item.number}</span>
                <span class="result__notice">${item.notice}</span>
                <span class="result__service">${item.service}</span>
                <button class="btn notice-call">Вызвать</button>
            </div> 
            `)
    })
    const noticeButtons = document.querySelectorAll('.notice-call')
    if(noticeButtons){
        noticeButtons.forEach(button=>{
            button.addEventListener('click',(e)=>{
                console.log(data[0].tvinfo_id)
                const {parentNode} = e.target
                const ticket = parentNode.querySelector('.result__ticket')
                const service = parentNode.querySelector('.result__service')
                ticket__text.innerHTML = ticket.textContent;
                service___text.innerHTML = service.textContent;
                for (let i=1;i<buttonMain.length;i++) {
                    if (ticketText.textContent) {
                        buttonMain[i].disabled = false
                        nextButton.disabled = true
                    }
                }
                socket.emit('test',{number:ticket__text.textContent})
                socket.emit('clicked',{"number":ticket__text.textContent,"tvinfo_id":data[0].tvinfo_id,date:Date.now(),received:socket.id});

            })
        })
    }
    })
btnComplete.addEventListener('click',()=>{
    isDisabled = true
    nextButton.disabled = false;
    document.querySelectorAll('.result').forEach(item=>{
        if(ticketText.textContent === item.querySelector('.result__ticket').textContent){
            item.remove()
        }
    })
    document.querySelectorAll('.result-notice').forEach(item=>{
        if(ticketText.textContent === item.querySelector('.result__ticket').textContent){
            item.remove()
        }
    })
    socket.emit('complete data',{"number":ticket__text.textContent})
    socket.emit('add data',{"number":ticket__text.textContent,"tvinfo_id":dataTicket.tvinfo_id,user:getStringParams(`${Object.values(window.location.search).join('')}`)});
    ticket__text.textContent = "";
    service___text.textContent = "";
   Array.from(buttonMain).slice(1).forEach(item=>{
       item.disabled = true
   })
})
repeatButton.addEventListener('click',()=>{
    const data = getStringParams(`${Object.values(window.location.search).join('')}`)
    socket.emit('repeat data',{"ticket":document.querySelector('.ticket__text').textContent,
        "terminal":data.service,'tvinfo_id':dataTicket.tvinfo_id,date:Date.now()})
})
socket.on('complete sound',(data)=>{
   isDisabled = data.isDisabled
 })
transferButton.addEventListener('click',()=>{
    document.querySelector('.modal-content').insertAdjacentHTML('afterbegin',
        `
            <div class="transfer__block">
            <span>Укажите кабинет для перевода</span>
            <select name="" class="option__transfer browser-default">
            <option disabled selected>Выберите кабинет</option>
            </select>
            <button class="btn accept__transfer" ${isDisabled ? "disabled" : ""}>Перевести</button>
            </div>`);
    let transferBlock = document.querySelector('.option__transfer');
    async function fetchGetCab(){
        const data = getStringParams(Object.values(window.location.search).join(''))
        await fetch('/op/getCabinet',{
            method:'POST',
            headers:{
                'Content-type':'application/json;charset=utf-8'
            },
            body:JSON.stringify(data)
        })
            .then(res=>res.json())
            .then(data=>{
                data.map(num=>{
                    let option = document.createElement('option')
                    transferBlock.appendChild(option)
                    option.textContent = num.cab;
                })
            })
    }
    fetchGetCab()
    let optionVal;
    transferBlock.addEventListener('change',()=>{
        optionVal = transferBlock.value
    });
    let acceptButton = document.querySelector('.accept__transfer');
    acceptButton.addEventListener('click',()=>{
        const pointer = Array.from(ticket__text.textContent).splice(1).join('')
        const letter = Array.from(ticket__text.textContent).splice(0,1).join()
        const noticeText = document.querySelector('.result__notice');
        let getTextNoticeNode
        if (noticeText){
            getTextNoticeNode = noticeText.textContent
        }
        socket.emit('transfer ticket',{
            "cabinet":optionVal,
            "number": document.querySelector('.ticket__text').textContent,
            "tvinfo_id":dataTicket.tvinfo_id,
            service:service___text.textContent,notice:inputNotice ? inputNotice.value:getTextNoticeNode
        })
        socket.emit('transfer tv',[{"number":ticket__text.textContent,"cab":optionVal,
            "Letter":letter,"pointer":pointer}])
   socket.emit('complete data',{"number":ticket__text.textContent})
        for (let i=1;i<buttonMain.length;i++) {
            if (ticketText.textContent) {
                buttonMain[i].disabled = true
                nextButton.disabled = false
            }
        }
        document.querySelectorAll('.result').forEach(item=>{
            if(ticketText.textContent === item.querySelector('.result__ticket').textContent){
                item.remove()
            }
        })
        ticket__text.textContent = '';
        service___text.textContent = '';
        isDisabled = true
    });
    document.querySelector('.modal-close').addEventListener('click',()=>{
        if(document.querySelector('.transfer__block')){

            document.querySelector('.transfer__block').remove();
        }
    })
    document.addEventListener('click',event=>{
        if(event.target.className === 'modal-overlay'){
            if(document.querySelector('.transfer__block')){
                document.querySelector('.transfer__block').remove();
            }
        }
    })
});
