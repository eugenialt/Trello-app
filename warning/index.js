// Modal-overlay -- модальное окно
const modal = document.querySelector('#modal');
const modalOverlay = document.querySelector('#modal-overlay');
const closedButton = document.querySelector('#close-button');
const openButton = document.querySelector('#open-button');

closedButton.addEventListener('click', () => {
    modal.classList.toggle('closed');
    modalOverlay.classList.toggle('closed');
})

openButton.addEventListener('click', () => {
    modal.classList.toggle('closed');
    modalOverlay.classList.toggle('closed');
})
// button.addEventListener('click', deleteAllTask);

// delete all btn
const openModalBtn = document.getElementById('openModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');
const modalDelete = document.getElementById('modalDelete');
const modalOverlays = document.getElementById('modal-overlays');

openModalBtn.addEventListener('click', () => {
  modalDelete.classList.toggle('closed');
  modalOverlays.classList.toggle('closed');
});

cancelBtn.addEventListener('click', () => {
  modalDelete.classList.toggle('closed');
  modalOverlays.classList.toggle('closed');
});

confirmBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
      localStorage.clear();
    }
  });
