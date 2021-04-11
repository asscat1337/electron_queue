document.addEventListener('DOMContentLoaded',()=>{
    M.Tabs.init(document.querySelector('.tabs'))

    const fetchData = async()=>{
    await fetch('/showService',{
        method:'POST'
    })
        .then(response=>response.json())
        .then(data=>{
                data.forEach(item=>{
                    if(item.status===1){
                        document.querySelector('.show__service').insertAdjacentHTML('beforeend',`
                    <div class="result checked" data-id="${item.id}" id="${item.setTerminalName}">
                    <span data-terminal="${item.setTerminalName}" class="service__name">${item.ServiceName}</span>
                    <label>
                          <input type="checkbox" class= "filled-in checked__service" checked="checked"> 
                     <span></span>
                    </label>
                    <button class="btn change__service" data-id="${item.id}">Изменить</button>
                   </div>`)
                    }else{
                        document.querySelector('.show__service').insertAdjacentHTML('beforeend',`
                    <div class="result" data-id="${item.id}">
                    <span data-terminal="${item.setTerminalName}" class="service__name">${item.ServiceName}</span>
                         <label>
                            <input type="checkbox" class="checked__service filled-in" />
                            <span></span>
                          </label>
                    <button class="btn change__service" data-id="${item.id}">Изменить</button>
                   </div>`)
                    }
                })
            document.querySelectorAll('.change__service').forEach(item=>{
                const data__button = item.getAttribute('data-id');
                item.addEventListener('click',()=>{
                    document.querySelectorAll('.result').forEach(item1=>{
                       const  data__block = item1.getAttribute('data-id');
                       if(data__block===data__button){
                            fetch('/showUsers',{
                                method:'POST'
                            })
                                .then(res=>res.json())
                                .then(data=>{
                                   data.find(item=>{
                                       if (data__block==item.id){
                                           const test = item.setPrivilege.split(',');
                                           console.log(test)
                                           test.forEach(item2=>{
                                               item1.insertAdjacentHTML('beforeend',`<div class="user__privilege"><input type="checkbox"  checked class="deletePrivilege">${item2}</div>`)
                                           })
                                       }
                                   })
                                    document.querySelectorAll('.user__privilege').forEach(item=>{

                                      item.addEventListener('change',()=>{
                                          fetch('/deleteUserService',{
                                              method:'DELETE',
                                              headers:{
                                                  "Content-type":"application/json;charset=utf-8"
                                              },
                                              body:JSON.stringify({"user":item.textContent})
                                          })
                                      });
                                    })
                                });

                           fetch('/showFreeUsers',{
                               method:'POST',
                           })
                               .then(res=>res.json())
                               .then(data=>{
                                   const serviceName = item1.children[0].textContent;
                                   item1.insertAdjacentHTML('beforeend',`
                                              <div class="input-field">
                                                <select class="free__users browser-default">
                                                  <option value="" disabled selected>Choose your option</option>
                                                </select>
                                              </div>
                                               <button class="update__user">Добавить</button>
                                    `)
                                   data.forEach(item=>{
                                       document.querySelector('.free__users').insertAdjacentHTML(`beforeend`,`<option>${item.setPrivilege}</option>`)
                                   })
                                   document.querySelector('.update__user').addEventListener('click',()=>{
                                       fetch('/updateUserTerminal',{
                                           method:'POST',
                                           headers:{
                                               'Content-type':'application/json;charset=utf-8'
                                           },
                                           body:JSON.stringify({'serviceName':serviceName,'user':document.querySelector('.free__users').value})
                                       })
                                   })
                               })
                       }
                    })
                })
            });
           document.querySelectorAll('.result').forEach(item=>{
               let check = item.querySelector('.checked__service ');
               const ticketText =item.querySelector('.service__name').textContent;
               check.addEventListener('click',(event)=>{
                   console.log(event.target);
                   const inputChecked = item.querySelector('input');
                   console.log(ticketText)
                   let object = {
                       "serviceName":ticketText,
                       "update":inputChecked.checked
                   }
                   fetch('/updateService',{
                       method:"POST",
                       headers:{
                           "Content-type":"application/json;charset=utf-8"
                       },
                       body:JSON.stringify(object)
                   })
               })
           })
        });
};
    fetchData();
    let data = []
    document.querySelectorAll('.service__user').forEach(item=> {
        item.addEventListener('click', (event) => {
           data.push(event.target.dataset.id)
        })
    });
    const serviceConfirm = document.querySelector('.service__confirm');
    const selectTerminal = document.querySelector('.select__terminal');
    serviceConfirm.addEventListener('click',(event)=>{
           const serviceInput = document.querySelector('.service__input').value;
           const descriptionInput = document.querySelector('.service__description').value;
           const numberCabinet = document.querySelector('.service__cabinet').value;
           const object1 = {
               "letter":serviceInput.split('').slice(0,1).join('').toUpperCase(),
               "ServiceName":serviceInput,
               "description":descriptionInput,
               "pointer":0,
               "Priority":1,
               "status":1,
               "role":data,
               "setTerminalName":selectTerminal.value,
               "start_time":document.querySelector('.service__start').value,
               "end_time":document.querySelector('.service__end').value,
               "cabinet":numberCabinet
           };
           console.log(object1);
           fetch('/addNewService',{
               method:'POST',
               headers:{
                   "Content-type":"application/json;charset=utf-8"
               },
               body:JSON.stringify(object1)
           })
    })
});
const roleButton = document.querySelector('.role__button');
roleButton.addEventListener('click',()=>{
    const roleInput = document.querySelector('.role__input').value;
    const cabInput = document.querySelector('.role__cab').value;
    const terminlInput = document.querySelector('.role_terminal').value;
    console.log({"role":roleInput,"cab":cabInput,"terminalName":terminlInput});
    fetch('/addNewRole',{
        method:'POST',
        headers:{
            "Content-type":"application/json;charset=utf-8"
        },
        body:JSON.stringify({"role":roleInput,"cab":cabInput,"terminalName":terminlInput})
    })
})
const termninalButton = document.querySelector('.terminal__button');
termninalButton.addEventListener('click',()=>{
    const terminalInput = document.querySelector('.terminal__input').value;
    const terminalDesc = document.querySelector('.terminal__desc').value;
    console.log({"terminalName":terminalInput,"descriptionText":terminalDesc});
    fetch('/addNewTerminal',{
        method:'POST',
        headers:{
            "Content-type":"application/json;charset=utf-8"
        },
        body:JSON.stringify({"terminalName":terminalInput,"descriptionText":terminalDesc})
    })
})
const deleteRole = document.querySelectorAll('.delete__role');
deleteRole.forEach(item=>{
    item.addEventListener('click',(event)=>{
        document.querySelectorAll('.result__role').forEach(itemClick=>{
               if(item.getAttribute('data-id')===itemClick.getAttribute('data-id')){
                   const user = itemClick.children[0].textContent;
                   console.log({"role":user});
                   fetch('/deleteUser',{
                       method:"DELETE",
                       headers:{
                           "Content-type":"application/json;charset=utf-8"
                       },
                       body:JSON.stringify({"role":user})
                   })
               }
            })
    })
})
const $isActive = document.querySelectorAll('.deactive__user');
$isActive.forEach(item=>{
    let status = 1;
    item.addEventListener('click',(event)=>{
       let parent1 = item.parentNode.parentElement.parentElement;
       let getAttr = parent1.getAttribute('data-id');
       const fetchData=async()=>{
           await fetch('/dashboard/disableAcc',{
               method:'POST',
               headers: {
                   'Content-type': 'application/json;charset=utf-8',
               },
               body: JSON.stringify({"id": getAttr, "status":item.checked ? status:status=0})
           })
               .then(res=>res.json())
               .then(data=>{
                       document.body
                           .insertAdjacentHTML('afterbegin',`<div class="message__box">${data.message}</div>`)
                   setTimeout(()=>{
                       document.querySelector('.message__box').remove()
                   },5000)
               })
       }
       fetchData()
    })
})
console.log(moment.format("L"))