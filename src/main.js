const buttonAdd = document.getElementById('column__button-add')
const modal = document.getElementById('modal')
const modalAdd = document.getElementById('modal__task-add')
const modalCancel = document.getElementById('modal__cancel')

function getModalAdd() {
  modal.style.display = "flex"
  modalAdd.style.display = "flex"
}

buttonAdd.addEventListener('click', getModalAdd)

function closeModalAdd() {
  modal.style.display = "none"
  modalAdd.style.display = "none"
}

modalCancel.addEventListener('click', closeModalAdd)