// Создание новой задачи.
export function createTask() {
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
export function editTask(taskIndex) {
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