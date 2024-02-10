// Получение элементов DOM.
const buttonAdd = document.getElementById('column__button-add')
const modal = document.getElementById('modal')
const modalAdd = document.getElementById('modal__task-add')
const modalAddCancel = document.getElementById('modal__cancel-add')
const modalAddConfirm = document.getElementById('modal__confirm-add')
const taskListTodo = document.getElementById('column__list-todo')
const taskListProgress = document.getElementById('column__list-progress')
const taskListDone = document.getElementById('column__list-done')
const columnList = [taskListTodo, taskListProgress, taskListDone]
const counterTodo = document.getElementById('column__counter-todo')
const counterProgress = document.getElementById('column__counter-progress')
const counterDone = document.getElementById('column__counter-done')
const containerWarning = document.getElementById('modal__warning-container')
const deleteAllButton = document.getElementById('column__button-delete-all')

//time
const time = setInterval(currentTime, 0);
function currentTime(){
  let now = new Date();
  const currentTime =  document.getElementById("clock");
  currentTime.innerHTML = now.toLocaleTimeString();
}



//обработчик событий
const toggleItem = document.getElementById('toggle_theme')
toggleItem.addEventListener('click', toggleTheme)

const getTheme = (theme) => {
  return JSON.parse(localStorage.getItem(theme) ?? '[]')
 }
 
 const setTheme = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
 }

//функция переключения темы
   
  function toggleTheme(){
    if(getTheme('theme') === 'dark'){
    document.documentElement.setAttribute('theme', 'light');  
    setTheme('theme', 'light')
  }
  else{
    document.documentElement.setAttribute('theme', 'dark');
    setTheme('theme', 'dark')
  }

}


//toggle theme

const init = () =>{
  let theme = null
  getTheme('theme').length > 0 ? theme = getTheme('theme') : theme = 'light'
  document.documentElement.setAttribute('theme', `${theme}`)
}
init()








// кнопка удаления, всех задачь.
deleteAllButton.addEventListener('click', () => generateModal('questionDeleteAll', 'Delete all completed tasks?'))

function removeAllItems() {
  const tasks = getTasks()
  const updatedTasks = tasks.filter(task => task.status !== 'done')
  setTasks(updatedTasks)
  renderTask()
}

// Кнопка создания задачи.
buttonAdd.addEventListener('click', () => generateModal('createTask'))

// Получаем задачи из хранилища.
function getTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  return tasks
}

// Сохраняем задачи в хранилище.
function setTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Рендеринг карточек задач.
function renderTask() {
  // Очищаем содержимое колонок.
  columnList.forEach((element) => {element.innerHTML = ''})
  // рендерим карточки в колонках.
  const tasks = getTasks()
  tasks.forEach(({ id, status, title, description, user }) => createTaskCard(id, status, title, description, user))
}


// Создание и добавление карточки задачи в соответствующую колонку
function createTaskCard(id, status, title, description, user) {
  const column = getColumnName(status)
  const taskCard = document.createElement('div')
  taskCard.classList.add('column__task')
  taskCard.id = id
  // new code 
  taskCard.user = user; 
  column.append(taskCard)

  // new code 
  createTaskTitle(taskCard, id, title, description, user)
  updateTaskCounter()
}

// Получение соответствующей колонки для задачи в зависимости от статуса.
function getColumnName(status) {
  if (status === 'todo') {
    return taskListTodo
  } else if (status === 'progress') {
    return taskListProgress
  } else {
    return taskListDone
  }
}


// Создание и добавление заголовка задачи
function createTaskTitle(taskCard, id, title, description, user) {
  const taskTitle = document.createElement('h3')
  taskTitle.classList.add('column__task-title')
  taskTitle.textContent = title;
  
  // new code 
  const userInfo = document.createElement('div');
  userInfo.classList.add('column__task-user');
  userInfo.textContent = user;

  // new code 
  taskTitle.prepend(userInfo);
  taskCard.append(taskTitle);
  createTaskDescription(taskCard, id, description)
}

// Создание и добавление описания задачи.
function createTaskDescription(taskCard, id, description) {
  const taskDescription = document.createElement('div')
  taskDescription.classList.add('column__task-description')
  taskDescription.textContent = description
  taskCard.append(taskDescription)
  createTaskControlPanel(taskCard, id)
}

function createTaskControlPanel(taskCard, id) {
  const controlPanel = document.createElement('div')
  controlPanel.classList.add('column__task-control')
  taskCard.append(controlPanel)
  createTaskControlItem(controlPanel, id)
}

// Создание и добавление элементов управления задачей.
function createTaskControlItem(controlPanel, id) {
  const tasks = getTasks()
  const taskIndex = searchById(tasks, id)
  if (tasks[taskIndex].status === 'todo') {
    controlPanelTodo(controlPanel, taskIndex)
  } else if (tasks[taskIndex].status === 'progress') {
    controlPanelProgress(controlPanel, taskIndex)
  } else {
    controlPanelDone(controlPanel, taskIndex)
  }
}

