// VARIABLES AND CONSTANTS

const searchItem = document.getElementById('search-item'),
      searchBar = document.getElementById('search-bar'),
      checkboxSelectAll = document.getElementById('select-all'),
      rowsClientsContainer = document.getElementById('rows-clients'),
      entriesNumber = document.getElementById('entries-number'),
      paginationContainer = document.getElementById('pagination-container')

let clientsData = [],
    searchedClientsData = [],
    clientsPerPage,
    currentPage = 0,
    pages


// FUNCTIONS

// Gets all the clients from our API in JSON format, with AJAX

const getClientsData = () => new Promise(resolve => {
        const xhttp = new XMLHttpRequest()

        // xhttp.open('GET', 'https://www.json-generator.com/api/json/get/bZvyOuDMlK?indent=2')
        // xhttp.open('GET', 'http://www.json-generator.com/api/json/get/ceDXcPLqsy?indent=2') // 3200 Datos
        xhttp.open('GET', 'http://localhost:3001/api/users')
        xhttp.send()

        xhttp.onreadystatechange = () => {
            if(xhttp.readyState === 4 && xhttp.status === 200) {
                const data = JSON.parse(xhttp.responseText)

                data.forEach(item => {
                    switch(item.status) {
                        case 0: item.status = 'Offline'
                            break;
                        case 1: item.status = 'Away'
                            break;
                        case 2: item.status = 'Active'
                            break;
                    }
                })

                clientsData = data

                resolve(true)
            }
        }
    })

const getEntriesNumber = () => {
    clientsPerPage = entriesNumber.value === 'all' 
                     ? clientsData.length 
                     : entriesNumber.value

    if(clientsPerPage > clientsData.length)
        clientsPerPage = clientsData.length
}

const getPagesNumber = () => {
    if(clientsPerPage === 0) return null

    pages = Math.ceil(clientsData.length / clientsPerPage)
}

const printPaginationButtons = () => {
    paginationContainer.innerHTML = ''

    let initialButton = currentPage > 2 ? currentPage - 2 : 0,
        lastButton = currentPage > pages - 3 ? pages - 1 : initialButton + 4

    if(currentPage > pages - 3) initialButton = pages - 5

    if(pages < 6) {
        initialButton = 0
        lastButton = pages - 1
    }
    

    if(pages > 5 && initialButton > 0) {
        paginationContainer.innerHTML += `
            <button class="pagination-item">
                ${1}
            </button>
            <span class="divider">...</span>
        `
    }

    for(let i = initialButton; i <= lastButton; i++) {
        if(entriesNumber.value === 'all') return

        paginationContainer.innerHTML += `
            <button class="pagination-item ${currentPage === i ? 'active' : ''}">
                ${i+1}
            </button>
        `
    }

    if(pages > 5 && lastButton < pages - 1) {
        paginationContainer.innerHTML += `
            <span class="divider">...</span>
            <button class="pagination-item">
                ${pages}
            </button>
        `
    }
}


const printRegisterRow = (position, item) => {
    const row = document.createElement('tr')
    
    row.innerHTML = `
        <td>${position}</td>
        <td><input type="checkbox" name="select"></td>
        <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
        <td>${item.nombre}</td>
        <td>${item.company}</td>
        <td>${item.country}</td>
        <td>${item.email}</td>
    `

    return row
}

const printCompleteClientsData = () => {
    getEntriesNumber()
    getPagesNumber()

    printPaginationButtons()

    let initialClient = currentPage * clientsPerPage,
        finalClient = initialClient + (clientsPerPage - 1)

    rowsClientsContainer.innerHTML = ''

    const templateRows = document.createDocumentFragment()

    for(let i = initialClient; i <= finalClient; i++) {
        if(i >= clientsData.length) break

        templateRows.appendChild(printRegisterRow(i+1, clientsData[i]))
    }

    rowsClientsContainer.appendChild(templateRows)
}


const getSearchedClientsData = () => {
    searchedClientsData = clientsData.filter(client => {
        if(searchItem.value === 'anything') {
            client.id = ''
            client._id = ''

            // Gets the values of the client object and put them into an array
            // then seeks if the text exists in one of the array's elements
            for(let data of Object.values(client))
                if(data.toString().toLowerCase().includes(searchBar.value.toLowerCase()))
                    return true

            return false
        }

        return client[searchItem.value].toLowerCase().includes(searchBar.value.toLowerCase())
    })
}

const printSearchedClientsData = () => {
    if(searchBar.value !== "") {
        getSearchedClientsData()

        rowsClientsContainer.innerHTML = ''
        paginationContainer.innerHTML = ''

        const templateRows = document.createDocumentFragment()

        for(let i = 0; i < searchedClientsData.length; i++)
            templateRows.appendChild(printRegisterRow(i+1, searchedClientsData[i]))
        
        rowsClientsContainer.appendChild(templateRows)
    }
    else {
        printCompleteClientsData()
    }
}


// Checks or unchecks the client row where we do click

