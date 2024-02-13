import { buttonAdd, modal, taskListTodo, taskListProgress, taskListDone } from "./ui/components.js"
import { counterTodo, counterProgress, counterDone, deleteAllButton } from "./ui/components.js"
import { editIcon, deleteIcon, moveIcon, cancelIcon, completeIcon } from "./ui/components.js"

import { getTasks, setTasks } from "../script/localStorage.js"

import { renderTask } from "../script/rendering.js"

import { newTaskStatus, updateTaskCounter, deleteTask } from "../script/renderOperations.js"

import "./ui/clock.js"

import "./ui/theme.js"