import { buttonAdd, modal, deleteAllButton } from "./components.js"

import { getTasks } from "../localStorage.js"

import { renderTask } from "../rendering.js"

import { newTaskStatus, deleteTask } from "../renderOperations.js"

import { createTask, editTask, removeAllItems } from "../tasks.js"

// Собирает модальное окно по типу.
export function generateModal(type, description, taskIndex) {
    if (type === 'createTask' || type === 'editTask') {
        createModalTask(type, taskIndex)
    } else if (type === 'questionDelete' || type === 'questionDeleteAll') {
        createModalWarning(type, description, taskIndex)
    } else if (type === 'questionProgress' || type === 'questionTodo' || type === 'questionDone') {
        createModalWarning(type, description, taskIndex)
    } else if (type === 'confirmation') {
        createModalWarning(type, description, taskIndex)
    } else {console.error('Type undefined:', type)}
}
  
// Собирает модальное окно, для создания задачи.
function createModalTask(type, taskIndex) {
    const form = createModalForm('modal__task-form')
    modal.append(form)
    createModalTitle(form, type, taskIndex)
    createModalDescription(form, type, taskIndex)
    createModalFooter(form, type, taskIndex)
}
  
// Создаёт форму модального окна.
function createModalForm(id) {
    const form = document.createElement('form')
    form.method = 'get'
    form.id = id
    return form
}
  
// собирвет модальное окно warning.
function createModalWarning(type, titleText, taskIndex) {
    const form = createModalForm('modal__warning')
    modal.append(form)
    createWarningTitle(form, titleText)
    createModalFooter(form, type, taskIndex, taskIndex)
}
  
// Создаёт поле для ввода заголовка задачи.
function createModalTitle(form, type, taskIndex) {
    const divTitle = createDiv('modal__input-container')
    const input = createModalInput(type, taskIndex)
    form.append(divTitle)
    divTitle.append(input)
}
  
// создаёт title для Warning.
function createWarningTitle(form, titleText) {
    const title = document.createElement('h2')
    title.classList.add('modal__title')
    title.textContent = titleText
    form.append(title)
}
  
// Создаёт описание модального окна.
function createModalDescription(form, type, taskIndex) {
    const divTextarea = createDiv('modal__textarea-container') 
    const textarea = createModalTextarea(type, taskIndex)
    
    form.append(divTextarea)
    divTextarea.append(textarea)
}
  
// Создаёт подвал модального окна.
function createModalFooter(form, type, taskIndex) {
    const divFooter = createDiv('modal__footer')
    const divControl = createDiv('modal__control-container')
    if (type === 'createTask' || type === 'editTask') {
        const select = createModalSelect()
        divFooter.append(select)
    }
    form.append(divFooter)
    divFooter.append(divControl)
    generateModalButton(divControl, type, taskIndex)
}
  
// Создаёт панель управлени.
function generateModalButton(divControl, type, taskIndex) {
    if (type === 'createTask' || type === 'editTask') {
        const buttonCancel = createModalButton('Cancel', 'modal__button-cancel', 'button')
        const buttonConfirm = createModalButton('Confirm', 'modal__button-confirm', 'button')
        buttonCancel.addEventListener('click', deleteModal)
        bindingEvents(buttonConfirm, type, taskIndex)
        divControl.append(buttonCancel, buttonConfirm)
    } else if (type === 'questionDelete' || type === 'questionDeleteAll' || type === 'questionProgress' || type === 'questionTodo' || type === 'questionDone') {
        const buttonCancel = createModalButton('cancel', 'modal__button-cancel', 'button')
        const buttonConfirm = createModalButton('confirm', 'modal__button-confirm', 'button')
        buttonCancel.addEventListener('click', deleteModal)
        bindingEvents(buttonConfirm, type, taskIndex)
        divControl.append(buttonCancel, buttonConfirm)
    } else {
        const buttonOk = createModalButton('ok', 'modal__button-ok', 'button')
        bindingEvents(buttonOk, type, taskIndex)
        divControl.append(buttonOk)
    } 
    
    controlModal()
}
  
// Создаёт кнопку, в модаальном окне.
function createModalButton(text, id, type) {
    const button = document.createElement('button')
    button.id = id
    button.type = type
    button.textContent = text
    return button
}
  
