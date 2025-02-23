const icons = {
  edit: `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20h9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16.5 3a2.1 2.1 0 013 3l-9 9-4 1 1-4 9-9z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  clear: ` 
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6l12 12M6 18L18 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

const inputField = document.getElementById("task-text");
const taskContainer = document.getElementById("task-list");
const addTaskButton = document.getElementById("add");

// Change button color based on input field content
inputField.addEventListener("input", () => {
  addTaskButton.style.backgroundColor =
    inputField.value.trim() !== "" ? "#34c66c" : "#a4e5ba";
});

// Array to store tasks
let taskList = [];

// Load tasks from local storage if available
if (localStorage.getItem("tasks")) {
  taskList = JSON.parse(localStorage.getItem("tasks"));
}

// Render tasks from local storage
renderTasksFromLocalStorage();

// Add new task when button is clicked
addTaskButton.addEventListener("click", () => {
  if (inputField.value.trim() !== "") {
    addTask(inputField.value);
    inputField.value = "";
  }
});

// Add new task when Enter key is pressed
inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && inputField.value.trim() !== "") {
    addTask(inputField.value);
    inputField.value = "";
  }
});

// Handle task actions (delete, complete)
taskContainer.addEventListener("click", (e) => {
  const taskElement = e.target.closest(".task");
  if (!taskElement) return;

  // Delete task
  if (e.target.closest(".clear")) {
    removeTask(taskElement.getAttribute("data-id"));
    taskElement.remove();
  }

  // Toggle task completion status
  if (e.target.closest(".checkbox")) {
    toggleTaskCompletion(taskElement.getAttribute("data-id"));
    taskElement.classList.toggle("done");
  }
});

function addTask(taskText) {
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  taskList.push(task);
  renderTasks(taskList);
  saveTasksToLocalStorage(taskList);
}

function renderTasks(taskList) {
  taskContainer.innerHTML = "";
  taskList.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    if (task.completed) {
      taskElement.classList.add("done");
    }
    taskElement.setAttribute("data-id", task.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    checkbox.checked = task.completed;

    const taskText = document.createElement("span");
    taskText.appendChild(document.createTextNode(task.title));

    // Edit Button
    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.innerHTML = icons.edit;

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.className = "clear";
    deleteButton.innerHTML = icons.clear;

    taskElement.append(checkbox, taskText, editButton, deleteButton);
    taskContainer.appendChild(taskElement);
  });
}

function saveTasksToLocalStorage(taskList) {
  window.localStorage.setItem("tasks", JSON.stringify(taskList));
}

function renderTasksFromLocalStorage() {
  const data = window.localStorage.getItem("tasks");
  if (data) {
    taskList = JSON.parse(data);
    renderTasks(taskList);
  }
}

function removeTask(taskId) {
  taskList = taskList.filter((task) => task.id != taskId);
  saveTasksToLocalStorage(taskList);
}

function toggleTaskCompletion(taskId) {
  taskList = taskList.map((task) =>
    task.id == taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasksToLocalStorage(taskList);
}
