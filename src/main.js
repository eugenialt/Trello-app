import { buttonAdd, modal, taskListTodo, taskListProgress, taskListDone } from "./components.js"
import { counterTodo, counterProgress, counterDone, deleteAllButton } from "./components.js"
import { editIcon, deleteIcon, moveIcon, cancelIcon, completeIcon } from "./components.js"

import { getTasks, setTasks } from "./localStorage.js"

import { renderTask } from "./rendering.js"

import { newTaskStatus, updateTaskCounter, deleteTask } from "./renderOperations.js"

import "./clock.js"

import "./theme.js"

function removeAllItems() {
  const tasks = getTasks()
  const updatedTasks = tasks.filter(task => task.status !== 'done')
  setTasks(updatedTasks)
  renderTask()
  updateTaskCounter()
}

// MODULE__MODAL-WINDOWS





