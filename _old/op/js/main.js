import {ajax} from './xhr.js'
import {xhrText} from './xhrText.js';

import {showTicket} from './xhrShowTicket.js';

let opText = document.querySelector('.op__text');
let opCalledAgain = document.querySelector('.opCalledAgain');
let btn1 = document.querySelector('.btn1');
let col = document.querySelector('.col');
let btn2 = document.querySelector('.btn2');
let btn3 = document.querySelector('.btn3');
let opTicket = document.querySelector('.opTicket');
let opBlockQueue = document.querySelector('.op__block-queue p');
let opBlockServed = document.querySelector('.op__block-served');
let item = "";
    setInterval(()=>{
        fetch('./php/actionticket.php',{
            method:'POST',
        })
        .then(response=>response.json())
        .then(data=>{
            data.map(item=>{
                if(localStorage.getItem('number')===item.id){
                    return false;
                }else{
                    opBlockQueue.insertAdjacentHTML('afterend',`<div class=item data-id=${item.id}><span>${item.number}<span>-${item.service}</div>`)
                }
                localStorage.setItem('number',item.id);
            })
            btn1.addEventListener('click',()=>{
                let attr = btn1.getAttribute('data-id');
                item = document.querySelector(`.item[data-id='${attr}']`);
                item.remove();
            })
        })
        ajax("./php/echoInf.php",".col");
    },10000)

    btn1.addEventListener('click',()=>{ 
        let json = btn1.getAttribute('data-id');
       let objectJson = {
        "id":json    
        }
        xhrText("./php/opNext.php",objectJson);
        opCalledAgain.textContent = "";
        localStorage.clear();
    })
btn2.addEventListener('click',()=>{
        console.log(opTicket.textContent);
        let ticket = opTicket.textContent
       let objectJson = {
        "ticket":ticket   
        }
    showTicket('./php/calledAgain.php',objectJson);
})
btn3.addEventListener('click',()=>{
    let ticket = opTicket.textContent;
    let ticketArr = ticket.split("-")
    let objectJson = {
        "ticket":ticketArr[0]
    }
    showTicket('./php/inQueue.php',objectJson);
    //opBlockQueue.insertAdjacentHTML('afterend',`<span>${ticket}</span>`);
    opTicket.textContent = "";
})
let btnShow = document.querySelector('.show__queue')

btnShow.addEventListener('click',()=>{
 document.querySelector('.op__block-queue').classList.toggle('hide')
})