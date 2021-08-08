const socket = io('http://localhost:5001');
const btn__active = document.querySelector('.btn-active');

socket.on('connect',(event)=>console.log(`Connected ${event}`));

socket.on('wait data',data=>console.log(`Ожидание ${data}`))
    socket.on('new data',(data)=> {
        setInterval(()=>{
            console.log(data)
        },5000)
    })