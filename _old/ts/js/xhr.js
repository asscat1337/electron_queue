export const ajax =(object)=>{
    let url = "./php/ticket.php";

    fetch(url,{
        method:'POST',
        body:JSON.stringify(object)
    }).then((responce)=> {
        return responce.json()
    })
    .then((data)=>{
        let objectDate = new Date();
        
        let date = objectDate.getDate();
        let month = objectDate.getMonth()+1;
        let year = objectDate.getFullYear();

        let day = `${date}.${month}.${year}`;

        let hourse = objectDate.getHours();
        let minute = objectDate.getMinutes();
        let second = objectDate.getSeconds();

        let time = `${hourse}:${minute}:${second}`;

        let body = document.querySelector('body');
        let div = document.createElement('div');
        body.insertAdjacentElement('afterbegin',div)
        div.insertAdjacentHTML('afterbegin',`<div class=renderTicket>
        <div class=ticket>
        <div>Ваш номер</div>
        <div>${data.ticket}</div>
        <div>${data.serviceName}</div>
        <div>Дата:${day}</div>
        <div>Время:${time}</div>
        </div>
        </div>`);
        div.className = 'window_ticket';
    })
    .catch(err=>console.error(err))
}