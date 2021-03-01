export const showTicket=(url,objectJson)=>{
    fetch(url,{
           method:'POST',
           headers:{
               "Content-type":"text/plain;charset=UTF-8"
           },
           cache:"no-store",
           body:JSON.stringify(objectJson)
       })
       .catch(err=>console.error(err)); 
    }
export default showTicket;