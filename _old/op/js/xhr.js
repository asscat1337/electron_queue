export const ajax=(url,selector)=>{
     fetch(url,{
            method:'POST',
            headers:{
                "Content-type":"text/plain;charset=UTF-8"
            },
            cache:"no-store"
        })
        .then(responce=>{
            return responce.json();
        })
        .then((data)=>{
                     let div = document.querySelector(selector);
                      div.textContent = `Живая очередь:${data.ticketCol}`
                      if(data.id !=0){
                          let btn1 = document.querySelector('.btn1');
                          btn1.setAttribute('data-id',data.id)
                      }

            })
        .catch(err=>console.error(err)); }
export default ajax;