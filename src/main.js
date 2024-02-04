// Получение элементов DOM
const buttonAdd = document.getElementById('column__button-add')
const modal = document.getElementById('modal')
const modalAdd = document.getElementById('modal__task-add')
const modalAddCancel = document.getElementById('modal__cancel-add')
const modalAddConfirm = document.getElementById('modal__confirm-add')
const taskListTodo = document.getElementById('column__list-todo')
const taskListProgress = document.getElementById('column__list-progress')
const taskListDone = document.getElementById('column__list-done')
const columnList = [taskListTodo, taskListProgress, taskListDone]
const counterTodo = document.getElementById('column__counter-todo');
const counterProgress = document.getElementById('column__counter-progress');
const counterDone = document.getElementById('column__counter-done');
const containerWarning = document.getElementById('modal__warning-container')
const deleteAllButton = document.getElementById('column__button-delete-all');

deleteAllButton.addEventListener('click', () => generateModal('questionDeleteAll', 'Delete all completed tasks?'));

function removeAllItems() {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.status !== 'done');
  setTasks(updatedTasks);
  renderTask();
}

buttonAdd.addEventListener('click', () => generateModal('createTask'))

// Получаем задачи из хранилища.
function getTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  return tasks
}

// Сохраняем задачи в хранилище
function setTasks(tasks) {
  localStorage.setItem('tasks',JSON.stringify(tasks))
}

function closeModalchoice() {
  containerWarning.innerHTML = ''
}

// Рендеринг карточек задач
function renderTask() {
  // Очищаем содержимое колонок
  columnList.forEach((element) => {element.innerHTML = ''})
  // рендерим карточки в колонках
  const tasks = getTasks()
  tasks.forEach(({ id, status, title, description }) => createTaskCard(id, status, title, description))
}

// Создание и добавление карточки задачи в соответствующую колонку
function createTaskCard(id, status, title, description) {
  const column = getColumnName(status)
  const taskCard = document.createElement('div')
  taskCard.classList.add('column__task')
  taskCard.id = id
  column.append(taskCard)
  createTaskTitle(taskCard, id, title, description)
  updateTaskCounter()
}

// Получение соответствующей колонки для задачи в зависимости от статуса
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
function createTaskTitle(taskCard, id, title, description) {
  const taskTitle = document.createElement('h3')
  taskTitle.classList.add('column__task-title')
  taskTitle.textContent = title
  taskCard.append(taskTitle)
  createTaskDescription(taskCard, id, description)
}

// Создание и добавление описания задачи
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

// Создание и добавление элементов управления задачей
function createTaskControlItem(controlPanel, id) {
  const tasks = getTasks()
  const taskIndex = searchById(tasks, id)
  if (tasks[taskIndex].status === 'todo') {
    controlPanelTodo(controlPanel, tasks, taskIndex)
  } else if (tasks[taskIndex].status === 'progress') {
    controlPanelProgress(controlPanel, tasks, taskIndex)
  } else {
    controlPanelDone(controlPanel, taskIndex)
  }
}

function controlPanelTodo(controlPanel, tasks, taskIndex) {
  const buttonEdit = createButton('edit', 'column__task-button column__button-edit', 'button')
  const buttonDelete = createButton('delete', 'column__task-button column__button-delete', 'button')
  const buttonSubmit = createButton('>', 'column__task-button column__button-submit', 'button')
  buttonEdit.addEventListener('click', () => generateModal('editTask', 'description', taskIndex))
  buttonDelete.addEventListener('click', () => generateModal('questionDelete', 'Delete task?', taskIndex))
  buttonSubmit.addEventListener('click', () => newTaskStatus(tasks, taskIndex, 'progress'))
  controlPanel.append(buttonEdit, buttonDelete, buttonSubmit)
}

function controlPanelProgress(controlPanel, tasks, taskIndex) {
  const buttonCancel = createButton('cancel', 'column__task-button column__button-cancel', 'button')
  const buttonComplete = createButton('Complete', 'column__task-button column__button-complete', 'button')
  buttonCancel.addEventListener('click', () => newTaskStatus(tasks, taskIndex, 'todo'))
  buttonComplete.addEventListener('click', () => generateModal('questionDone', taskIndex))
  controlPanel.append(buttonCancel, buttonComplete)
}