// Создаёт див.
function createDiv(className) {
    const div = document.createElement('div')
    div.classList.add(className)
    return div
}
  
// Сзадёт строку ввода, в модальном окне, для заголовка задачи.
function createModalInput(type, taskIndex) {
    const input = document.createElement('input')
    input.id = 'modal__input-title'
    input.type = 'text'
    input.placeholder = 'Title'
    if (type === 'editTask') {
      const tasks = getTasks()
      input.value = tasks[taskIndex].title
    }
    return input
}
  
// Сзадёт строку ввода, в модальном окне, для описания задачи.
function createModalTextarea(type, taskIndex) {
    const textarea = document.createElement('textarea')
    textarea.id = 'modal__description'
    textarea.placeholder = 'Description'
    if (type === 'editTask') {
      const tasks = getTasks()
      textarea.value = tasks[taskIndex].description
    }
    return textarea
}
  
// Создаёт селект списка пользователей в модальном окне.
function createModalSelect(selectId) {
    const select = document.createElement('select');
    select.classList.add('modal__select-user');
    select.id = selectId;
    populateUserEmails(select);
    return select;
}
  
// управляет состоянием модального окна.
function controlModal() {
    modal.showModal()
}

// кнопка удаления, всех задачь.
deleteAllButton.addEventListener('click', () => generateModal('questionDeleteAll', 'Delete all completed tasks?'))
  
// Кнопка создания задачи.
buttonAdd.addEventListener('click', () => generateModal('createTask'))  
  
// вешает нужные обрпботчики.
function bindingEvents(variable, type, taskIndex) {
    if (type === 'createTask') {
        variable.addEventListener('click', () => {checkingPresenceValue(type, taskIndex)})
    } else if (type === 'editTask') {
        variable.addEventListener('click', () => {checkingPresenceValue(type, taskIndex)})
    } else if (type === 'questionDelete') {
        variable.addEventListener('click', () => {deleteModal(); deleteTask(taskIndex)})
    } else if (type === 'questionDeleteAll') {
        variable.addEventListener('click', () => {deleteModal(); removeAllItems()})
    } else if (type === 'questionProgress') {
        const tasks = getTasks()
        variable.addEventListener('click', () => {deleteModal(); newTaskStatus(tasks, taskIndex, 'progress')})
    } else if (type === 'questionTodo') {
        const tasks = getTasks()
        variable.addEventListener('click', () => {deleteModal(); newTaskStatus(tasks, taskIndex, 'todo')})
    } else if (type === 'questionDone') {
        const tasks = getTasks()
        variable.addEventListener('click', () => {deleteModal(); newTaskStatus(tasks, taskIndex, 'done')})
    } else if (type === 'confirmation') {
        const tasks = getTasks()
        variable.addEventListener('click', () => {deleteConfirmation()})
    } else {return}
}
  
  function checkingPresenceValue(type, taskIndex) {
    const title = document.getElementById('modal__input-title').value
    const description = document.getElementById('modal__description').value
    if (description === '' || title === '') {
        const form = document.getElementById('modal__task-form')
        form.style.display = 'none'
        generateModal('confirmation', 'Fill in each field')
    } else {
        if (type === 'createTask') {
            createTask()
        } else {editTask(taskIndex)}
        deleteModal()
    }
}
  
function deleteConfirmation() {
    const modalWarning = document.getElementById('modal__warning')
    const form = document.getElementById('modal__task-form')
    modalWarning.parentNode.removeChild(modalWarning)
    form.style.display = 'block'
}
  
export function deleteModal() {
    modal.close()
    modal.innerHTML = ''
}
  
addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        event.preventDefault();
        deleteModal()
    }
});
  
// Рендеринг задач после загрузки страницы
addEventListener('DOMContentLoaded', renderTask)
    
// получаем пользователей с сервера
function populateUserEmails(selectUser) {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить данные пользователей')
            }
            return response.json()
        })
        .then(users => {
            const uniqueEmails = [...new Set(users.map(users => users.name))]
            uniqueEmails.forEach(name => {
            const option = document.createElement('option')
            option.value = name
            option.textContent = name
            selectUser.appendChild(option)
            })
        })
        .catch(error => {
            console.error(error)
        }
    )
}
  