import { buttonAdd, modal, taskListTodo, taskListProgress, taskListDone } from "./components.js"
import { counterTodo, counterProgress, counterDone, deleteAllButton } from "./components.js"
import { editIcon, deleteIcon, moveIcon, cancelIcon, completeIcon } from "./components.js"

import { getTasks, setTasks } from "./localStorage.js"

import { renderTask } from "./rendering.js"

import { newTaskStatus, updateTaskCounter, deleteTask } from "./renderOperations.js"

import "./clock.js"

import "./theme.js"