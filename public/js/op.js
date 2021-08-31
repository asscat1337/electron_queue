const socket = io('localhost:5000',{
    transport: ['websocket'],
    credentials: true
});
// const socket1 = io('localhost:3003',{
//     transport:['websocket'],
//     credentials:true
// });
const ticketText =document.querySelector('.ticket__text');
const nextButton = document.querySelector('.next__button');
const repeatButton = document.querySelector('.repeat__button');
const transferButton = document.querySelector('.transfer__button');
const buttonMain = document.querySelectorAll('.op__main-button button');
const ticket__text = document.querySelector('.ticket__text')
const service___text = document.querySelector('.service__text');

let number,service,terminal = '';
let numberSocket,roomId;
const socketId = document.querySelector('.terminalVal').value;
const cabId = document.querySelector('.cabinetVal').value;
const btnComplete = document.querySelector('.next__complete');

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
    })
    // socket.on('connect',()=>{
    //     socket.emit('room',Object.values(getQueryStringParams(`${window.location.search}`)).join(''))
    // })
    window.addEventListener('unload',()=>{
        socket.emit('end')
    })
    socket.emit('connect data',{'terminal':socketId,'user':localStorage.getItem('user')})
    socket.on('await queue',data=>{
        console.log(data)
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
        let object = {
            "cabinet": data.cabinet,
            "date": moment().format('L'),
            "time": moment().format('LTS'),
            "Privilege": data.Privilege,
            "number": data.number,
            "terminalName": data.terminalName,
            "service": data.service
        }
        numberSocket=data.number
        roomId=data.terminalName
        for (let i=1;i<buttonMain.length;i++) {
            if (ticketText.textContent) {
                buttonMain[i].disabled = false
                nextButton.disabled = true
            }
        }
        socket.emit('test',{number:ticket__text.textContent})
        socket.emit('clicked',{"number":ticket__text.textContent,"cab":cabId,
            "terminal":socketId,tvinfo_id:data.tvinfo_id});
})
btnComplete.addEventListener('click',()=>{
    const data = getStringParams(`${Object.values(window.location.search).join('')}`)
    nextButton.disabled = false;
    document.querySelectorAll('.result').forEach(item=>{
        if(ticketText.textContent === item.querySelector('.result__ticket').textContent){
            item.remove()
        }
    })
    socket.emit('complete data',{"number":ticket__text.textContent, "terminal":data.service})
    socket.emit('add data',{"number":ticket__text.textContent,'terminal':socketId,
        "tvinfo_id":dataTicket.tvinfo_id});
    ticket__text.textContent = "";
    service___text.textContent = "";
   Array.from(buttonMain).slice(1).forEach(item=>{
       item.disabled = true
   })
})
repeatButton.addEventListener('click',()=>{
    const data = getStringParams(`${Object.values(window.location.search).join('')}`)
    console.log(dataTicket.tvinfo_id)
    socket.emit('repeat data',{"ticket":document.querySelector('.ticket__text').textContent,
        "terminal":data.service,'tvinfo_id':dataTicket.tvinfo_id})
})
transferButton.addEventListener('click',()=>{
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
        socket.emit('transfer ticket',{
            "cabinet":optionVal,"number": document.querySelector('.ticket__text').textContent,
            "terminal":socketId,"service":document.querySelector('.service__text').textContent})
        socket.emit('check ticket',{"number":ticket__text.textContent,'terminal':Object.values(getQueryStringParams(`${window.location.search}`)).join('')})
        socket.emit('transfer tv',[{"number":ticket__text.textContent,'setTerminalName':socketId,"cab":optionVal,
            "Letter":letter,"pointer":pointer}])
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