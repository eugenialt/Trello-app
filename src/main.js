// Получение элементов DOM
const buttonAdd = document.getElementById('column__button-add')
const modal = document.getElementById('modal')
const modalAdd = document.getElementById('modal__task-add')
const modalAddCancel = document.getElementById('modal__cancel-add')
const modalAddTitle = document.getElementById('modal__title-add')
const modalAddDescription = document.getElementById('modal__description-add')
const modalAddConfirm = document.getElementById('modal__confirm-add')
const taskListTodo = document.getElementById('column__list-todo')
const taskListProgress = document.getElementById('column__list-progress')
const taskListDone = document.getElementById('column__list-done')
const columnList = [taskListTodo, taskListProgress, taskListDone]
const counterTodo = document.getElementById('column__counter-todo');
const counterProgress = document.getElementById('column__counter-progress');
const counterDone = document.getElementById('column__counter-done');

// Открытие модального окна добавления задачи
function openModalAdd() {
  modal.style.display = 'flex'
  modalAdd.style.display = 'flex'
}

buttonAdd.addEventListener('click', openModalAdd)

// Закрытие модального окна добавления задачи
function closeModalAdd() {
  modal.style.display = 'none'
  modalAdd.style.display = 'none'
}

modalAddCancel.addEventListener('click', closeModalAdd)

// Рендеринг карточек задач
function renderTask() {
  // Очищаем содержимое колонок
  columnList.forEach((element) => {element.innerHTML = ''})
  // рендерим карточки в колонках
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
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
  const tasks = JSON.parse(localStorage.getItem('tasks'))
  const taskIndex = searchById(tasks, id)
  if (tasks[taskIndex].status === 'todo') {
    controlPanelTodo(controlPanel, tasks, taskIndex)
  } else if (tasks[taskIndex].status === 'progress') {
    controlPanelProgress(controlPanel, tasks, taskIndex)
  } else {
    controlPanelDone(controlPanel, taskIndex)
  }
  updateTaskCounter()
}

function controlPanelTodo(controlPanel, tasks, taskIndex) {
  const buttonEdit = createButton('edit', 'column__task-button column__button-edit', 'button')
  const buttonDelete = createButton('delete', 'column__task-button column__button-delete', 'button')
  const buttonSubmit = createButton('>', 'column__task-button column__button-submit', 'button')
  buttonDelete.addEventListener('click', () => deleteTask(taskIndex))
  buttonSubmit.addEventListener('click', () => newTaskStatus(tasks, taskIndex, 'progress'))
  controlPanel.append(buttonEdit, buttonDelete, buttonSubmit)
}

function controlPanelProgress(controlPanel, tasks, taskIndex) {
  const buttonCancel = createButton('cancel', 'column__task-button column__button-cancel', 'button')
  const buttonComplete = createButton('Complete', 'column__task-button column__button-complete', 'button')
  buttonCancel.addEventListener('click', () => newTaskStatus(tasks, taskIndex, 'todo'))
  buttonComplete.addEventListener('click', () => newTaskStatus(tasks, taskIndex, 'done'))
  controlPanel.append(buttonCancel, buttonComplete)
}

function controlPanelDone(controlPanel, taskIndex) {
  const buttonDelete = createButton('delete', 'column__task-button column__button-delete', 'button')
  buttonDelete.addEventListener('click', () => deleteTask(taskIndex))
  controlPanel.append(buttonDelete)
}

// Обновляет счетчики
function updateTaskCounter() {
  const tasks = JSON.parse(localStorage.getItem('tasks'))  
  counterTodo.textContent = tasks.filter(task => task.status === 'todo').length
  counterProgress.textContent = tasks.filter(task => task.status === 'progress').length
  counterDone.textContent = tasks.filter(task => task.status === 'done').length
}

// обновляют статус при перетаскивании
function newTaskStatus(tasks, tasksIndex, newStatus) {
  tasks[tasksIndex].status = newStatus
  localStorage.setItem('tasks', JSON.stringify(tasks))
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
  const tasks = JSON.parse(localStorage.getItem('tasks'))
  tasks.splice(taskIndex, 1)
  localStorage.setItem('tasks', JSON.stringify(tasks))
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
function createTask(event) {
  event.preventDefault()
  if (!(modalAddTitle.value && modalAddDescription.value)) {return}
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  const title = modalAddTitle.value
  const description = modalAddDescription.value
  const id = createId(tasks)
  const status = 'todo'
  const newTask = { id, status, title, description }
  tasks.push(newTask)
  localStorage.setItem('tasks', JSON.stringify(tasks))
  closeModalAdd()
  renderTask()
}

// Генерация уникального ID для задачи
function createId(tasks) {
  const randomNumber = Math.random()
  const createdId = String(randomNumber).slice(-5)
  tasks.forEach(({id}) => {if (id === createdId) {return}})
  return createdId
}

modalAddConfirm.addEventListener('click', (event) => createTask(event))

// Рендеринг задач после загрузки страницы
addEventListener('DOMContentLoaded', renderTask)
