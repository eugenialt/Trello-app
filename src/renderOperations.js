import { generateModal } from "./modal.js"

import { taskListTodo, taskListProgress, taskListDone } from "./script/ui/components.js"
import { counterTodo, counterProgress, counterDone } from "./script/ui/components.js"
import { editIcon, deleteIcon, moveIcon, cancelIcon, completeIcon } from "./script/ui/components.js"

import { getTasks, setTasks } from "./localStorage.js"

import { renderTask } from "./rendering.js"

// Создание и добавление карточки задачи в соответствующую колонку
export function createTaskCard(id, status, title, description, user) {
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
    taskCard.append(userInfo);
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
    const buttonEdit = createButton(editIcon, 'column__task-button column__button-edit', 'button')
    const buttonDelete = createButton(deleteIcon, 'column__task-button column__button-delete', 'button')
    const buttonSubmit = createButton(moveIcon, 'column__task-button column__button-submit', 'button')
    buttonEdit.addEventListener('click', () => generateModal('editTask', 'description', taskIndex))
    buttonDelete.addEventListener('click', () => generateModal('questionDelete', 'Delete task?', taskIndex))
    buttonSubmit.addEventListener('click', () => generateModal('questionProgress', 'Start the task?', taskIndex))
    controlPanel.append(buttonEdit, buttonDelete, buttonSubmit)
}
  
function controlPanelProgress(controlPanel, taskIndex) {
    const buttonCancel = createButton(cancelIcon, 'column__task-button column__button-cancel', 'button')
    const buttonComplete = createButton(completeIcon, 'column__task-button column__button-complete', 'button')
    buttonCancel.addEventListener('click', () => generateModal('questionTodo', 'Cancel task execution?', taskIndex))
    buttonComplete.addEventListener('click', () => generateModal('questionDone', 'Complete the task?', taskIndex))
    controlPanel.append(buttonCancel, buttonComplete)
}
  
function controlPanelDone(controlPanel, taskIndex) {
    const buttonDelete = createButton(deleteIcon, 'column__task-button column__button-delete', 'button')
    buttonDelete.addEventListener('click', () => generateModal('questionDelete', 'Are you sure?', taskIndex))
    controlPanel.append(buttonDelete)
}
  
// Обновляет счетчики.
export function updateTaskCounter() {
    const tasks = getTasks()
    counterTodo.textContent = tasks.filter(task => task.status === 'todo').length
    counterProgress.textContent = tasks.filter(task => task.status === 'progress').length
    counterDone.textContent = tasks.filter(task => task.status === 'done').length
}
  
// обновляют статус при перетаскивании.
export function newTaskStatus(tasks, tasksIndex, newStatus) {
    tasks[tasksIndex].status = newStatus
    setTasks(tasks)
    renderTask()
}
  
// Создание кнопки с указанными параметрами.
function createButton(text, className, type) {
    const button = document.createElement('button')
    button.className = className
    button.type = type
    button.innerHTML = text
    return button
}
  
// Удаление задачи по ID.
export function deleteTask(taskIndex) {
    const tasks = getTasks()
    tasks.splice(taskIndex, 1)
    setTasks(tasks)
    renderTask()
    updateTaskCounter()
}
  
// Поиск индекса задачи по ID.
function searchById(tasks, searchId) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === searchId) {
        return i
        }
    }
}