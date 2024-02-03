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
const containerWarning = document.getElementById('modal__warning-container')

//new code 


//time
function currentTime() {
  const d = new Date();
  document.getElementById('clock').innerHTML = d.toLocaleTimeString();
}
setInterval(currentTime, 0);

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

// Получаем задачи из хранилища.
function getTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  return tasks
}

// Сохраняем задачи в хранилище
function setTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function closeModalchoice() {
  containerWarning.innerHTML = ''
}

// Рендеринг карточек задач
function renderTask() {
  // Очищаем содержимое колонок
  columnList.forEach((element) => { element.innerHTML = '' })
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
  buttonDelete.addEventListener('click', () => generateWarning('choice', 'you are sure?', taskIndex))
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
  setItem(tasks)
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
function createTask(event) {
  // event.preventDefault()
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  const title = modalAddTitle.value
  const description = modalAddDescription.value
  const id = generateId(tasks)
  const status = 'todo'
  const newTask = { id, status, title, description }
  tasks.push(newTask)
  localStorage.setItem('tasks', JSON.stringify(tasks))
  modalAddTitle.value = ''
  modalAddDescription.value = ''
  closeModalAdd()
  renderTask()
}

// Генерация уникального ID для задачи
function generateId(tasks) {
  const randomNumber = Math.random()
  const createdId = String(randomNumber).slice(-5)
  tasks.forEach(({ id }) => { if (id === createdId) { return generateId(tasks) } });
  return createdId
}

// modalAddConfirm.addEventListener('click', (event) => generateWarning('choice', 'you are sure?', NaN, event))

// function generateWarning(type, description, taskIndex, event) {
//   if (event) { event.preventDefault() }
//   if (!(modalAddTitle.value && modalAddDescription.value)) {
//     if (type === 'choice') {
//       modalAdd.style.display = 'none'
//       generateWarning('Confirmation', 'Fill in each field', event)
//       return
//     }
//   }

//   modalAdd.style.display = 'none'
//   const warning = document.createElement('div')
//   warning.classList.add('modal__form')
//   containerWarning.append(warning)
//   generateWarningDescription(type, warning, description, taskIndex)
// }

function generateWarningDescription(type, warning, description, taskIndex) {
  const warningDescription = document.createElement('h1')
  warningDescription.textContent = description
  warningDescription.classList.add('modal__title')
  warning.append(warningDescription)
  createWarningButtonContainer(type, warning, taskIndex)
}

function createWarningButtonContainer(type, warning, taskIndex) {
  const container = document.createElement('div')
  container.classList.add('modal__button-container')
  warning.append(container)
  generateWarningButton(type, container, taskIndex)
}

function generateWarningButton(type, container, taskIndex) {
  if (taskIndex) {

  } else if (type === 'choice') {
    const buttonCancel = createButton('Cancel', 'modal__warning-button', 'button')
    const buttonConfirm = createButton('Confirm', 'modal__warning-button', 'button')
    container.append(buttonCancel, buttonConfirm)
    buttonCancel.addEventListener('click', () => { openModalAdd(); closeModalchoice() })
    buttonConfirm.addEventListener('click', (event) => { createTask(event); closeModalchoice() })
  } else {
    const buttonOk = createButton('OK', 'modal__warning-button', 'button')
    container.append(buttonOk)
    buttonOk.addEventListener('click', () => { openModalAdd(); closeModalchoice() })
  }
}

// Рендеринг задач после загрузки страницы
addEventListener('DOMContentLoaded', renderTask)



// new code

// test warning

modalAdd.addEventListener('click', handleEmptyFields)

function handleEmptyFields(event) {
  event.preventDefault();
  if (!(modalAddTitle.value && modalAddDescription.value)) {
    if (event.target.classList.contains('modal__button-confirm')) {
      document.body.append(testModal);
      testModal.showModal();
    }
  } else { 
    createTask()
  }
}

const generateModal = (message, type) => {

  const modal = document.createElement('dialog');
  modal.className = 'test-warning';

  const textBlock = document.createElement('div')
  textBlock.className = 'test-warning__text';
  textBlock.innerText = message;

  if (type === 'confirm') { 

  const closeButton = document.createElement('button')
  closeButton.className = 'test-warning__button';
  closeButton.innerText = 'close';
  document.body.appendChild(modal);
  modal.append(textBlock, closeButton);
  } else { 
    const yesButton = document.createElement('button')
    yesButton.className = 'test-warning__button';
    yesButton.innerText = 'yes';
    document.body.appendChild(modal);
    modal.append(textBlock, yesButton);
  }


  return modal;

}

const testModal = generateModal('Fill in both fields', 'confirm');

const closeModalBtn = document.querySelector('.test-warning__button');
closeModalBtn.addEventListener('click', () => {

  testModal.close()

})


// edit task: function + handler


taskListTodo.addEventListener('click', handleBtnEdit)

 function handleBtnEdit(event) {
  if (event.target.classList.contains('column__button-edit')) {
      const tasks = getTasks()
      const taskId = event.target.closest('.column__task').id;
      const task = tasks.find(({id}) => id === taskId);
      console.log(task)
      const testEditWindow = openEditWindow(task)
      document.body.append(testEditWindow);
      testEditWindow.showModal();
      // openEditWindow(task) 
      // setData(todos)
  }
}

function openEditWindow(item) {

  const editWindow = document.createElement('dialog')
  editWindow.className = 'edit-dialog'; 
  // editWindow.style.display = 'flex'; 
  const titleHeadline = document.createElement('div'); 
  titleHeadline.textContent = 'Title'; 
  const titleBlock = document.createElement('textarea')
  titleBlock.className = 'edit-headline'
  titleBlock.value = item.title;
  const descrHeadline = document.createElement('div'); 
  descrHeadline.textContent = 'Description'; 
  const descrBlock = document.createElement('textarea');
  descrBlock.className = 'edit-headline'
  descrBlock.value = item.description;
  const btnSubmit = document.createElement('button');
  btnSubmit.className = 'edit-submit-button'; 
  btnSubmit.textContent = 'submit'; 
  document.body.appendChild(editWindow)
  editWindow.append(titleHeadline, titleBlock, descrHeadline, descrBlock, btnSubmit);
  titleBlock.selectionStart = titleBlock.selectionEnd = titleBlock.value.length;
  return editWindow; 
 }

