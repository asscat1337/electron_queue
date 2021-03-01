import {clock} from './time.js';
import { ajax } from './xhr.js';

let buttonTicket = document.querySelectorAll('.button_ticket');


buttonTicket.forEach(item=>{
item.addEventListener('click',event=>{
    let printTicket = document.querySelector('.ticket')
    let id = item.getAttribute('data-id');
    let object = {
        "id":id
    }
    console.log(object);
    ajax(object);
     setTimeout(() => {
         window.print(printTicket);
         setTimeout(()=>{
             document.location.href = "index.php";
         },4000)
    },2000);
})
})


setInterval(()=>{
    clock();
},1000);