const modal = document.querySelector("#modal");
const closeModalBtn = document.querySelector("#modal-cancel");
const saveModalBtn = document.querySelector("#modal-save");
const updateModalBtn = document.querySelector("#modal-update");
const taskInput = document.querySelector("#taskInput");

const tasksList = document.querySelector(".tasks__list");
const addBtn = document.querySelector(".tasks__button");

let isUpdating = false;
let updatedTask = null;

const handleModalShow = () => {
  modal.showModal();
};

const handleModalClose = () => {
  taskInput.value = "";
  isUpdating = false;
  updatedTask = null;

  saveModalBtn.classList.remove("modal__button_hidden");
  updateModalBtn.classList.add("modal__button_hidden");

  modal.close();
};

const handleEdit = (e) => {
  handleModalShow();

  saveModalBtn.classList.add("modal__button_hidden");
  updateModalBtn.classList.remove("modal__button_hidden");

  updatedTask = document.querySelector(
    `[data-key='${e.target.dataset.editKey}']`
  );

  taskInput.value = updatedTask.childNodes[0].textContent;
};

const handleModalUpdate = () => {
  updatedTask.childNodes[0].textContent = taskInput.value;

  handleModalClose();
};

const handleRemove = (e) => {
  const removedElement = document.querySelector(
    `[data-key='${e.target.dataset.removeKey}']`
  );

  tasksList.removeChild(removedElement);
};

const handleModalSave = () => {
  const task = document.createElement("li");
  task.classList.add("task");
  task.innerText = taskInput.value;
  const key = String(Math.random()).slice(2);
  task.dataset.key = key;

  const btns = document.createElement("div");
  btns.classList.add("task__btns");

  const editBtn = document.createElement("button");
  editBtn.textContent = "edit";
  editBtn.dataset.editKey = key;
  editBtn.addEventListener("click", handleEdit);
  btns.append(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "remove";
  removeBtn.dataset.removeKey = key;
  removeBtn.addEventListener("click", handleRemove);
  btns.append(removeBtn);

  task.append(btns);

  tasksList.prepend(task);
  taskInput.value = "";

  handleModalClose();
};

addBtn.addEventListener("click", handleModalShow);
closeModalBtn.addEventListener("click", handleModalClose);
saveModalBtn.addEventListener("click", handleModalSave);
updateModalBtn.addEventListener("click", handleModalUpdate);
