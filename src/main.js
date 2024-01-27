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

function openModalAdd() {
  modal.style.display = 'flex'
  modalAdd.style.display = 'flex'
}

buttonAdd.addEventListener('click', openModalAdd)

function closeModalAdd() {
  modal.style.display = 'none'
  modalAdd.style.display = 'none'
}

modalAddCancel.addEventListener('click', closeModalAdd)

function renderTask() {
  columnList.forEach((element) => {element.innerHTML = ''})
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  tasks.forEach(({id, status, title, description}) => createTaskCard(id, status, title, description))
}

function createTaskCard(id, status, title, description) {
  const column = getColumnName(status)
  const taskCard = document.createElement('div')
  taskCard.classList.add('column__task')
  taskCard.id = id
  column.append(taskCard)
  createTaskTitle(taskCard, id, title, description)
}

function getColumnName(status) {
  if (status === 'todo') {
    return taskListTodo
  } else if (status === 'progress') {
    return taskListProgress
  } else {
    return taskListDone
  }
}

function createTaskTitle(taskCard, id, title, description) {
  const taskTitle = document.createElement('h3')
  taskTitle.classList.add('column__task-title')
  taskTitle.textContent = title
  taskCard.append(taskTitle)
  createTaskDescription(taskCard, id, description)
}

function createTaskDescription(taskCard, id, description) {
  const taskDescription = document.createElement('div')
  taskDescription.classList.add('column__task-description')
  taskDescription.textContent = description
  taskCard.append(taskDescription)
  createTaskControl(taskCard, id)
}

function createTaskControl(taskCard, id) {
  const buttonEdit = createButton('edit', 'column__task-button column__button-edit', 'button')
  const buttonDelete = createButton('delete', 'column__task-button column__button-delete', 'button')
  const buttonSubmit = createButton('>', 'column__task-button column__button-submit', 'button')

  buttonDelete.addEventListener('click', () => deleteTask(id))
  
  taskCard.append(buttonEdit, buttonDelete, buttonSubmit)
}

function createButton(text, className, type) {
  const button = document.createElement('button')
  button.className = className
  button.type = type
  button.textContent = text
  return button
}

function deleteTask(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks'))
  const tasksIndex = searchById(tasks, id)
  tasks.splice(tasksIndex, 1)
  localStorage.setItem('tasks', JSON.stringify(tasks))
  renderTask()
}

function searchById(tasks, searchId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === searchId) {
      return i;
    }
  }
}

function createTask() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  const title = modalAddTitle.value
  const description = modalAddDescription.value
  const id = createId()
  const status = 'todo'
  const newTask = { id, status, title, description };
  tasks.push(newTask)
  localStorage.setItem('tasks', JSON.stringify(tasks))
  closeModalAdd()
  renderTask()
}

function createId() {
  const randomNumber = Math.random()
  const id = String(randomNumber).slice(-5)
  return id
}

modalAddConfirm.addEventListener('click', createTask)

addEventListener('DOMContentLoaded', renderTask)