function controlPanelDone(controlPanel, taskIndex) {
  const buttonDelete = createButton('delete', 'column__task-button column__button-delete', 'button')
  buttonDelete.addEventListener('click', () => generateModal('questionDelete', 'you are sure?', taskIndex))
  controlPanel.append(buttonDelete)
}

// Обновляет счетчики
function updateTaskCounter() {
  const tasks = getTasks()
  counterTodo.textContent = tasks.filter(task => task.status === 'todo').length
  counterProgress.textContent = tasks.filter(task => task.status === 'progress').length
  counterDone.textContent = tasks.filter(task => task.status === 'done').length
}

// обновляют статус при перетаскивании
function newTaskStatus(tasks, tasksIndex, newStatus) {
  tasks[tasksIndex].status = newStatus
  setTasks(tasks)
  renderTask()
}

// Создание кнопки с указанными параметрами
function createButton(text, className, type) {
  const button = document.createElement('button')
  button.className = className
  button.type = type
  button.textContent = text
  return button
}

// Удаление задачи по ID
function deleteTask(taskIndex) {
  const tasks = getTasks()
  tasks.splice(taskIndex, 1)
  setTasks(tasks)
  renderTask()
}

// Поиск индекса задачи по ID
function searchById(tasks, searchId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === searchId) {
      return i
    }
  }
}

// Создание новой задачи
function createTask() {
  const tasks = getTasks()
  const modalAddTitle = document.getElementById('modal__input-title')
  const title = modalAddTitle.value
  const modalAddDescription = document.getElementById('modal__description')
  const description = modalAddDescription.value
  const id = generateId(tasks)
  const status = 'todo'
  const newTask = { id, status, title, description }
  tasks.push(newTask)
  localStorage.setItem('tasks', JSON.stringify(tasks))
  modalAddTitle.value =''
  modalAddDescription.value = ''
  deleteModal()
  renderTask()
}

// Генерация уникального ID для задачи
function generateId(tasks) {
  const randomNumber = Math.random()
  const createdId = String(randomNumber).slice(-5)
  tasks.forEach(({id}) => {if (id === createdId) {return generateId(tasks)}});
  return createdId
}

function editTask(taskIndex) {
  const todos = getTasks()
  const modalTitle = document.getElementById('modal__input-title')
  const modalDescription = document.getElementById('modal__description')
  const newTitle = modalTitle.value
  const newDescription = modalDescription.value
  todos[taskIndex].title = newTitle
  todos[taskIndex].description = newDescription
  setTasks(todos)
  deleteModal()
  renderTask()
}

// Собирает модальное окно по типу.
// type = ['createTask', 'editTask', 'modalQuestionCreate', 'modalQuestionEdit', 'questionDelete', modalConfirmation, confirmation]
function generateModal(type, description, taskIndex) {
  if (type === 'createTask' || type === 'editTask') {
    createModalTask(type, taskIndex)
  } else if (type === 'modalQuestionCreate' || type === 'modalQuestionEdit') {
    createModalWarning(type, description, taskIndex)
  } else if (type === 'modalQuestion' || type === 'question' || type === 'questionDelete' || type === 'modalConfirmation' || type === 'confirmation' || type === 'questionDeleteAll' || type === 'questionDone') {
    createModalWarning(type, description, taskIndex)
  } else {console.error('Type undefined:', type)}
}

// Собирает модальное окно, для создания задачи.
function createModalTask(type, taskIndex) {
  const form = createModalForm('modal__task-form')
  form.style.display = 'block'
  modal.append(form)
  createModalTitle(form)
  createModalDescription(form)
  createModalFooter(form, type, taskIndex)
}

// Создаёт форму модального окна.
function createModalForm(id) {
  const form = document.createElement('form')
  form.method = 'get'
  form.id = id
  return form
}

// собирвет модальное окно warning
function createModalWarning(type, titleText, taskIndex) {
  const form = createModalForm('modal__warning')
  modal.append(form)
  createWarningTitle(form, titleText)
  createModalFooter(form, type, taskIndex)
}

// Создаёт поле для ввода заголовка задачи.
function createModalTitle(form) {
  const divTitle = createDiv('modal__input-container')
  const input = createModalInput()
  
  form.append(divTitle)
  divTitle.append(input)
}

// создаёт title для Warning
function createWarningTitle(form, titleText) {
  const title = document.createElement('h2')
  title.classList.add('modal__title')
  title.textContent = titleText
  form.append(title)
}