const checkRowTable = e => {
    const rows = Array.from(rowsClientsContainer.querySelectorAll('tr'))

    for(let row of rows) {
        const parent = e.target.parentElement

        if(row === parent) {
            const checkbox = parent.querySelector('input')

            if(checkbox)
                return checkbox.checked = !checkbox.checked
        }
    }
}

const checkAllRowsTable = () => {
    const rows = Array.from(rowsClientsContainer.querySelectorAll('tr')),
        selectAll = checkboxSelectAll.checked ? true : false;

    for(let row of rows) {
        const checkbox = row.querySelector('input')

        checkbox.checked = selectAll ? true : false
    }
}


// Functionality of the buttons in the pagination of the datatable

const getCurrentPage = e => {
    const buttonsPagination = paginationContainer.querySelectorAll('button')

    for(let button of buttonsPagination) {
        if(button === e.target) {
            currentPage = e.target.textContent.trim() - 1
            return
        }
    }
}


// EVENTS

addEventListener('DOMContentLoaded', async () => {
    await getClientsData()
    printCompleteClientsData()
})

searchBar.addEventListener('keyup', printSearchedClientsData)

checkboxSelectAll.addEventListener('change', checkAllRowsTable)

rowsClientsContainer.addEventListener('click', e => checkRowTable(e))

entriesNumber.addEventListener('change', () => {
    currentPage = 0
    printCompleteClientsData()
})

paginationContainer.addEventListener('click', e => {
    getCurrentPage(e)
    printCompleteClientsData()
})


// MODAL WINDOW (CREATE AND EDIT)

const createUserBtn = document.getElementById('create-user-btn'),
      editUserBtn = document.getElementById('edit-user-btn'),
      deleteUserBtn = document.getElementById('delete-user-btn'),
      modalContainer = document.getElementById('modal-container'),
      modalFormContainer = document.getElementById('modal-form-container'),
      modalForm = document.getElementById('modal-form'),
      modalContainerClose = document.getElementById('modal-container-close'),
      modalFormTitle = document.getElementById('modal-form-title'),
      modalFormBtn = document.getElementById('modal-form-submit')

modalContainerClose.addEventListener('click', () => {
    modalContainer.classList.remove('modal-container-active');
})

modalContainer.addEventListener('click', () => {
    modalContainer.classList.remove('modal-container-active');
})

modalFormContainer.addEventListener('click', e => e.stopPropagation())

modalForm.addEventListener('submit', e => {
    e.preventDefault();

    const xhttp = new XMLHttpRequest()
    const formData = new FormData(modalForm)

    const dataObject = {
        status: formData.get('status'),
        country: formData.get('country'),
        company: formData.get('company'),
        nombre: formData.get('name'),
        email: formData.get('email')
    }

    xhttp.open('POST', 'http://localhost:3001/api/users')
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(JSON.stringify(dataObject))

    xhttp.onreadystatechange = async () => {
        if(xhttp.readyState === 4 && xhttp.status === 200) {
            const data = xhttp.responseText

            await getClientsData()
            printCompleteClientsData()

            alert(data)
        }
    }

    // fetch('http://localhost:3001/api/users/', {
    //     method: 'POST',
    //     body: JSON.stringify(dataObject)
    // });
})

createUserBtn.addEventListener('click', () => {
    modalFormTitle.textContent = 'Agregar un nuevo usuario'
    modalFormBtn.textContent = 'Agregar usuario'

    modalContainer.dataset.user = null;
    modalContainer.classList.add('modal-container-active')
})

editUserBtn.addEventListener('click', () => {
    const rows = Array.from(document.querySelectorAll('#rows-clients tr'))
    
    const rowsChecked = rows.filter(row => {
        if(row.children[1].children[0].checked === true)
            return row
    })

    if(rowsChecked.length === 0) {
        Swal.fire({
            title: 'Error',
            text: 'You must select one user to edit',
            icon: 'error'
        })
    }
    else if(rowsChecked.length > 1) {
        Swal.fire({
            title: 'Error',
            text: 'You can only choose one user to edit',
            icon: 'error'
        })
    }
    else {
        modalFormTitle.textContent = 'Editar un usuario existente'
        modalFormBtn.textContent = 'Editar usuario'

        modalContainer.classList.add('modal-container-active')
        console.log(rowsChecked)
    }
})

deleteUserBtn.addEventListener('click', () => {
    const rows = Array.from(document.querySelectorAll('#rows-clients tr'))
    
    const rowsChecked = rows.filter(row => {
        if(row.children[1].children[0].checked === true)
            return row
    })

    if(rowsChecked.length === 0) {        
        Swal.fire({
            title: 'Error',
            text: 'You must select one or more users to delete',
            icon: 'error'
        })
    }
    else {
        Swal.fire({
            title: 'Delete user',
            text: 'Are you sure to delete this user/s?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
        })
        .then(result => {
            if(result.isConfirmed) {
                Swal.fire({
                    title: 'User'
                })
            }
        })

        console.log(rowsChecked)
    }
})