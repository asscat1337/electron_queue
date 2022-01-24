document.addEventListener('DOMContentLoaded', () => {
    let terminalObject;
    const deleteTerminalDiv = document.querySelector('.delete-terminal__button');
    const modal = document.querySelectorAll('.modal');
    M.Modal.init(modal)
    M.Tabs.init(document.querySelector('.tabs'))
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
    const selectOptions = document.querySelector('.select-service')
    selectOptions.addEventListener('change', (event) => {
        const {children} = event.target
        if (document.querySelector('.result')) {
            document.querySelectorAll('.result').forEach(item => item.remove())
        }
        for (let item of Array.from(children)) {
            if (item.selected) {
                async function showData() {
                    await fetch('dashboard/showService', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify({'terminal': item.textContent})
                    })
                        .then(response => response.json())
                        .then(data => {
                            terminalObject = data
                            data.map(item => {
                                if (item.status === 1) {
                                    document.querySelector('.show__service').insertAdjacentHTML('beforeend', `
                    <div class="result checked" data-id="${item.id}" id="${item.setTerminalName}">
                    <span data-terminal="${item.setTerminalName}" class="service__name">Название услуги:${item.ServiceName}</span>
                    <span class="service__number">Номер услуги:${item.id}</span>
                    <label>
                          <input type="checkbox" class= "filled-in checked__service" checked="checked">
                     <span></span>
                    </label>
                    <div class="result__buttons">
                      <button class="btn change__service" data-id="${item.id}">Изменить</button>
                      <button class="btn close__service">Закрыть</button>
                      <button class="btn delete__service">Удалить</button>
                    </div>
                    <div class="result__container"></div>
                   </div>`)
                                }
                                if (item.status !== 1) {
                                    document.querySelector('.show__service').insertAdjacentHTML('beforeend', `
                    <div class="result" data-id="${item.id}">
                    <span data-terminal="${item.setTerminalName}" class="service__name">Название услуги:${item.ServiceName}</span>
                    <span class="service__number">Номер услуги:${item.id}</span>
                         <label>
                            <input type="checkbox" class="checked__service filled-in" />
                            <span></span>
                          </label>
                          <div class="result__buttons">
                            <button class="btn change__service" data-id="${item.id}">Изменить</button>
                            <button class="btn close__service">Закрыть</button>
                            <button class="btn delete__service">Удалить</button>
                           </div>
                           <div class="result__container"></div>
                   </div>`)
                                }
                            })
                            document.querySelectorAll('.delete__service').forEach((item) => {
                                item.addEventListener('click', (event) => {
                                    const deleteId = event.target.closest('.result').dataset.id
                                    const currentBlock = event.target.closest('.result')

                                    async function fetchDelete() {
                                        await fetch('dashboard/deleteService', {
                                            method: 'POST',
                                            headers: {
                                                'Content-type': 'application/json;charset=utf-8'
                                            },
                                            body: JSON.stringify({id: deleteId})
                                        })
                                            .then(res => res.json())
                                            .then(data => {
                                                M.toast({html: data.message})
                                                currentBlock.remove()
                                            })
                                    }

                                    fetchDelete()
                                })
                            })
                            document.querySelectorAll('.change__service').forEach(item => {
                                const data__button = item.getAttribute('data-id');
                                let isOpened = false
                                item.addEventListener('click', (service) => {
                                    async function changeServiceData() {
                                        const result = document.querySelectorAll('.result')
                                        for (let item1 of result) {
                                            const data__block = item1.getAttribute('data-id');
                                            if (data__block === data__button) {
                                                isOpened = true
                                                const resultContainer = item1.querySelector('.result__container');
                                                const closeButton = item1.querySelector('.close__service')
                                                await fetch('dashboard/showUsers', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-type': 'application/json;charset=utf-8'
                                                    },
                                                    body: JSON.stringify({"id": data__block})
                                                })
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        data.forEach(item2 => {
                                                            /// говногод
                                                            if (item2.isActive) {
                                                                resultContainer.insertAdjacentHTML('beforeend', `
                                            <div class="user__privilege">
                                               <p>
                                                  <label>
                                                    <input type="checkbox" class="filled-in checked__user" checked="checked" />
                                                    <span class="service-login">${item2.setPrivilege}</span>
                                                  </label>
                                                </p>
                                                <div class="change_user-data" data-user=${item2.role_id}>
                                                   <button class="btn change-users">Изменить</button> 
                                                </div>
                                           </div>`)
                                                            }
                                                            if (!item2.isActive) {
                                                                resultContainer.insertAdjacentHTML('beforeend', `
                                            <div class="user__privilege">
                                               <p>
                                                  <label>
                                                    <input type="checkbox" class="filled-in checked__user" />
                                                    <span class="service-login">${item2.setPrivilege}</span>
                                                  </label>
                                                </p>
                                           </div>`)
                                                            }
                                                            ///говнокод
                                                            document.querySelectorAll('.change-users').forEach(button => {
                                                                button.addEventListener('click', (event) => {
                                                                    const findIdButton = event.target.parentNode
                                                                    if (item2.role_id === Number(findIdButton.dataset.user)) {
                                                                        document.querySelector('.user__privilege').insertAdjacentHTML(`beforeend`,
                                                                            `
                                                               <div class="change-user__form">
                                                                    <form action="" method="POST">
                                                                     <div class="col">
                                                                       <div class="input-field col s6">
                                                                          <input placeholder="Placeholder" value="${item2.setPrivilege}" id="change_name" type="text">
                                                                          <label for="change_name">Имя пользователя</label>
                                                                      </div>
                                                                           <div class="input-field col s6">
                                                                          <input placeholder="Placeholder" value=${item2.cab} id="cabinet" type="text">
                                                                          <label for="cabinet">Кабинет/окно</label>
                                                                      </div>
                                                                      <div>
                                                                          <label>
                                                                            <input type="checkbox" class="filled-in check-notice"/>
                                                                            <span>Оставить заметки</span>
                                                                          </label>
                                                                      </div>
                                                                      <div>
                                                                          <label>
                                                                            <input type="checkbox" class="filled-in check-send__data"/>
                                                                            <span>Показывать фио</span>
                                                                          </label>
                                                                      </div>
                                                                      <button class="btn change-button">Изменить</button>
                                                                     </div>
                                                                    </form>
                                                                </div>
                                                               `)
                                                                        const checkNotice = document.querySelector('.check-notice')
                                                                        const checkSendData = document.querySelector('.check-send__data')
                                                                        if (item2.isNotice) {
                                                                            checkNotice.checked = true
                                                                        }
                                                                        if (item2.sendNotice) {
                                                                            checkSendData.checked = true
                                                                        }
                                                                    }
                                                                    const changeButton = document.querySelector('.change-button');
                                                                    if (document.querySelector('#cabinet')) {
                                                                        document.querySelector('#cabinet').addEventListener('input', (event) => {
                                                                            event.target.value = event.target.value.replace(/[^0-9+]/g, '')
                                                                        })
                                                                    }
                                                                    if (changeButton) {
                                                                        changeButton.addEventListener('click', (event) => {
                                                                            const object = {
                                                                                "user": document.querySelector('#change_name').value,
                                                                                "cabinet": document.querySelector('#cabinet').value,
                                                                                "terminal": selectOptions.value,
                                                                                "isNotice": document.querySelector('.check-notice').checked,
                                                                                "sendNotice": document.querySelector('.check-send__data').checked
                                                                            }
                                                                            event.preventDefault()

                                                                            async function fetchChangeUserData() {
                                                                                await fetch('dashboard/changeUserData', {
                                                                                    method: 'POST',
                                                                                    headers: {
                                                                                        'Content-type': 'application/json;charset=utf-8'
                                                                                    },
                                                                                    body: JSON.stringify(object)
                                                                                })
                                                                                    .then(res => res.json())
                                                                                    .then(data => {
                                                                                        M.toast({html: data.message})
                                                                                    })
                                                                            }

                                                                            fetchChangeUserData()
                                                                        })
                                                                    }
                                                                })
                                                            })
                                                        })
                                                        document.querySelectorAll('.checked__user').forEach(item => {
                                                            item.addEventListener('change', (event) => {
                                                                const getUser = item.parentNode.querySelector('.service-login').textContent;
                                                                console.log(getUser)

                                                                async function toggleUserService() {
                                                                    await fetch('dashboard/toggleUserService', {
                                                                        method: 'POST',
                                                                        headers: {
                                                                            "Content-type": "application/json;charset=utf-8"
                                                                        },
                                                                        body: JSON.stringify({
                                                                            "user": getUser,
                                                                            "status": event.target.checked
                                                                        })
                                                                    })
                                                                        .then(res => res.json())
                                                                        .then(data => {
                                                                            M.toast({html: data.message})
                                                                        })
                                                                }

                                                                toggleUserService()
                                                            });
                                                        })
                                                    });
                                                const currentTerminal = terminalObject.find(item => item.id === Number(service.target.dataset.id))
                                                resultContainer.insertAdjacentHTML('beforeend', `
                                  <div class="row">
                                    <form class="col s12">
                                      <div class="row">
                                        <div class="input-field col s6">
                                          <input placeholder="Введите логин" id="first_name" type="text">
                                          <label for="first_name">Логин</label>
                                        </div> 
                                        <div class="input-field col s6">
                                          <input placeholder="Введите номер кабинета/окна" id="cab" type="text">
                                          <label for="cab">Кабинет</label>
                                        </div>
                                         <p>
                                          <label>
                                            <input type="checkbox" class="filled-in isReg" />
                                            <span>Относится к регистратуре</span>
                                          </label>
                                        </p>
                                         <button class="btn waves-effect waves-light add-user" type="submit" name="action">Добавить пользователя</button>
                                      </div>
                                      </form>
                                      </div>
                                      
                                  <div class="row">
                                    <form class="col s12">
                                      <div class="row">
                                        <div class="input-field col s6">
                                          <input placeholder="Введите название услуги" id="service" type="text" value=${currentTerminal.ServiceName}>
                                          <label for="service">Услуга</label>
                                        </div> 
                                         <div class="input-field col s6">
                                          <input placeholder="" id="letter" type="text" value="${currentTerminal.Letter}">
                                          <label for="letter">Обозначение буквы на талоне</label>
                                        </div>
                                        <div class="input-field col s6">
                                          <input placeholder="Введите описание" id="description" type="text" value="${currentTerminal.description}">
                                          <label for="description">Описание</label>
                                        </div>
                                        <div class="input-field col s6">
                                          <input placeholder="" id="start_time" type="time" value="${currentTerminal.start_time}">
                                          <label for="start_time">Начало работы</label>
                                        </div>
              
                                         <div class="input-field col s6">
                                          <input placeholder="" id="end_time" type="time" value="${currentTerminal.end_time}">
                                          <label for="end_time">Окончание работы</label>
                                        </div>
                                         <button class="btn waves-effect waves-light update-terminal" type="submit" name="action">Обновить данные</button>
                                      </div>
                                      </form>
                                      </div>
                                      
                                      
                                    `)
                                                closeButton.addEventListener('click', event => {
                                                    const getAllFromResultContainer = document.querySelectorAll('.result__container')
                                                    getAllFromResultContainer.forEach(item => {
                                                        const {children} = item
                                                        Array.from(children).forEach(elem => {
                                                            elem.remove()
                                                        })
                                                    })
                                                })
                                                const addUser = document.querySelector('.add-user')
                                                addUser.addEventListener('click', (event) => {
                                                    const findElParent = event.target.closest('.result').dataset.id
                                                    event.preventDefault()
                                                    const firstName = document.querySelector('#first_name').value
                                                    const cab = document.querySelector('#cab').value;
                                                    const isReg = document.querySelector('.isReg').checked

                                                    async function fetchAddUser() {
                                                        await fetch('dashboard/addUser', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-type': 'application/json;charset=utf-8'
                                                            },
                                                            body: JSON.stringify({
                                                                'user': firstName,
                                                                'terminal': selectOptions.value,
                                                                'cabinet': cab,
                                                                'isReg': isReg,
                                                                id: findElParent
                                                            })
                                                        })
                                                            .then(res => res.json())
                                                            .then(data => {
                                                                M.toast({html: data.message})
                                                            })
                                                    }

                                                    fetchAddUser()
                                                })
                                                const updateTerminal = document.querySelector('.update-terminal');
                                                updateTerminal.addEventListener('click', (event) => {
                                                    const id = event.target.closest('.result').dataset.id
                                                    event.preventDefault()
                                                    const ServiceName = document.querySelector('#service').value;
                                                    const description = document.querySelector('#description').value;
                                                    const startTime = document.querySelector('#start_time').value;
                                                    const endTime = document.querySelector('#end_time').value;
                                                    const letter = document.querySelector('#letter').value;

                                                    async function fetchUpdateTerminal() {
                                                        await fetch('dashboard/updateServiceData', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-type': 'application/json;charset=utf-8'
                                                            },
                                                            body: JSON.stringify({
                                                                ServiceName,
                                                                description,
                                                                id,
                                                                startTime,
                                                                endTime,
                                                                letter
                                                            })
                                                        })
                                                            .then(res => res.json())
                                                            .then(data => {
                                                                M.toast({html: data.message})
                                                            })
                                                    }

                                                    fetchUpdateTerminal()
                                                })
                                            }
                                        }

                                    }

                                    changeServiceData()
                                })
                            });
                        })
                }

                showData()
            }
        }
    })

    const serviceConfirm = document.querySelector('.service__confirm');
    const selectTerminal = document.querySelector('.select__terminal');
    let data = []
    selectTerminal.addEventListener('change', event => {
        async function fetchData() {
            await fetch('dashboard/showTerminalUsers', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({"data": event.target.value})
            })
                .then(response => response.json())
                .then(data => {
                    data.map(item => {
                        document.querySelector('.add__service').insertAdjacentHTML(`beforeend`, `
                       <p>
                        <label>
                            <input type="checkbox" class="filled-in service__user" data-id=${item.role_id}>
                            <span>${item.setPrivilege}</span>
                        </label>
                </p>
                    `)
                    })
                })
            document.querySelectorAll('.service__user').forEach(item => {
                item.addEventListener('click', (event) => {
                    data.push(event.target.dataset.id)
                })
            });
        }

        fetchData()
    })
    serviceConfirm.addEventListener('click', (event) => {
        const serviceInput = document.querySelector('.service__input').value;
        const descriptionInput = document.querySelector('.service__description').value;
        const isRegService = document.querySelector('.isRegService');
        const object1 = {
            "letter": serviceInput.split('').slice(0, 1).join('').toUpperCase(),
            "ServiceName": serviceInput,
            "description": descriptionInput,
            "pointer": 0,
            "status": 1,
            "roles": data,
            "setTerminalName": selectTerminal.value,
            "start_time": document.querySelector('.service__start').value,
            "end_time": document.querySelector('.service__end').value,
            "type": isRegService.checked || "0"
        };

        async function fetchData() {
            await fetch('dashboard/addNewService', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json;charset=utf-8"
                },
                body: JSON.stringify(object1)
            })
                .then(res => res.json())
                .then(data => {
                    M.toast({html: data.message})
                })
        }

        fetchData()
    })
    let terminalSelect = document.querySelector('.select-terminal')
    terminalSelect.addEventListener('change', evt => {
        const {value} = evt.target
        const deleteTerminalButton = document.querySelector('.delete-terminal');
        deleteTerminalDiv.classList.remove('hide')
        deleteTerminalButton.addEventListener('click', () => {
            async function deleteTerminal() {
                await fetch('dashboard/deleteTerminal', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({nameTerminal: value})
                })
                    .then(res => res.json())
                    .then(data => M.toast({html: data.message}))
            }

            deleteTerminal()
        })
    })
    const selectUserTerminal = document.querySelector('.user_terminal')
    selectUserTerminal.addEventListener('change',(e)=>{
        const {value} = e.target;
        if(document.querySelectorAll('.result__role')){
            document.querySelectorAll('.result__role').forEach(item=>item.remove())
        }
        async function selectUser() {
            const response = await fetch('dashboard/selectUserTerminal',{
                method:'POST',
                headers:{
                    'Content-type':'application/json;charset=utf-8'
                },
                body:JSON.stringify({terminalName:value})
            })
            return await response.json()
        }
        selectUser().then(users=>{
            users.map(user=>{
                selectUserTerminal.insertAdjacentHTML('afterend',`
                    <div class="result__role" data-id=${user.role_id}>
                        <span>${user.setPrivilege}</span>
                        <button class="btn delete__role">Удалить пользователя</button>
                                                <div class="switch">
                            <label>
                                Off
                                ${user.isActive ? `<input type="checkbox" checked class="state__user filled-in"/>` : `<input type="checkbox"  class="state__user filled-in"/>` }
                                <span class="lever"></span>
                                On
                            </label>
                        </div>
<!--                        <button class="btn show__current-user"> Показать подробности</button>-->
                        <a class="waves-effect waves-light btn modal-trigger show__current-user" href="#modal1">Показать подробности</a>
                </div>
                    </div>
                `)
            })
            document.querySelectorAll('.result__role').forEach(item=>{
                const currentButton = item.querySelector('.delete__role')
                const currentCheckBox = item.querySelector('.state__user');
                const showCurrentUser = item.querySelector('.show__current-user')
                showCurrentUser.addEventListener('click',(e)=>{
                    async function showUserData(){
                        const userId = item.dataset.id
                        const response = await fetch(`dashboard/showCurrentUser/${userId}`,{
                            method:'GET',
                            headers:{
                                'Content-type':'application/json;charset=utf-8'
                            },
                        })
                        return await response.json()
                    }

                    showUserData().then(data=>{
                        document.querySelector('.modal-content').insertAdjacentHTML('beforeend',`
                        <form method="post" class="edit-user">
                            <label for="login">Имя пользователя</label>
                            <input type="text" class="login" value=${data.setPrivilege} placeholder="Введите имя пользователя">
                            <label for="cabinet">Кабинет/окно</label>
                            <input type="text" class="cabinet" value=${data.cab} placeholder="Введите кабинет/окно">
                            <label>
                                ${data.isCab ? `<input type="checkbox" class="filled-in is-cab" checked="checked" />` :`<input class="filled-in is-cab" type="checkbox"/>`}
                                <span>Относится к кабинету/окну</span>
                            </label>
                             <label>
                                ${data.isNotice ? `<input type="checkbox" class="filled-in is-notice" checked="checked" />` :`<input class="filled-in is-notice" type="checkbox"/>`}
                                <span>Оставлять заметки</span>
                            </label>
                             <label>
                                ${data.sendNotice ? `<input type="checkbox" class="filled-in send-notice" checked="checked" />` :`<input class="filled-in send-notice" type="checkbox"/>`}
                                <span>Показывать ФИО</span>
                            </label>
                            <button class="btn button-edit">Редактировать</button>
                        </form>
                        `)
                        document.querySelector('.button-edit').addEventListener('click',(event)=>{
                            event.preventDefault()
                            const login = document.querySelector('.login');
                            const cabinet = document.querySelector('.cabinet');
                            const isCab = document.querySelector('.is-cab');
                            const isNotice = document.querySelector('.is-notice');
                            const sendNotice = document.querySelector('.send-notice')
                            console.log(isCab,isNotice,sendNotice)
                            const editObject = {
                                "role_id":item.dataset.id,
                                "setPrivilege":login.value,
                                "cab":cabinet.value,
                                "isCab":isCab.checked,
                                "isNotice":isNotice.checked,
                                "sendNotice":sendNotice.checked
                            };
                            async function editCurrentUser(){
                                const response = await fetch('dashboard/editUser',{
                                    method:'POST',
                                    headers:{
                                        'Content-type':'application/json;charset=utf-8'
                                    },
                                    body:JSON.stringify(editObject)
                                })
                                return await response.json()
                            }
                            editCurrentUser()
                                .then(data=>{
                                    M.toast({html:data.message})
                                })
                        })
                    })
                })
                currentCheckBox.addEventListener('change',(e)=>{
                    const {checked} = e.target;
                    const id = item.dataset;
                    const changeStateUser = async () => {
                        await fetch('dashboard/disableAcc', {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json;charset=utf-8',
                            },
                            body: JSON.stringify({"status":checked,...id})
                        })
                            .then(res => res.json())
                            .then(data => {
                                M.toast({html: data.message})
                            })
                    }
                    changeStateUser()

                })
                currentButton.addEventListener('click',(e)=>{
                    const {id} = item.dataset.id

                    async function deleteUser() {
                       const response =  await fetch('dashboard/deleteUser',{
                            method:'DELETE',
                            headers:{
                                'Content-type':'application/json;charset=utf-8'
                            },
                            body:JSON.stringify({'id':id})
                        })
                        return await response.json();
                    }
                    deleteUser().then(deleted=>{
                        item.remove()
                        M.toast({html:deleted.message})
                    })
                })
            })
        })
    })
});
const roleButton = document.querySelector('.role__button');
roleButton.addEventListener('click', () => {
    const isReg = document.querySelector('.isReg');
    const roleInput = document.querySelector('.role__input').value;
    const cabInput = document.querySelector('.role__cab').value;
    const terminlInput = document.querySelector('.role_terminal').value;
    const checkedVal = isReg.checked ? "1" : "0";
    const isNotice = document.querySelector('.isNotice');
    const sendNotice = document.querySelector('.sendNotice');

    async function addNewRole() {
        await fetch('dashboard/registerUser', {
            method: 'POST',
            headers: {
                "Content-type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                "role": roleInput, "cab": cabInput, "terminalName": terminlInput, "isCab": checkedVal,
                isNotice: 0 || isNotice.checked, sendNotice: 0 || sendNotice.checked
            })
        })
            .then(res => res.json())
            .then(data => {
                M.toast({html: data.message})
            })
    }

    addNewRole()
})
const termninalButton = document.querySelector('.terminal__button');
termninalButton.addEventListener('click', () => {
    const terminalInput = document.querySelector('.terminal__input').value;
    const terminalDesc = document.querySelector('.terminal__desc').value;
    console.log({"terminalName": terminalInput, "descriptionText": terminalDesc});

    async function addNewTerminal() {
        await fetch('dashboard/addNewTerminal', {
            method: 'POST',
            headers: {
                "Content-type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({"terminalName": terminalInput, "descriptionText": terminalDesc})
        })
    }

    addNewTerminal()
})