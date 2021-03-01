import {xhr} from './xhr.js';
// import {xhrText1} from "./xhrText1.js";
// import {xhrText2} from "./xhrText2.js";
//import {func} from "../op/js/main.js";
let opWrapp = document.querySelector('.ticket__wrap');

window.addEventListener('DOMContentLoaded',()=>{
    setInterval(() => {
            xhr(opWrapp,"./php/echoTicket.php");    
    }, 10000);
})
