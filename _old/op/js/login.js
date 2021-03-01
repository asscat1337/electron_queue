let button = document.querySelector('.loginButton');
window.addEventListener('DOMContentLoaded',(event)=>{
    event.preventDefault();
    button.addEventListener('click',(event)=>{
        event.preventDefault();
    
        let login = document.querySelector('#login').value;
        let password = document.querySelector('#password').value;
    
        let ObjectLogin = {
            "login":login,
            "password":password,
        }
    
        fetch("./php/autorization.php",{
            method:'POST',
            body:JSON.stringify(ObjectLogin)
        })
        .then(result=>{
            if(result){
                console.log(result);
                console.log('AUTH COMPLETE');
                document.cookie = `user=${login}`;
                // sessionStorage['user'] = login;
                window.location.href = "http://eq.gkb13ufa.ru/op/index.php";
            }
        })
    
    })
})