// Создаёт описание модального окна.
function createModalDescription(form) {
  const divTextarea = createDiv('modal__textarea-container') 
  const textarea = createModalTextarea()
  
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
  } else if (type === 'modalQuestionCreate' || type === 'modalQuestionEdit') {
    const buttonCancel = createModalButton('Cancel', 'modal__button-cancel', 'button')
    const buttonConfirm = createModalButton('Confirm', 'modal__button-confirm', 'button')
    const formWarning = document.getElementById('modal__warning')
    const formTask = document.getElementById('modal__task-form')
    buttonCancel.addEventListener('click', () => {removeModal(formWarning); openTaskModal(formTask)})
    bindingEvents(buttonConfirm, type, taskIndex)
    divControl.append(buttonCancel, buttonConfirm)
  } else if (type === 'questionDelete') {
    const buttonCancel = createModalButton('Cancel', 'modal__button-cancel', 'button')
    const buttonConfirm = createModalButton('Confirm', 'modal__button-confirm', 'button')
    buttonCancel.addEventListener('click', deleteModal)
    bindingEvents(buttonConfirm, type, taskIndex)
    divControl.append(buttonCancel, buttonConfirm)
  } else if (type === 'questionDeleteAll') {
    const buttonCancel = createModalButton('Cancel', 'modal__button-cancel', 'button')
    const buttonConfirm = createModalButton('Confirm', 'modal__button-confirm', 'button')
    buttonCancel.addEventListener('click', deleteModal)
    bindingEvents(buttonConfirm, type)
    divControl.append(buttonCancel, buttonConfirm)
  } else {
    const buttonOk = createModalButton('ok', 'modal__button-ok', 'button')
    divControl.append(buttonOk)
  } 
  
  controlModal()
}

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
function createModalInput() {
  const input = document.createElement('input')
  input.id = 'modal__input-title'
  input.type = 'text'
  return input
}

// Сзадёт строку ввода, в модальном окне, для описания задачи.
function createModalTextarea() {
  const textarea = document.createElement('textarea')
  textarea.id = 'modal__description'
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

// вешает нужные обрпботчики
function bindingEvents(variable, type, taskIndex) {
  console.log(taskIndex, type)
  if (type === 'createTask') {
    variable.addEventListener('click', () => {
      const form = document.getElementById('modal__task-form')
      form.style.display = 'none'
      generateModal('modalQuestionCreate', 'Create a task?')
      }
    )
  } else if (type === 'editTask') {
    variable.addEventListener('click', () => {
      const form = document.getElementById('modal__task-form')
      form.style.display = 'none'
      generateModal('modalQuestionEdit', 'Edit a task?', taskIndex)
      }
    )
  } else if (type === 'modalQuestionCreate') {
    variable.addEventListener('click', createTask)
  } else if (type === 'modalQuestionEdit') {
    variable.addEventListener('click', () => editTask(taskIndex))
  } else if (type === 'questionDelete') {
    variable.addEventListener('click', () => {deleteModal(); deleteTask(taskIndex)})
  } else if (type === 'questionDeleteAll') {
    variable.addEventListener('click', () => {deleteModal(); removeAllItems()})
  } else if (type === 'modalConfirmation') {
    variable.addEventListener()
  } else {console.error('ошибка')}
}

function openTaskModal(form) {
  form.style.display = 'block'
}

function closeTaskModal(form) {
  form.style.display = 'none'
}

function removeModal(form) {
  form.remove()
}

function deleteModal() {
  modal.close()
  modal.innerHTML = ''
}

// получаем пользователей с сервера
function populateUserEmails(selectUser) {
  fetch('https://jsonplaceholder.typicode.com/comments?postId=1')
    .then(response => {
      if (!response.ok) {
        throw new Error('Не удалось получить данные пользователей');
      }
      return response.json();
    })
    .then(comments => {
      const uniqueEmails = [...new Set(comments.map(comment => comment.email))];
      uniqueEmails.forEach(email => {
        const option = document.createElement('option');
        option.value = email;
        option.textContent = email;
        selectUser.appendChild(option);
      });
    })
    .catch(error => {
      console.error(error);
    });
}


  // Рендеринг задач после загрузки страницы
addEventListener('DOMContentLoaded', renderTask)
