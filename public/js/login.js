document.querySelector('.submit').addEventListener('click',(event)=>{
    const selectedVal = document.querySelector('.selectedVal');
   event.preventDefault();
   fetch('/auth',{
       method:'POST',
       redirect:'manual',
       headers:{
           "Content-type":"application/json;charset=utf-8"
       },
       referrer:"unsafe-url",
       referrerPolicy:"origin-when-cross-origin",
       body:JSON.stringify({"setPrivilege":selectedVal.value})
   })
       .then(res=>{
           document.location.href = "/op";
       })
})