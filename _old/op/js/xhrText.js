export const xhrText = (url,objectJson) => {
    fetch(url,{
        method:'POST',
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(objectJson),
        cache:"no-store"
    })
    .then(response=>response.json())
    .then((data)=>{
        console.log(data);
        let col = document.querySelector('.opTicket');
        col.textContent = `${data.ticket}-${data.service}`;
    })
    //.catch(err=>console.error(err));
}
export default xhrText;