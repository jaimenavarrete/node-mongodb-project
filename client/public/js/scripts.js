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

        // xhttp.open('GET', 'http://localhost:3001/api/users')
        xhttp.open('GET', 'https://users-datatable-node.herokuapp.com/api/users')
        xhttp.send()

        xhttp.onreadystatechange = () => {
            if(xhttp.readyState === 4 && xhttp.status === 200) {
                const data = JSON.parse(xhttp.responseText)

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
    row.dataset.id = item._id
    
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
            for(let data of Object.values(client)) {
                if(data.toString().toLowerCase().includes(searchBar.value.toLowerCase()))
                    return true
            }
                

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


// MODAL WINDOW (CREATE, UPDATE AND DELETE)

const createUserBtn = document.getElementById('create-user-btn'),
      editUserBtn = document.getElementById('edit-user-btn'),
      deleteUserBtn = document.getElementById('delete-user-btn'),
      modalContainer = document.getElementById('modal-container'),
      modalFormContainer = document.getElementById('modal-form-container'),
      modalForm = document.getElementById('modal-form'),
      modalContainerClose = document.getElementById('modal-container-close'),
      modalFormTitle = document.getElementById('modal-form-title'),
      modalFormBtn = document.getElementById('modal-form-submit')
      
const status = document.getElementById('status'),
      name = document.getElementById('name'),
      company = document.getElementById('company'),
      country = document.getElementById('country'),
      email = document.getElementById('email')


modalContainerClose.addEventListener('click', () => {
    modalContainer.classList.remove('modal-container-active');
})

modalContainer.addEventListener('click', () => {
    modalContainer.classList.remove('modal-container-active');
})

modalFormContainer.addEventListener('click', e => e.stopPropagation())


createUserBtn.addEventListener('click', () => {
    modalFormTitle.textContent = 'Agregar un nuevo usuario'
    modalFormBtn.innerHTML = `<i class="las la-pen"></i> Agregar usuario`


    modalForm.dataset.id = ''
    status.value = '#'
    name.value = ''
    company.value = ''
    country.value = '#'
    email.value = ''

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
            text: 'You must choose only one user to edit',
            icon: 'error'
        })
    }
    else {
        modalFormTitle.textContent = 'Editar un usuario existente'
        modalFormBtn.innerHTML = `<i class="las la-pen"></i> Editar usuario`

        const userData = clientsData.find(user => user._id === rowsChecked[0].dataset.id)
        
        modalForm.dataset.id = userData._id
        status.value = userData.status
        name.value = userData.nombre
        company.value = userData.company
        country.value = userData.country
        email.value = userData.email

        modalContainer.classList.add('modal-container-active')
    }
})

deleteUserBtn.addEventListener('click', () => {
    const rows = Array.from(document.querySelectorAll('#rows-clients tr'))

    const rowsCheckedArray = rows.reduce((acc, row) => {
        if(row.children[1].children[0].checked) 
            return acc = [...acc, { _id: row.dataset.id }]

        return acc
    }, [])

    if(rowsCheckedArray.length === 0) {        
        Swal.fire({
            title: 'Error',
            text: 'You must select one or more users to delete',
            icon: 'error'
        })
    }
    else {
        Swal.fire({
            title: 'Delete user',
            text: `Are you sure to delete this ${rowsCheckedArray.length} user/s?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
        })
        .then(result => {
            if(result.isConfirmed) {
                const rowsChecked = Object.assign({}, rowsCheckedArray)

                const xhttp = new XMLHttpRequest()
                // xhttp.open('DELETE', 'http://localhost:3001/api/users')
                xhttp.open('DELETE', 'https://users-datatable-node.herokuapp.com/api/users')
                xhttp.setRequestHeader('Content-Type', 'application/json')
                xhttp.send(JSON.stringify(rowsChecked))

                xhttp.onreadystatechange = async () => {
                    if(xhttp.readyState === 4 && xhttp.status === 200) {
                        const data = xhttp.responseText

                        Swal.fire({
                            title: 'Success',
                            text: data,
                            icon: 'success'
                        })

                        await getClientsData()
                        printCompleteClientsData()
                    }
                }
            }
        })
    }
})


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

    if(!modalForm.dataset.id) {
        xhttp.open('POST', 'https://users-datatable-node.herokuapp.com/api/users')
        // xhttp.open('POST', 'http://localhost:3001/api/users')
    }
    else {
        dataObject._id = modalForm.dataset.id

        xhttp.open('PUT', 'https://users-datatable-node.herokuapp.com/api/users')
        // xhttp.open('PUT', 'http://localhost:3001/api/users')
    }

    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(JSON.stringify(dataObject))

    xhttp.onreadystatechange = async () => {
        if(xhttp.readyState === 4 && xhttp.status === 200) {
            const {title, text, icon} = JSON.parse(xhttp.responseText)

            Swal.fire({ title, text, icon })

            if(icon === 'success') modalContainer.click()

            await getClientsData()
            printCompleteClientsData()
        }
    }

    // fetch('http://localhost:3001/api/users/', {
    //     method: 'POST',
    //     body: JSON.stringify(dataObject)
    // });
})