// DOM Elements
const inputField = document.getElementById("task-text");
const taskContainer = document.getElementById("task-list");
const addButton = document.getElementById("add");

// SVG Icons for task buttons
const icons = {
  edit: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="scale(-1,1) translate(-24,0)">
        <path d="M12 20h9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.5 3a2.1 2.1 0 013 3l-9 9-4 1 1-4 9-9z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`,
  clear: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l12 12M6 18L18 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
};

// Colors for button states
const colors = {
  active: "#34c66c",
  inactive: "#a4e5ba",
};

// Store tasks array
let taskList = [];

// Update add button color based on input value
function updateAddButtonColor() {
  addButton.style.backgroundColor = inputField.value.trim()
    ? colors.active
    : colors.inactive;
}

// Load tasks from storage
function loadTasks() {
  const data = window.localStorage.getItem("tasks");
  if (data) {
    taskList = JSON.parse(data);
    renderTasks();
  }
}

// Save tasks to storage
function saveTasks() {
  window.localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Add new task
function addTask(taskText) {
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  taskList.push(task);
  renderTasks();
  saveTasks();

  // Clear input and update button color
  inputField.value = "";
  updateAddButtonColor();
}

// Remove task
function removeTask(taskId) {
  taskList = taskList.filter((task) => task.id != taskId);
  saveTasks();
}

// Toggle task completion
function toggleTask(taskId) {
  taskList = taskList.map((task) => {
    if (task.id == taskId) {
      task.completed = !task.completed;
    }
    return task;
  });
  saveTasks();
}

// Render tasks
function renderTasks() {
  // Clear container
  taskContainer.innerHTML = "";

  // Show empty state if no tasks
  if (taskList.length === 0) {
    taskContainer.innerHTML = `
      <span class="icon">📝</span>
      <p class="empty-message">
        No tasks found. Add some tasks to get started!
      </p>
    `;
    return;
  }

  // Render each task
  taskList.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = task.completed ? "task done" : "task";
    taskElement.setAttribute("data-id", task.id);

    // Left side (checkbox & text)
    const leftSide = document.createElement("span");
    leftSide.className = "left-side";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = task.completed;

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = task.title;

    leftSide.append(checkbox, text);

    // Right side (buttons)
    const rightSide = document.createElement("span");
    rightSide.className = "right-side";

    const editBtn = document.createElement("button");
    editBtn.className = "edit";
    editBtn.innerHTML = icons.edit;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "clear";
    deleteBtn.innerHTML = icons.clear;

    rightSide.append(editBtn, deleteBtn);

    // Add everything to task element
    taskElement.append(leftSide, rightSide);
    taskContainer.appendChild(taskElement);
  });
}

// Event Listeners
inputField.addEventListener("input", updateAddButtonColor);

addButton.addEventListener("click", () => {
  const value = inputField.value.trim();
  if (value) {
    addTask(value);
  }
});

inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && inputField.value.trim()) {
    addTask(inputField.value);
  }
});

taskContainer.addEventListener("click", (e) => {
  const taskElement = e.target.closest(".task");
  if (!taskElement) return;

  const taskId = taskElement.getAttribute("data-id");

  // Handle delete button click
  if (e.target.closest(".clear")) {
    removeTask(taskId);
    renderTasks();
  }

  // Handle checkbox click
  if (e.target.classList.contains("checkbox")) {
    toggleTask(taskId);
    renderTasks();
  }
});

// Initialize app
loadTasks();
