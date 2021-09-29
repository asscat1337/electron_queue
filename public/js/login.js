document.addEventListener('DOMContentLoaded',()=>{
    M.FormSelect.init(document.querySelector('.selectedVal'));
    const terminalVal = window.location.search.split('=').slice(1).join()
    document.querySelector('.submit').addEventListener('click',(event)=>{
        const selectedVal = document.querySelector('.selectedVal');
        // socket.emit('login',{'user':selectedVal.value,'terminal':terminalVal})
        localStorage.setItem('user',selectedVal.value)
        event.preventDefault();
        fetch('login/auth',{
            method:'POST',
            headers:{
                "Content-type":"application/json;charset=utf-8"
            },
            body:JSON.stringify({"setPrivilege":selectedVal.value,"terminalVal":terminalVal})
        })
            .then(response=>{
                if(response.redirected){
                    window.location.href = response.url
                }
            })
    })
})
