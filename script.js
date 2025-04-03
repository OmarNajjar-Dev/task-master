/**
 * 🎯 Task Manager Application
 * A feature-rich task management system with filtering, searching, and dark mode
 *
 * Features:
 * - ✨ Add, edit and delete tasks
 * - 🔍 Search tasks
 * - 🏷️ Filter tasks by status
 * - 🌓 Dark/Light mode toggle
 * - 💾 Local storage persistence
 * - ⌨️ Keyboard shortcuts
 * - 🎨 SVG icons and animations
 */

// 🎛️ DOM Elements
const inputField = document.getElementById("task-text");
const taskContainer = document.getElementById("task-list");
const searchInput = document.getElementById("search");
const addButton = document.getElementById("add");
const clearButton = document.getElementById("clear");
const selectStatus = document.getElementById("select");
const itemCount = document.getElementById("items-count");
const hr = document.querySelector("hr");
const filterButtons = document.querySelectorAll("#filters button");
const darkMode = document.getElementById("dark-mode");
const body = document.body;

// 🎨 SVG Icons for task buttons
const icons = {
  edit: `<i class="fa-solid fa-pen"></i>`,
  clear: `<i class="fa-solid fa-xmark"></i>`,
  light: `<i class="fas fa-sun fa-3x fa-gold"></i>`,
  dark: `<i class="fas fa-moon fa-3x fa-gold"></i>`,
};

// 🎨 Colors for button states
const colors = {
  active: "var(--button-save-background)",
  inactive: "var(--button-add-background)",
};

// 📦 Array for storing the tasks
let taskList = [];

// 🏷️ Initialize the current status as all
let currentFilter = "all";

// ⏲️ Debounce timer
let debounceTimeout;

// 🚀 Initialize app
getDataFromLocalStorage();
updateUI();
initializeEventListeners();

// 🎮 Event Listeners Setup
function initializeEventListeners() {
  // ➕ Add Task on Click
  addButton.addEventListener("click", handleAddTask);

  // ⌨️ Add Task on Enter Key Press
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleAddTask();
  });

  // 🔄 Update Add Button State on Input
  inputField.addEventListener("input", updateAddButtonState);

  // 🗑️ Clear All Tasks
  clearButton.addEventListener("click", clearAllTasks);

  // 🔍 Search Tasks
  searchInput.addEventListener("input", (e) => searchTasks(e.target.value));

  // 🔘 Filter Button Clicks
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.filter;
      selectStatus.value = currentFilter;
      filterTasks();
    });
  });

  // 📑 Select Filter Change
  selectStatus.addEventListener("change", () => {
    currentFilter = selectStatus.value;
    filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === currentFilter);
    });
    filterTasks();
  });

  // 📋 Task Container Click Events
  taskContainer.addEventListener("click", handleTaskContainerClick);

  // 🌓 Dark Mode Toggle
  darkMode.addEventListener("click", toggleDarkMode);
}

// 🖱️ Handle Task Container Click Events
function handleTaskContainerClick(e) {
  const taskElement = e.target.closest(".task");
  if (!taskElement) return;

  const taskId = taskElement.getAttribute("data-id");

  if (e.target.closest(".clear")) {
    applyDeleteTaskAnimation(taskElement, () => {
      deleteTaskWith(taskId);
      updateUI();
    });
  } else if (e.target.type === "checkbox") {
    taskElement.classList.toggle("done");
    toggleTaskStatusWith(taskId);
    updateUI();
  } else if (e.target.closest(".edit")) {
    editTask(taskId);
  }
}

// ✍️ Handle Task Addition
function handleAddTask() {
  if (!inputField.value.trim()) return;
  addTaskAndUpdateUI(inputField.value);
  updateAddButtonState();
  updateUI();
}

// 🎨 Update Add Button Color
function updateAddButtonState() {
  if (inputField.value.trim()) {
    addButton.style.backgroundColor = colors.active;
    addButton.disabled = false;
  } else {
    addButton.style.backgroundColor = colors.inactive;
    addButton.disabled = true;
  }
}

// ➕ Add New Task
function addTaskAndUpdateUI(input) {
  const trimmedInput = input.trim();

  const task = {
    id: Date.now(),
    title: trimmedInput,
    completed: false,
  };

  taskList.push(task);
  inputField.value = "";
  addElementsToPageFrom(taskList);

  // Add animation class to new task
  const newTaskElement = document.querySelector(`[data-id="${task.id}"]`);
  applyNewTaskAnimation(newTaskElement);

  // Scroll to the new task
  newTaskElement.scrollIntoView({ behavior: "smooth", block: "center" });

  addDataToLocalStorageFrom(taskList);
}

// 🔄 Render Tasks to Page
function addElementsToPageFrom(tasks) {
  taskContainer.innerHTML =
    tasks.length === 0
      ? `<span class="icon">📝</span>
         <p class="empty-message">No tasks found. Add some tasks to get started!</p>`
      : tasks.map((task) => createTaskElement(task)).join("");
}

