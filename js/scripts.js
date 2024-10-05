const backdrop = document.querySelector(".backdrop");
const addTaskBtn = document.querySelector(".btn.add");
const addTaskForm = document.getElementById("add-task-form");
const closeAddForm = document.getElementById("close-add-form");
const editTaskForm = document.getElementById("edit-task-form");
const closeEditFormBtn = document.getElementById("close-edit-form");
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.getElementById("search-input");

// Used to open/close form for adding new task
function toggleAddTaskForm() {
  backdrop.classList.toggle("hidden");
  addTaskForm.classList.toggle("hidden");
}

addTaskBtn.addEventListener("click", toggleAddTaskForm);
closeAddForm.addEventListener("click", toggleAddTaskForm);

// Used to handle submit of a new task
function handleNewTask(event) {
  event.preventDefault();

  const newTitle = document.getElementById("new-task-title");
  const newDescription = document.getElementById("new-task-description");

  let id = 0;

  if (localStorage.getItem("availableId")) {
    id = Number(localStorage.getItem("availableId"));
    localStorage.setItem(
      "availableId",
      Number(localStorage.getItem("availableId")) + 1,
    );
  } else {
    localStorage.setItem("availableId", 1);
  }

  const newTask = {
    _id: id,
    completed: false,
    title: newTitle.value,
    description: newDescription.value,
  };

  if (localStorage.getItem("list")) {
    const list = JSON.parse(localStorage.getItem("list"));
    list.push(newTask);
    localStorage.setItem("list", JSON.stringify(list));
  } else {
    const list = [];
    list.push(newTask);
    localStorage.setItem("list", JSON.stringify(list));
  }

  toggleAddTaskForm();
  newTitle.value = "";
  newDescription.value = "";
  renderData(JSON.parse(localStorage.getItem("list")));
}

addTaskForm.addEventListener("submit", handleNewTask);

// Used to render the data from the storage
function renderData(data) {
  if (data && data.length !== 0) {
    listWrapper.innerHTML = "";

    data.forEach(
      (item) =>
        (listWrapper.innerHTML += itemComponent(
          item._id,
          item.completed,
          item.title,
          item.description,
        )),
    );
  } else {
    listWrapper.innerHTML = `<h2 class="default-text">Try adding a new task</h2>`;
  }
}

function itemComponent(_id, completed, title, description) {
  return `
    <div class="list-item ${completed ? "completed" : ""}" id="${_id}">
      <div class="item-top">
      <h2 class="item-title">${title}</h2>
        <div class="item-options">
          <button type="button" class="btn edit" title="Edit task" onClick="editTask(this)">
            <span class="material-symbols-outlined"> edit </span>
          </button>
          <button type="button" class="btn delete" title="Delete task" onClick="deleteTask(this)">
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </div>
      </div>
      <p class="item-description">${description}</p>
      <button type="button" class="btn complete" onClick="toggleCompleted(this)">
        <span class="material-symbols-outlined"> check </span>
        Complete
      </button>
    </div>
  `;
}

renderData(JSON.parse(localStorage.getItem("list")));

// Used to change task's status(completed: true/false)
function toggleCompleted(target) {
  const id = Number(target.closest(".list-item").getAttribute("id"));
  const list = JSON.parse(localStorage.getItem("list"));
  for (i = 0; i < list.length; i++) {
    if (Number(list[i]._id) === id) {
      list[i].completed =
        list[i].completed === true
          ? (list[i].completed = false)
          : (list[i].completed = true);
      break;
    }
  }

  localStorage.setItem("list", JSON.stringify(list));
  renderData(JSON.parse(localStorage.getItem("list")));
}

// Used to edit task info
function openEditForm() {
  backdrop.classList.remove("hidden");
  editTaskForm.classList.remove("hidden");
}

function closeEditForm() {
  backdrop.classList.add("hidden");
  editTaskForm.classList.add("hidden");
}

function editTask(target) {
  id = Number(target.closest(".list-item").getAttribute("id"));
  const list = JSON.parse(localStorage.getItem("list"));
  const editFormTitle = document.getElementById("edit-form-title");
  const editTitle = document.getElementById("edited-task-title");
  const editDescription = document.getElementById("edited-task-description");

  let task;

  for (i = 0; i < list.length; i++) {
    if (Number(list[i]._id) === id) {
      task = list[i];
      break;
    }
  }
  editFormTitle.textContent = task.title;
  editFormTitle.setAttribute("title", task.title);
  editTitle.value = task.title;
  editDescription.value = task.description;

  openEditForm();

  editTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    for (i = 0; i < list.length; i++) {
      if (Number(list[i]._id) === id) {
        list[i].title = editTitle.value;
        list[i].description = editDescription.value;
        break;
      }
    }
    closeEditForm();

    localStorage.setItem("list", JSON.stringify(list));
    renderData(JSON.parse(localStorage.getItem("list")));
  });
}

closeEditFormBtn.addEventListener("click", closeEditForm);

// Used to delete tasks
function deleteTask(target) {
  id = Number(target.closest(".list-item").getAttribute("id"));
  const list = JSON.parse(localStorage.getItem("list"));
  const newList = list.filter((task) => task._id != id);

  localStorage.setItem("list", JSON.stringify(newList));
  renderData(JSON.parse(localStorage.getItem("list")));
}

// Searchbar implementation
function search() {
  const list = JSON.parse(localStorage.getItem("list"));
  const filteredList = list.filter((item) =>
    item.title.toLowerCase().includes(searchInput.value),
  );

  renderData(filteredList);
}

searchInput.addEventListener("change", search);
