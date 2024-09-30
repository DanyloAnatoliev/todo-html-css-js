const backdrop = document.querySelector(".backdrop");
const addTaskBtn = document.querySelector(".btn.add");
const addTaskForm = document.getElementById("add-task-form");
const closeAddForm = document.getElementById("close-add-form");
const listWrapper = document.querySelector(".list-wrapper");

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
    tag: "Work", // Default tag for now. Add functionality to add tags later
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
  if (data) {
    listWrapper.innerHTML = "";

    data.forEach(
      (item) =>
        (listWrapper.innerHTML += itemComponent(
          item._id,
          item.completed,
          item.tag,
          item.title,
          item.description,
        )),
    );
  }
}

function itemComponent(_id, completed, tag, title, description) {
  return `
    <div class="list-item ${completed ? "completed" : ""}" id="${_id}">
      <div class="item-top">
        <span class="item-tag">
          <span class="material-symbols-outlined item-tag-icon">
            sell
          </span>
          ${tag}
        </span>
        <div class="item-options">
          <button type="button" class="btn edit" title="Edit task">
            <span class="material-symbols-outlined" onClick="openEditTaskForm(this)"> edit </span>
          </button>
          <button type="button" class="btn delete" title="Delete task">
            <span class="material-symbols-outlined"> delete </span>
          </button>
        </div>
      </div>
      <h2 class="item-title">${title}</h2>
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