// 🏗️ Create Task Element HTML
function createTaskElement(task) {
  return `
    <div class="task ${task.completed ? "done" : ""}" data-id="${task.id}">
      <span class="left-side">
        <input type="checkbox" name="task-completed" class="task-status"${
          task.completed ? "checked" : ""
        }>
        <span class="text">${task.title}</span>
      </span>
      <span class="right-side">
        <button class="edit" ${task.completed ? "disabled" : ""}>${
    icons.edit
  } </button>
        <button class="clear">${icons.clear}</button>
      </span>
    </div>
  `;
}

// 💾 Local Storage Operations
function addDataToLocalStorageFrom(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getDataFromLocalStorage() {
  const data = localStorage.getItem("tasks");
  if (data) {
    taskList = JSON.parse(data);
    addElementsToPageFrom(taskList);
  }

  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    darkMode.innerHTML = icons.light;
  }
}

// 🗑️ Delete Task
function deleteTaskWith(taskId) {
  taskList = taskList.filter((task) => task.id !== Number(taskId));
  addDataToLocalStorageFrom(taskList);
  addElementsToPageFrom(taskList);
}

// ✅ Toggle Task Status
function toggleTaskStatusWith(taskId) {
  const task = taskList.find((task) => task.id === Number(taskId));
  if (task) {
    task.completed = !task.completed;
    addDataToLocalStorageFrom(taskList);
    document.querySelector(`[data-id="${taskId}"] .edit`).disabled =
      task.completed;
  }
}

// 🧹 Clear All Tasks
function clearAllTasks() {
  taskList = [];
  localStorage.removeItem("tasks");
  applyClearAllTasksAnimation(() => {
    addElementsToPageFrom(taskList);
    updateUI();
  });
}

// 🔍 Search Tasks
function searchTasks(query) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    filterTasks(query);
  }, 300);
}

// 🏷️ Filter Tasks
function filterTasks() {
  const searchQuery = searchInput.value.trim().toLowerCase();
  let filteredTasks = taskList;

  if (currentFilter === "active") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  if (searchQuery) {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery)
    );
  }

  addElementsToPageFrom(filteredTasks);
}

// ✏️ Edit Task
function editTask(taskId) {
  const taskElement = document.querySelector(`[data-id="${taskId}"]`);
  const textSpan = taskElement.querySelector(".text");
  const currentText = textSpan.textContent;
  const checkbox = taskElement.querySelector('input[type="checkbox"]');
  const rightSide = taskElement.querySelector(".right-side");

  checkbox.style.display = "none";

  textSpan.outerHTML = `<input type="text" class="edit-input" value="${currentText}">`;

  rightSide.innerHTML = `
    <button class="save">Save</button>
    <button class="cancel">Cancel</button>
  `;

  const input = taskElement.querySelector(".edit-input");

  const saveChanges = () => {
    const newTitle = input.value.trim();
    if (newTitle) {
      const task = taskList.find((t) => t.id === Number(taskId));
      if (task) {
        task.title = newTitle;
        addDataToLocalStorageFrom(taskList);
      }
    }
    filterTasks();
  };

  rightSide.querySelector(".save").addEventListener("click", saveChanges);
  rightSide.querySelector(".cancel").addEventListener("click", filterTasks);

  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") saveChanges();
    if (e.key === "Escape") filterTasks();
  });

  input.focus();
  input.select();
}

// 🌓 Toggle Dark Mode
function toggleDarkMode() {
  body.classList.toggle("dark-mode");
  const isDarkMode = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
  darkMode.innerHTML = isDarkMode ? icons.light : icons.dark;
}

// ──────────────────────────────────────────────────────────────
// 🖥️ UI Update Helpers
// ──────────────────────────────────────────────────────────────

function updateItemCount() {
  const remainingTasks = taskList.filter((task) => !task.completed).length;
  itemCount.textContent =
    remainingTasks === 1 ? `1 item left` : `${remainingTasks} items left`;
}

function toggleElementsVisibility() {
  if (taskList.filter((task) => !task.completed).length === 0) {
    hr.style.display = "none";
    itemCount.style.display = "none";
    filterButtons.forEach((btn) => (btn.style.display = "none"));
  } else {
    hr.style.display = "inline";
    itemCount.style.display = "inline";
    filterButtons.forEach((btn) => (btn.style.display = "inline"));
  }
}

function updateUI() {
  updateItemCount();
  toggleElementsVisibility();
}

// ──────────────────────────────────────────────────────────────
// 🎬 Task Animations
// ──────────────────────────────────────────────────────────────

function applyNewTaskAnimation(taskElement) {
  taskElement.classList.add("new");
  setTimeout(() => {
    taskElement.classList.remove("new");
  }, 400);
}

function applyDeleteTaskAnimation(taskElement, callback) {
  taskElement.classList.add("delete");
  setTimeout(callback, 400);
}

function applyClearAllTasksAnimation(callback) {
  const taskElements = document.querySelectorAll(".task");
  taskElements.forEach((task) => task.classList.add("delete"));
  setTimeout(callback, 400);
}