function controlPanelTodo(controlPanel, taskIndex) {
  const buttonEdit = createButton('edit', 'column__task-button column__button-edit', 'button')
  const buttonDelete = createButton('delete', 'column__task-button column__button-delete', 'button')
  const buttonSubmit = createButton('>', 'column__task-button column__button-submit', 'button')
  buttonEdit.addEventListener('click', () => generateModal('editTask', 'description', taskIndex))
  buttonDelete.addEventListener('click', () => generateModal('questionDelete', 'Delete task?', taskIndex))
  buttonSubmit.addEventListener('click', () => generateModal('questionProgress', 'start task?', taskIndex))
  controlPanel.append(buttonEdit, buttonDelete, buttonSubmit)
}

function controlPanelProgress(controlPanel, taskIndex) {
  const buttonCancel = createButton('cancel', 'column__task-button column__button-cancel', 'button')
  const buttonComplete = createButton('Complete', 'column__task-button column__button-complete', 'button')
  buttonCancel.addEventListener('click', () => generateModal('questionTodo', 'Cancel task execution?', taskIndex))
  buttonComplete.addEventListener('click', () => generateModal('questionDone', 'to perform the task?', taskIndex))
  controlPanel.append(buttonCancel, buttonComplete)
}

function controlPanelDone(controlPanel, taskIndex) {
  const buttonDelete = createButton('delete', 'column__task-button column__button-delete', 'button')
  buttonDelete.addEventListener('click', () => generateModal('questionDelete', 'you are sure?', taskIndex))
  controlPanel.append(buttonDelete)
}

// Обновляет счетчики.
function updateTaskCounter() {
  const tasks = getTasks()
  counterTodo.textContent = tasks.filter(task => task.status === 'todo').length
  counterProgress.textContent = tasks.filter(task => task.status === 'progress').length
  counterDone.textContent = tasks.filter(task => task.status === 'done').length
}

// обновляют статус при перетаскивании.
function newTaskStatus(tasks, tasksIndex, newStatus) {
  tasks[tasksIndex].status = newStatus
  setTasks(tasks)
  renderTask()
}

// Создание кнопки с указанными параметрами.
function createButton(text, className, type) {
  const button = document.createElement('button')
  button.className = className
  button.type = type
  button.textContent = text
  return button
}

// Удаление задачи по ID.
function deleteTask(taskIndex) {
  const tasks = getTasks()
  tasks.splice(taskIndex, 1)
  setTasks(tasks)
  renderTask()
}

// Поиск индекса задачи по ID.
function searchById(tasks, searchId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === searchId) {
      return i
    }
  }
}

// Создание новой задачи.
function createTask() {
  const tasks = getTasks()
  const modalAddTitle = document.getElementById('modal__input-title');

  // new code 
  const userInfo = document.querySelector('.modal__select-user');
  const user = userInfo.value

  const title = modalAddTitle.value
  const modalAddDescription = document.getElementById('modal__description')
  const description = modalAddDescription.value
  const id = generateId(tasks)
  const status = 'todo'; 

  // new code 
  const newTask = { id, status, title, description, user }


  tasks.push(newTask)
  localStorage.setItem('tasks', JSON.stringify(tasks))
  modalAddTitle.value =''
  modalAddDescription.value = ''
  deleteModal()
  renderTask()
}

// Генерация уникального ID для задачи.
function generateId(tasks) {
  const randomNumber = Math.random()
  const createdId = String(randomNumber).slice(-5)
  tasks.forEach(({id}) => {if (id === createdId) {return generateId(tasks)}});
  return createdId
}

// Редактирование задачи.
function editTask(taskIndex) {
  const todos = getTasks()
  const modalTitle = document.getElementById('modal__input-title')
  const modalDescription = document.getElementById('modal__description')
  const userInfo = document.querySelector('.modal__select-user');

  const newTitle = modalTitle.value
  const newDescription = modalDescription.value

  // new code 
  const newUser = userInfo.value

  todos[taskIndex].title = newTitle
  todos[taskIndex].description = newDescription

  // new code 
  todos[taskIndex].user = newUser

  setTasks(todos)
  deleteModal()
  renderTask()
}

// Собирает модальное окно по типу.
function generateModal(type, description, taskIndex) {
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
    const buttonCancel = createModalButton('Cancel', 'modal__button-cancel', 'button')
    const buttonConfirm = createModalButton('Confirm', 'modal__button-confirm', 'button')
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

function deleteModal() {
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
        throw new Error('Не удалось получить данные пользователей');
      }
      return response.json();
    })
    .then(users => {
      const uniqueEmails = [...new Set(users.map(users => users.name))];
      uniqueEmails.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        selectUser.appendChild(option);
      });
    })
    .catch(error => {
      console.error(error);
    });
}




