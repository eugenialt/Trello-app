import { buttonAdd, modal, taskListTodo, taskListProgress, taskListDone } from "./ui/components.js"
import { counterTodo, counterProgress, counterDone, deleteAllButton } from "./ui/components.js"
import { editIcon, deleteIcon, moveIcon, cancelIcon, completeIcon } from "./ui/components.js"

import { getTasks, setTasks } from "../localStorage.js"

import { renderTask } from "../rendering.js"

import { newTaskStatus, updateTaskCounter, deleteTask } from "../renderOperations.js"

import "./ui/clock.js"

import "./ui/theme.js"