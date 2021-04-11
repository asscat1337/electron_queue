const socket = io('localhost:5000',{
    transport: ['websocket'],
    credentials: true
});
const socket1 = io('localhost:3003',{
    transport:['websocket'],
    credentials:true
});
const ticketText =document.querySelector('.ticket__text');
const nextButton = document.querySelector('.next__button');
const repeatButton = document.querySelector('.repeat__button');
const transferButton = document.querySelector('.transfer__button');
const buttonMain = document.querySelectorAll('.op__main-button button');
const ticket__text = document.querySelector('.ticket__text')
const service___text = document.querySelector('.service__text');
const callBtn = document.querySelector('.call__button')
let number,service,terminal = '';
let numberSocket,roomId;
const socketId = document.querySelector('.terminalVal').value;
document.addEventListener('DOMContentLoaded',()=>{
    socket1.on('connect',()=>{
        socket1.emit('room',socketId)
    })
    socket.emit('loaded data',socketId);
    socket.on('await queue',data=>{
        console.log(data)
            document.querySelector('.op__list').insertAdjacentHTML('afterbegin',`
            <div class="result">
            <span class="result__ticket">${data.ticket}</span>
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
    socket.on('show data',data=>{
        data.map(item=>{
            document.querySelector('.op__list').insertAdjacentHTML('afterbegin',`
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
});
callBtn.addEventListener('click',()=>{
    document.querySelectorAll('.active').forEach(item=>{
       const textTicket = item.querySelector('.result__ticket');
        const serviceText = item.querySelector('.result__service');
       ticketText.textContent = textTicket.textContent;
        service___text.textContent = serviceText.textContent;
        socket.emit('add data',{"number":textTicket.textContent,"terminalName":socketId});
        socket1.emit('clicked',textTicket.textContent);
        repeatButton.disabled = false;
        transferButton.disabled = false;
        item.remove()
    })
})
nextButton.addEventListener('click',()=>{
  fetch('/showTicket',{
      method:'POST',
      headers:{
          "Content-type":"application/json",
      }
  })
      .then(res=>res.json())
      .then(data=>{
          console.log(data)
          for (let item of data){
            ticket__text.innerHTML = item.number;
             service___text.innerHTML = item.service;
             terminal = item.terminalName;
              let object = {
                  "cabinet": item.cabinet,
                  "date": moment().format('L'),
                  "time": moment().format('LTS'),
                  "Privilege": item.Privilege,
                  "number": item.number,
                  "terminalName": item.terminalName,
                  "service": item.service
              }
              numberSocket=item.number
              roomId=item.terminalName
              for (let i=1;i<buttonMain.length;i++) {
                  if (ticketText.textContent) {
                      buttonMain[i].disabled = false
                  }
              }
              socket.emit('add data',object);
              socket1.emit('clicked',item.number);
          }
      })
    document.querySelectorAll('.result').forEach(item=>{
        if(ticketText.textContent === item.querySelector('.result__ticket').textContent){
            item.remove()
        }
    })
});
repeatButton.addEventListener('click',()=>{
    socket1.emit('repeat data',{"ticket":document.querySelector('.ticket__text').textContent,"terminalName":terminal})
})
transferButton.addEventListener('click',()=>{
    document.body.insertAdjacentHTML('afterbegin',
        `<div class="transfer__block">
            <span>Укажите кабинет для перевода</span>
            <select name="" class="option__transfer">
            <option disabled selected>Выберите кабинет</option>
            </select>
            <button class="accept__transfer">Перевести</button>
            <button class="remove__transfer">Закрыть</button>
            </div>`);
    let transferBlock = document.querySelector('.option__transfer');
    for(let i=1;i<=10;i++){
        let option = document.createElement('option')
        transferBlock.appendChild(option)
        option.textContent = i;
    }
    let optionVal;
    transferBlock.addEventListener('change',()=>{
        optionVal = transferBlock.value
    });
    let acceptButton = document.querySelector('.accept__transfer');
    acceptButton.addEventListener('click',()=>{
        fetch('/updateTvinfo',{
            method:'POST',
            headers:{
                "Content-type":"application/json;charset=utf-8"
            },
            body:JSON.stringify({"isChecked":0,"cabinet":optionVal,"number": document.querySelector('.ticket__text').textContent})
        })
    });
    document.querySelector('.remove__transfer').addEventListener('click',()=>{
        document.querySelector('.transfer__block').remove();
    })
});