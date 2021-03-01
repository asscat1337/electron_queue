const socket = io('/');
const queueText = document.querySelector('.queue__text');
const ticketText =document.querySelector('.ticket__text');
const nextButton = document.querySelector('.next__button');
const repeatButton = document.querySelector('.repeat__button');
const listPostponed = document.querySelector('.list__postponed');
const transferButton = document.querySelector('.transfer__button');
const buttonMain = document.querySelectorAll('.op__main-button button');
const ticket__text = document.querySelector('.ticket__text')
const service___text = document.querySelector('.service__text');

let number,service = '';
document.addEventListener('DOMContentLoaded',()=>{
    socket.on('await queue',data=>{
        queueText.textContent = `Живая очередь:${data}`;
    });
});
nextButton.addEventListener('click',()=>{
  fetch('/showTicket',{
      method:'POST',
      headers:{
          "Content-type":"application/json",
      }
  })
      .then(res=>res.json())
      .then(data=>{
          for (let item of data){
            ticket__text.innerHTML = item.number;
             service___text.innerHTML = item.service;
              let object = {
                  "cabinet": item.cabinet,
                  "date": moment().format('L'),
                  "time": moment().format('LTS'),
                  "Privilege": item.Privilege,
                  "number": item.number,
                  "terminalName": item.terminalName,
                  "service": item.service
              }
              for (let i=1;i<buttonMain.length;i++) {
                  if (ticketText.textContent) {
                      buttonMain[i].disabled = false
                  }
              }
              socket.emit('new data',object)
                  const fetchData = async ()=>{
                      return await fetch('/setTvInfo',{
                          method:'POST',
                          headers:{
                              "Content-type":"application/json;charset=utf-8"
                          },
                          body:JSON.stringify(object)
                      })
                          .then(res=>console.log(res.status))
                  };
              //fetchData();
          }
      })
});
repeatButton.addEventListener('click',()=>{
    console.log(document.querySelector('.ticket__text').textContent);
   fetch('/callTicketAgain',{
       method:'POST',
       headers:{
           "Content-type":"application/json;charset=utf-8"
       },
       body:JSON.stringify({"ticket":document.querySelector('.ticket__text').textContent})
   })
})
listPostponed.addEventListener('click',()=>{
    let sum = null;
   const opMain =  document.querySelector('.op__main');
   opMain.classList.add('hide');
       const renderTemplate = `<div class="show__postponed">
        <div class="close">Закрыть</div>
        <div class="list"></div>
        <button class="callTicket">Вызвать</button>
        </div>`;
        socket.on('new data',data=>{
            if (!data.length) return;
            if(data.length !== sum){
                let parent = document.querySelector('.list');
                let child = document.querySelector('.result');
                sum = data.length;
                if(parent.contains(child)){
                    let lastEl = data.splice(-1,1);
                    lastEl.forEach(item=>{
                        if(item.number===document.querySelector('.number').textContent){
                            return false;
                        }else{
                            document.querySelector('.list').insertAdjacentHTML('afterbegin',
                                `<div class="result">
                                        <span class="number">${item.number}</span>
                                        <span class="service">${item.service}</span>
                                   </div>`)
                        }
                    })
                }else{
                    data.forEach(item=>{
                        document.querySelector('.list').insertAdjacentHTML('afterbegin',
                            `<div class="result"><span class="number">${item.number}</span><span class="service">${item.service}</span></div>`)
                    })
                }
            }
            console.log(sum)
            if(document.querySelector('body').contains(document.querySelector('.list'))){
                document.querySelector('.list').addEventListener('click',(event)=>{
                    let target = event.target;
                    document.querySelectorAll('.result').forEach(item=>{
                        if(item.contains(document.querySelector('.active'))){
                            item.classList.remove('active')
                        }
                    })
                    if(target.tagName==="DIV"){
                        target.classList.add('active')
                    }else{
                        return false
                    }
                })
            }
       });
    document.body.insertAdjacentHTML('afterbegin',renderTemplate);

    const blockClose = document.querySelector('.close');
    blockClose.addEventListener('click',()=>{
        document.querySelector('.show__postponed').remove()
        opMain.classList.remove('hide');
    })
    document.querySelector('.callTicket').addEventListener('click',()=>{
        document.querySelectorAll('.active').forEach(item=>{
             number = item.children[0].textContent;
             service = item.children[1].textContent;
            ticket__text.innerHTML = number;
            service___text.innerHTML = service;
            fetch('/op/findTicketState',{
                method:'POST',
                headers:{
                    "Content-type":"application/json;charset=utf-8"
                },
                body:JSON.stringify({"number":number,"service":service})
            })
                .then(res=>res.json())
                .then(data=>{
                    if(data){
                        item.remove()
                    }
                });
        })
    })
});
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
    })
    document.querySelector('.remove__transfer').addEventListener('click',()=>{
        document.querySelector('.transfer__block').remove();
    })
});
