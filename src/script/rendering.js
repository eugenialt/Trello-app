import { columnList} from "./ui/components.js"
import { getTasks} from "./localStorage.js"
import { createTaskCard } from "./renderOperations.js"

// Рендеринг карточек задач.
export function renderTask() {
    // Очищаем содержимое колонок.
    columnList.forEach((element) => {element.innerHTML = ''})
    // рендерим карточки в колонках.
    const tasks = getTasks()
    tasks.forEach(({ id, status, title, description, user }) => createTaskCard(id, status, title, description, user))
}