let button = document.querySelector('.serviceAccept');


const renderText = (text)=>{
    let body = document.querySelector('body');
    let div = document.createElement('div');
    body.insertAdjacentElement('beforebegin',div);

    div.textContent = text;

    setTimeout(()=>{
        div.remove();
    },3000)
}
let privilegeVal = [];
let checkBoxPrivilege = document.querySelectorAll('.checkbox__div input[type=checkbox]');
checkBoxPrivilege.forEach(item=>{
    let itemId = item.getAttribute('data-id');
    item.addEventListener('click',(event)=>{
       //privilegeVal = item.value;
        privilegeVal.push(item.value);
    })
});
let selectTerminalName = document.querySelector('.terminalSelect');
button.addEventListener('click',()=>{
    let body = document.querySelector('body')
    let inputService= document.querySelector('.serviceInput');
    let inputValue = inputService.value;
    let objectValues = 
    {
        "serviceName":inputValue,
        "letter":inputValue.split('').slice(0,1).join('').toUpperCase(),
        "pointer":0,
        "priority":1,
        "status":1,
        "setPrivilege":privilegeVal,
        "setTerminalName":selectTerminalName.selected

    }

    console.log(objectValues);
    fetch('./back/addNewPost.php',{
        method:'POST',
        body:JSON.stringify(objectValues)
    }).then(result=>{
        if(result){
            renderText('Запись добавлена');
        }
    })
})
document.querySelector('.OperatorAccept').addEventListener('click',()=>{
    let selected = document.querySelector('.selectService');
    let selectedValue = selected.value;
    let fioValue = document.querySelector('.operatorInput').value;
    const generatePassword =(len)=>{
            let password = "";
            let symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!№;%:?*()_+=";
            for(let i=0;i<len;i++){
                password+=symbols.charAt(Math.floor(Math.random()*symbols.length));
            }
            return password;
    }
    let ObjectOperator = {
        "fio":fioValue,
        "password":generatePassword(5),
        "serviceName":selectedValue
    }
    console.log(ObjectOperator);
    fetch("./back/addUsers.php",{
        method:'POST',
        body:JSON.stringify(ObjectOperator)
    })
    .then(result=>{
        if(result){
            renderText('Пользователь добавлен');
        }
    })
})
document.querySelectorAll('.result input[type=checkbox]').forEach(item=>{
    let id = item.getAttribute('data-id');
    let object = {
        "id":id
    }
    if(item.checked){
        item.addEventListener('click',()=>{
                fetch('back/deactiveService.php',{
                    method:'POST',
                    body:JSON.stringify(object)
                })
                item.removeAttribute('checked')
        })
    }else{
        item.addEventListener('click',()=>{
            console.log(item.checked);
                fetch('back/activeNewService.php',{
                    method:'POST',
                    body:JSON.stringify(object)
                })
                item.setAttribute('checked','checked')
        })
    }
});
let activeNewRole = document.querySelector('.activeNewRole');
activeNewRole.addEventListener('click',()=>{
    let object = {
        "roleValue":document.querySelector('.inputRole').value
    }
    console.log(object);
    fetch('back/activeNewRole.php',{
        method:'POST',
        body:JSON.stringify(object)
    }).then(response=>{
        if(response.status===200){
            renderText('Роль добавлена')
            window.reload()
        }
    })
})
let addTerminal = document.querySelector('.activeNewTerminal');
addTerminal.addEventListener('click',()=>{
let objectTerminal = {
    "terminalName":document.querySelector('.inputTerminal').value
}

fetch('back/addTerminalName.php',{
    method:'POST',
    body:JSON.stringify(objectTerminal)
})
.then(response=>{
    console.log(response)
})
});