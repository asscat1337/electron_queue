let privilege = document.querySelector('.select__terminal');
let confirm = document.querySelector('.confirm');
console.log(privilege);

confirm.addEventListener('click',()=>{
    let privilegeVal = privilege.value
    let object = {
        'privilege':privilegeVal
    }
    console.log(object);
    fetch('php/auth.php',{
        method:'POST',
        body:JSON.stringify(object)
    })
    .then(result=>{
        console.log(result);
        document.cookie = `privilege=${privilegeVal}`;
        document.location.href=`./index.php`;
    })
})