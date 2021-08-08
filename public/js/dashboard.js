document.addEventListener('DOMContentLoaded',()=>{
    M.Tabs.init(document.querySelector('.tabs'))
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
    const selectOptions = document.querySelector('.select-service')
    selectOptions.addEventListener('change',(event)=>{
       const {children} = event.target
        if(document.querySelector('.result')){
            document.querySelector('.result').remove()
        }
       Array.from(children).forEach(item=>{
           if(item.selected){
               async function showData(){
                   await fetch('dashboard/showService',{
                       method:'POST',
                       headers:{
                           'Content-type':'application/json;charset=utf-8'
                       },
                       body:JSON.stringify({'terminal':item.textContent})
                   })
                       .then(response=>response.json())
                       .then(data=>{
                           data.map(item=>{
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
                               }
                               if(item.status !==1){
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
                                           fetch('dashboard/showUsers',{
                                               method:'POST',
                                               headers:{
                                                   'Content-type':'application/json;charset=utf-8'
                                               },
                                               body:JSON.stringify({"id":item1.querySelector('.service__name').getAttribute('data-terminal')})
                                           })
                                               .then(res=>res.json())
                                               .then(data=>{
                                                   data.forEach(item2=>{
                                                       /// говногод
                                                       if(item2.isActive){
                                                           item1.insertAdjacentHTML('beforeend',`
                                            <div class="user__privilege">
                                               <p>
                                                  <label>
                                                    <input type="checkbox" class="filled-in" checked="checked" />
                                                    <span>${item2.setPrivilege}</span>
                                                  </label>
                                                </p>
                                           </div>`)
                                                       }
                                                       if(!item2.isActive){
                                                           item1.insertAdjacentHTML('beforeend',`
                                            <div class="user__privilege">
                                               <p>
                                                  <label>
                                                    <input type="checkbox" class="filled-in" />
                                                    <span>${item2.setPrivilege}</span>
                                                  </label>
                                                </p>
                                           </div>`)
                                                       }
                                                       ///говнокод
                                                   })
                                                   document.querySelectorAll('.user__privilege').forEach(item=>{
                                                       item.addEventListener('change',(event)=>{
                                                           async function disabledUser(){
                                                               await fetch('dashboard/disabledUserService',{
                                                                   method:'POST',
                                                                   headers:{
                                                                       "Content-type":"application/json;charset=utf-8"
                                                                   },
                                                                   body:JSON.stringify({"user":item.textContent.trim()})
                                                               })
                                                           }
                                                           async function enableUser() {
                                                               await fetch('/dashboard/enableUserService',{
                                                                   method:'POST',
                                                                   headers:{
                                                                       'Content-type':'application/json;charset=utf-8'
                                                                   },
                                                                   body:JSON.stringify({"user":item.textContent.trim()})
                                                               })
                                                           }
                                                           event.target.checked ? enableUser():disabledUser()
                                                       });
                                                   })
                                               });
                                           item1.insertAdjacentHTML('beforeend',`
                                  <div class="row">
                                    <form class="col s12">
                                      <div class="row">
                                        <div class="input-field col s6">
                                          <input placeholder="Введите логин" id="first_name" type="text" class="validate">
                                          <label for="first_name">Логин</label>
                                        </div> 
                                        <div class="input-field col s6">
                                          <input placeholder="Введите номер кабинета/окна" id="cab" type="text" class="validate">
                                          <label for="cab">Кабинет</label>
                                        </div>
                                         <button class="btn waves-effect waves-light add-user" type="submit" name="action">Добавить пользователя</button>
                                      </div>
                                      </form>
                                      </div>
                                    `)
                                           const addUser = document.querySelector('.add-user')
                                           addUser.addEventListener('click',(event)=>{
                                               event.preventDefault()
                                               const firstName = document.querySelector('#first_name').value
                                               const cab = document.querySelector('#cab').value
                                               async function fetchAddUser(){
                                                   await fetch('dashboard/addUser',{
                                                       method:'POST',
                                                       headers:{
                                                           'Content-type':'application/json;charset=utf-8'
                                                       },
                                                       body:JSON.stringify({'user':firstName,'terminal':selectOptions.value,'cabinet':cab})
                                                   })
                                               }
                                               fetchAddUser()
                                           })
                                       }
                                   })
                               })
                           });
                       })
               }
               showData()
           }
       })
    })
    const fetchData = async()=>{
    await fetch('/showService',{
        method:'POST'
    })
        .then(response=>response.json())
        .then(data=>{
            data.forEach(item=>{

                   //  else{
                   //      document.querySelector('.show__service').insertAdjacentHTML('beforeend',`
                   //  <div class="result" data-id="${item.id}">
                   //  <span data-terminal="${item.setTerminalName}" class="service__name">${item.ServiceName}</span>
                   //       <label>
                   //          <input type="checkbox" class="checked__service filled-in" />
                   //          <span></span>
                   //        </label>
                   //  <button class="btn change__service" data-id="${item.id}">Изменить</button>
                   // </div>`)
                   //  }
                })
           document.querySelectorAll('.result').forEach(item=>{
               let check = item.querySelector('.checked__service ');
               const ticketText =item.querySelector('.service__name').textContent;
               check.addEventListener('click',(event)=>{
                   console.log(event.target);
                   const inputChecked = item.querySelector('input');
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
    //fetchData();
    const serviceConfirm = document.querySelector('.service__confirm');
    const selectTerminal = document.querySelector('.select__terminal');
    let data = []
    selectTerminal.addEventListener('change',event=>{
        async function fetchData(){
            await fetch('dashboard/showTerminalUsers',{
                method:'POST',
                headers:{
                    'Content-type':'application/json;charset=utf-8'
                },
                body:JSON.stringify({"data":event.target.value})
            })
                .then(response=>response.json())
                .then(data=>{
                    console.log(data)
                    data.map(item=>{
                        document.querySelector('.add__service').insertAdjacentHTML(`beforeend`,`
                       <p>
                        <label>
                            <input type="checkbox" class="filled-in service__user" data-id=${item.role_id}>
                            <span>${item.setPrivilege}</span>
                        </label>
                </p>
                    `)
                    })
                })
            document.querySelectorAll('.service__user').forEach(item=> {
                item.addEventListener('click', (event) => {
                    data.push(event.target.dataset.id)
                })
            });
        }
        fetchData()
    })
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
           async function fetchData(){
               await fetch('/addNewService',{
                   method:'POST',
                   headers:{
                       "Content-type":"application/json;charset=utf-8"
                   },
                   body:JSON.stringify(object1)
               })
           }
           fetchData()
    })
});
const roleButton = document.querySelector('.role__button');
roleButton.addEventListener('click',()=>{
    const isReg = document.querySelector('.isReg');
    const roleInput = document.querySelector('.role__input').value;
    const cabInput = document.querySelector('.role__cab').value;
    const terminlInput = document.querySelector('.role_terminal').value;
    const checkedVal = isReg.checked ? "1":"0";
    fetch('/addNewRole',{
        method:'POST',
        headers:{
            "Content-type":"application/json;charset=utf-8"
        },
        body:JSON.stringify({"role":roleInput,"cab":cabInput,"terminalName":terminlInput,"isCab":checkedVal})
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
// console.log(moment.format("L"))