document.addEventListener('DOMContentLoaded', () => {
    let terminalObject;
    let terminalName
    const deleteTerminalDiv = document.querySelector('.delete-terminal__button');
    const modal = document.querySelectorAll('.modal');
    const select = document.querySelectorAll('select')
    M.Modal.init(modal)
    M.Tabs.init(document.querySelector('.tabs'))
    M.FormSelect.init(select)
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
    const selectOptions = document.querySelector('.select-service')
    const checkLetter = document.querySelector('.check__letter')
    let letterService
    selectOptions.addEventListener('change', (event) => {
        const {children} = event.target
        if (document.querySelector('.result')) {
            document.querySelectorAll('.result').forEach(item => item.remove())
            document.querySelector('.links').remove()
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
                            terminalName = item.textContent
                            terminalObject = data
                            data.map(item => {
                                if (item.status === 1) {
                                    document.querySelector('.show__service').insertAdjacentHTML('beforeend', `
                    <div class="result checked" data-id="${item.service_id}" data-service="${item.name}">
                    <span data-terminal="${item.name}" class="service__name">Название услуги:${item.name}</span>
                    <span class="service__number">Номер услуги:${item.service_id}</span>
                    <label>
                          <input type="checkbox" class= "filled-in checked__service" checked="checked">
                     <span></span>
                    </label>
                    <div class="result__buttons">
                      <button class="btn change__service" data-id="${item.service_id}">Изменить</button>
                      <button class="btn close__service">Закрыть</button>
                      <button class="btn delete__service">Удалить</button>
                    </div>
                    <div class="result__container"></div>
                   </div>`)
                                }
                                if (item.status !== 1) {
                                    document.querySelector('.show__service').insertAdjacentHTML('beforeend', `
                    <div class="result" data-id="${item.service_id}">
                    <span data-terminal="${item.name}" class="service__name">Название услуги:${item.name}</span>
                    <span class="service__number">Номер услуги:${item.service_id}</span>
                         <label>
                            <input type="checkbox" class="checked__service filled-in" />
                            <span></span>
                          </label>
                          <div class="result__buttons">
                            <button class="btn change__service" data-id="${item.service_id}">Изменить</button>
                            <button class="btn close__service">Закрыть</button>
                            <button class="btn delete__service">Удалить</button>
                           </div>
                           <div class="result__container"></div>
                   </div>`)
                                }
                            })
                            document.querySelector('.show__service').insertAdjacentHTML(`beforeend`, `
                                <div class="links">
                                    <h5>Ссылки</h5>
                                    <div>
                                        <a href=/ts?id=${item.textContent} target="_blank">Терминал</a>
                                    </div>
                                    <div>
                                        <a href=/tv?id=${item.textContent}&status=1 target="_blank">ТВ</a>
                                    </div>
                                    <div>
                                        <a href=/login?uch=${item.textContent} target="_blank">Панель оператора</a>
                                    </div>
                                </div>
                            `)
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
                                            body: JSON.stringify({id: deleteId, terminalName: terminalName})
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
                                                const currentTerminal = terminalObject.find(item => item.service_id === Number(service.target.dataset.id))
                                                resultContainer.insertAdjacentHTML('beforeend', `           
                                  <div class="row">
                                    <form class="col s12">
                                      <div class="row">
                                         <div class="input-field col s6">
                                          <input placeholder="" id="letter" type="text" value="${currentTerminal.letter}">
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
                                                                letter,
                                                                terminalName
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
    let dataUsers = []
    selectTerminal.addEventListener('change', event => {
        const users = document.querySelectorAll('.users p')
        if (users.length) {
            users.forEach(user => user.remove())
        }

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
                        document.querySelector('.users').insertAdjacentHTML(`beforeend`, `
                       <p>
                        <label>
                            <input type="checkbox" class="filled-in service__user" data-id=${item.user_id}>
                            <span>${item.name}</span>
                        </label>
                </p>
                    `)
                    })
                })
            document.querySelectorAll('.service__user').forEach(item => {
                item.addEventListener('click', (event) => {
                    dataUsers.push(event.target.dataset.id)
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
            "letter": letterService?.toUpperCase() ?? serviceInput.split('').slice(0, 1).join('').toUpperCase(),
            "name": serviceInput,
            "description": descriptionInput,
            "pointer": 1,
            "status": 1,
            "roles": dataUsers,
            "setTerminalName": selectTerminal.value,
            "start_time": document.querySelector('.service__start').value,
            "end_time": document.querySelector('.service__end').value,
            "type": isRegService.checked || "0"
        };
        const addServiceInput = document.querySelectorAll('.add__service input')

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
                    addServiceInput.forEach(input => {
                        input.value = ""
                        if (input.type === "checkbox") {
                            input.checked = false
                        }
                        dataUsers = []
                    })
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
    let userTerminal
    const selectUserTerminal = document.querySelector('.user_terminal')
    selectUserTerminal.addEventListener('change', (e) => {
        const {value} = e.target;
        userTerminal = value
        if (document.querySelectorAll('.result__role')) {
            document.querySelectorAll('.result__role').forEach(item => item.remove())
        }

        async function selectUser() {
            const response = await fetch('dashboard/selectUserTerminal', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({terminalName: value})
            })
            return await response.json()
        }

        selectUser().then(users => {
            users.map(user => {
                selectUserTerminal.insertAdjacentHTML('afterend', `
                    <div class="result__role" data-id=${user.user_id}>
                        <span>${user.name}</span>
                        <button class="btn delete__role">Удалить пользователя</button>
                                                <div class="switch">
                            <label>
                                Отключить
                                ${user.isActive ? `<input type="checkbox" checked class="state__user filled-in"/>` : `<input type="checkbox"  class="state__user filled-in"/>`}
                                <span class="lever"></span>
                                Включить
                            </label>
                        </div>
                        <a class="waves-effect waves-light btn modal-trigger show__current-user" href="#modal1">Показать подробности</a>
                </div>
                    </div>
                `)
            })
            document.querySelectorAll('.result__role').forEach(item => {
                const currentButton = item.querySelector('.delete__role')
                const currentCheckBox = item.querySelector('.state__user');
                const showCurrentUser = item.querySelector('.show__current-user')
                showCurrentUser.addEventListener('click', (e) => {
                    async function showUserData() {
                        const userId = item.dataset.id
                        const response = await fetch(`/dashboard/showCurrentUser?userId=${userId}&terminal=${value}`, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/json;charset=utf-8'
                            },
                        })
                        return await response.json()
                    }

                    showUserData().then(data => {
                        const {services, user, userService} = data
                        const {name, cab, isReg, isNotice, sendNotice, user_id} = user[0]


                        document.querySelector('.modal-content').insertAdjacentHTML('beforeend', `
                        <div class="user-info">
                        <form method="post" class="edit-user">
                            <label for="login">Имя пользователя</label>
                            <input type="text" class="login" value=${name} placeholder="Введите имя пользователя">
                            <label for="cabinet">Кабинет/окно</label>
                            <input type="text" class="cabinet" value=${cab} placeholder="Введите кабинет/окно">
                            <label>
                                ${isReg ? `<input type="checkbox" class="filled-in is-cab" checked="checked" />` : `<input class="filled-in is-cab" type="checkbox"/>`}
                                <span>Относится к кабинету/окну</span>
                            </label>
                             <label>
                                ${isNotice ? `<input type="checkbox" class="filled-in is-notice" checked="checked" />` : `<input class="filled-in is-notice" type="checkbox"/>`}
                                <span>Оставлять заметки</span>
                            </label>
                             <label>
                                ${sendNotice ? `<input type="checkbox" class="filled-in send-notice" checked="checked" />` : `<input class="filled-in send-notice" type="checkbox"/>`}
                                <span>Показывать ФИО</span>
                            </label>
                            <button class="btn button-edit">Редактировать</button>
                        </form>
                        <div class="add_service">
                            <h4>Выберите услугу для добавления</h4>
                             <select class="select_service"></select>
                                  <button class="btn button__add-service">Добавить сервис</button>
                        </div>
                        <div class="user-service">
                            <h5>Список услуг</h5>
                        </div>
                        </div>
                        `)

                        userService.map(item => {
                            document.querySelector('.user-service').insertAdjacentHTML('beforeend', `
                            <div class="service" data-service=${item.service_id}>
                                <div>Номер услуги:${item.service_id}</div>
                                <div>Название:${item.description}</div>
                                <button class="btn disable-service">Отключить</button>
                            </div>                            
                        `)
                        })

                        const btnDisable = document.querySelectorAll('.disable-service')

                        btnDisable.forEach(btn => {
                            btn.addEventListener('click', (event) => {
                                const {service} = event.target.parentNode.dataset

                                async function disableService() {
                                    await fetch(`/dashboard/disableUserService?service=${service}&user=${user_id}&terminal=${userTerminal}`, {
                                        method: "DELETE"
                                    })
                                        .then(() => event.target.parentNode.remove())
                                }

                                disableService()
                            })
                        })

                        const selectService = document.querySelector('.select_service')
                        const selectDefault = document.createElement('option')
                        selectService.appendChild(selectDefault)
                        selectDefault.disabled = true
                        selectDefault.selected = true
                        selectDefault.label = "Выберите значение"
                        services.map(service => {
                            const optionService = document.createElement('option')
                            optionService.value = service.service_id
                            optionService.text = service.description
                            selectService.appendChild(optionService)
                        })
                        let selectedService
                        selectService.addEventListener('change', (event) => {
                            selectedService = event.target.value;
                            console.log(selectedService)
                        })
                        document.querySelector('.button__add-service').addEventListener('click', (event => {
                            async function addNewService() {
                                const response = await fetch('dashboard/updateServiceUser', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: JSON.stringify({user_id, service_id: selectedService, terminal: value})
                                })

                                return await response.json()
                            }

                            addNewService().then(r => console.log(r))
                        }))
                        document.querySelector('.button-edit').addEventListener('click', (event) => {
                            event.preventDefault()
                            console.log(selectedService)
                            const login = document.querySelector('.login');
                            const cabinet = document.querySelector('.cabinet');
                            const isCab = document.querySelector('.is-cab');
                            const isNotice = document.querySelector('.is-notice');
                            const sendNotice = document.querySelector('.send-notice')
                            const editObject = {
                                "role_id": item.dataset.id,
                                "setPrivilege": login.value,
                                "cab": cabinet.value,
                                "isCab": isCab.checked,
                                "isNotice": isNotice.checked,
                                "sendNotice": sendNotice.checked,
                                userTerminal
                            };

                            async function editCurrentUser() {
                                const response = await fetch('dashboard/editUser', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json;charset=utf-8'
                                    },
                                    body: JSON.stringify(editObject)
                                })
                                return await response.json()
                            }

                            editCurrentUser()
                                .then(data => {
                                    M.toast({html: data.message})
                                })
                        })
                    })
                })
                const modalClose = document.querySelector('.modal-close')
                modalClose.addEventListener('click', () => {
                    if (document.querySelector(('.user-info'))) {
                        document.querySelector('.user-info').remove()
                    }
                })
                currentCheckBox.addEventListener('change', (e) => {
                    const {checked} = e.target;
                    const id = item.dataset;
                    const changeStateUser = async () => {
                        await fetch('dashboard/disableAcc', {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json;charset=utf-8',
                            },
                            body: JSON.stringify({"status": checked, ...id, userTerminal})
                        })
                            .then(res => res.json())
                            .then(data => {
                                M.toast({html: data.message})
                            })
                    }
                    changeStateUser()
                })
                currentButton.addEventListener('click', (e) => {
                    const {id} = item.dataset

                    async function deleteUser() {
                        const response = await fetch('dashboard/deleteUser', {
                            method: 'DELETE',
                            headers: {
                                'Content-type': 'application/json;charset=utf-8'
                            },
                            body: JSON.stringify({'id': id, userTerminal})
                        })
                        const data = await response.json()
                        if (response.ok && response.status === 200) {
                            item.remove()
                            M.toast({html: data.message})
                        }
                        if (!response.ok && response.status === 500) {
                            M.toast({html: data.message})
                        }
                    }

                    deleteUser()
                })
            })
        })
    })

    checkLetter.addEventListener('change', (event) => {
        const checkedLetter = event.target.checked
        if (checkedLetter) {
            document.querySelector(".service__end").insertAdjacentHTML('afterend', `
            <input type="text" placeholder="Введите литеру" class="service__letter"/>
        `)
        }
        const serviceLetter = document.querySelector('.service__letter')
        if (!checkedLetter) {
            document.querySelector('.service__letter').remove()
            letterService = undefined
        }
        serviceLetter.addEventListener('change', (event) => {
            letterService = event.target.value
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
                "name": roleInput, "cab": cabInput, "terminalName": terminlInput, "isReg": checkedVal,
                isNotice: 0 || isNotice.checked, sendNotice: 0 || sendNotice.checked
            })
        })
            .then(res => res.json())
            .then(data => {
                const rolesInput = document.querySelectorAll('.add__role input')
                rolesInput.forEach(input => {
                    input.value = ""
                    if (input.type === "checkbox") {
                        input.checked = false
                    }
                })
                M.toast({html: data.message})
            })
    }

    addNewRole()
})
const termninalButton = document.querySelector('.terminal__button');
termninalButton.addEventListener('click', () => {
    const terminalInput = document.querySelector('.terminal__input').value;
    const terminalDesc = document.querySelector('.terminal__desc').value;

    async function addNewTerminal() {
        await fetch('dashboard/addNewTerminal', {
            method: 'POST',
            headers: {
                "Content-type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({"terminalName": terminalInput, "descriptionText": terminalDesc})
        })
            .then(() => {
                const terminalInput = document.querySelectorAll('.add__terminal input')
                terminalInput.forEach(input => {
                    input.value = ""
                })
            })
    }

    addNewTerminal()
})


const terminalStats = document.querySelector('.terminal__stats')
const statsContainer = document.querySelector('.stats__container')
terminalStats.addEventListener('change', (event) => {

    if (document.querySelector('.current__terminal')) {
        document.querySelector('.current__terminal').remove()
    }

    statsContainer.insertAdjacentHTML('afterbegin', `
            <div class="current__terminal">
             <input type="date" class="datepicker">
            </div>
      `)
    const datepicker = document.querySelector('.datepicker')
    datepicker.addEventListener('change', ({target}) => {
        const {value} = target
        const getStat = async () => {
            const response = await fetch(`/dashboard/get-stat?terminal=${event.target.value}&date=${value}`)
            const data = await response.json()

            statsContainer.insertAdjacentHTML('beforeend', `
                <div class="stats__tickets">
                    <div class="ticket__header">
                        <span class="head__name">Название</span> 
                        <span class="head__call">Вызванные</span>
                        <span class="head_complete">Выполненные</span> 
                    </div>
                </div> 
            `)

            data.map(item => {
                document.querySelector('.stats__tickets').insertAdjacentHTML('beforeend', `
                  <div class="stats__item">
                    <div class="stats__name">
                        ${item.description}
                    </div>
                    <div class="stats__pointer">
                        ${item.isCall}
                    </div>
                     <div class="stats__pointer">
                        ${item.isComplete}
                    </div>
                </div>
               
               `)
            })
        }
        getStat()
    })
})
