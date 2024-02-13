// Получаем задачи из хранилища.
export function getTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    return tasks
}
  
// Сохраняем задачи в хранилище.
export function setTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}
