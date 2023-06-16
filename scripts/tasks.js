const modal = document.querySelector("#modal");
const closeModalBtn = document.querySelector("#modal-cancel");
const saveModalBtn = document.querySelector("#modal-save");
const updateModalBtn = document.querySelector("#modal-update");
const taskInput = document.querySelector("#taskInput");

const tasksList = document.querySelector(".tasks__list");
const addBtn = document.querySelector(".tasks__button");

const comleteIcon = document.querySelector("#complete").content.cloneNode(true);
const cancelIcon = document.querySelector("#cancel").content.cloneNode(true);

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
  e.stopPropagation();

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
  e.stopPropagation();

  const removedElement = document.querySelector(
    `[data-key='${e.target.dataset.removeKey}']`
  );

  const isActive = removedElement.classList.contains("task_active");

  tasksList.removeChild(removedElement);

  if (isActive) {
    const tasks = document.querySelectorAll(".task");

    if (tasks.length) {
      tasks[0].classList.add("task_active");
    }
  }
};

const handleComplete = (e) => {
  e.stopPropagation();

  const completedElement = document.querySelector(
    `[data-key='${e.target.dataset.completeKey}']`
  );

  e.target.classList.toggle("task__complete_completed");
  e.target.classList.contains("task__complete_completed")
    ? e.target.replaceChildren(cancelIcon.cloneNode(true))
    : e.target.replaceChildren(comleteIcon.cloneNode(true));

  completedElement.classList.toggle("task_completed");
};

const handleSelect = (e) => {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    if (task.dataset.key === e.target.dataset.key) {
      task.classList.add("task_active");
    } else {
      task.classList.remove("task_active");
    }
  });
};

const handleModalSave = () => {
  const task = document.createElement("li");
  task.classList.add("task");

  if (!tasksList.children.length) {
    task.classList.add("task_active");
  }

  const textContainer = document.createElement("p");
  textContainer.textContent = taskInput.value;
  task.append(textContainer);

  const key = String(Math.random()).slice(2);
  task.dataset.key = key;

  const completeBtn = document.createElement("button");
  completeBtn.classList.add("button", "task__complete");
  completeBtn.append(comleteIcon.cloneNode(true));
  completeBtn.dataset.completeKey = key;
  completeBtn.addEventListener("click", handleComplete);
  task.append(completeBtn);

  const btns = document.createElement("div");
  btns.classList.add("task__btns");

  const editBtn = document.createElement("button");
  editBtn.classList.add("button");
  editBtn.textContent = "Edit";
  editBtn.dataset.editKey = key;
  editBtn.addEventListener("click", handleEdit);
  btns.append(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("button");
  removeBtn.textContent = "Remove";
  removeBtn.dataset.removeKey = key;
  removeBtn.addEventListener("click", handleRemove);
  btns.append(removeBtn);

  task.append(btns);

  task.addEventListener("click", handleSelect);

  tasksList.append(task);
  taskInput.value = "";

  handleModalClose();
};

addBtn.addEventListener("click", handleModalShow);
closeModalBtn.addEventListener("click", handleModalClose);
saveModalBtn.addEventListener("click", handleModalSave);
updateModalBtn.addEventListener("click", handleModalUpdate);
