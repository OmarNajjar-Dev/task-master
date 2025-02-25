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
const itemCount = document.querySelector(".items-count");
const hr = document.querySelector("hr");
const filterButtons = document.querySelectorAll("#filters button");
const darkMode = document.getElementById("dark-mode");
const body = document.body;

// 🎨 SVG Icons for task buttons
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

// 🎨 Colors for button states
const colors = {
  active: "#34c66c",
  inactive: "#a4e5ba",
};

// 📦 Array for storing the tasks
let taskList = [];

// 🏷️ Initialize the current status as all
let currentFilter = "all";

// ⏲️ Debounce timer
let debounceTimeout;

// 🚀 Initialize app
getDataFromLocalStorage();
initializeEventListeners();

// 🎮 Event Listeners Setup
function initializeEventListeners() {
  addButton.addEventListener("click", () => addTaskToArray(inputField.value));
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTaskToArray(inputField.value);
  });
  inputField.addEventListener("input", () => {
    updateAddButtonColor();
  });
  clearButton.addEventListener("click", clearAllTasks);
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
    taskElement.classList.add("delete");
    setTimeout(() => {
      deleteTaskWith(taskId);
    }, 300);
  } else if (e.target.type === "checkbox") {
    taskElement.classList.toggle("done");
    toggleTaskStatusWith(taskId);
  } else if (e.target.closest(".edit")) {
    editTask(taskId);
  }
}

// 🎨 Update Add Button Color
function updateAddButtonColor() {
  addButton.style.backgroundColor = inputField.value
    ? colors.active
    : colors.inactive;
}

// ➕ Add New Task
function addTaskToArray(input) {
  const trimmedInput = input.trim();
  if (!trimmedInput) return;

  const task = {
    id: Date.now(),
    title: trimmedInput,
    completed: false,
  };

  taskList.push(task);
  inputField.value = "";
  updateAddButtonColor();
  addElementsToPageFrom(taskList);
  
  // Add animation class to new task
  const newTaskElement = document.querySelector(`[data-id="${task.id}"]`);
  if (newTaskElement) {
    newTaskElement.classList.add("new");
    setTimeout(() => {
      newTaskElement.classList.remove("new");
    }, 300);
  }
  
  addDataToLocalStorageFrom(taskList);
  updateItemCount();
  toggleElementsVisibility();
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
        <input type="checkbox" name="task-completed" ${
          task.completed ? "checked" : ""
        }>
        <span class="text">${task.title}</span>
      </span>
      <span class="right-side">
        <button class="edit">${icons.edit}</button>
        <button class="clear">${icons.clear}</button>
      </span>
    </div>
  `;
}

// 💾 Local Storage Operations
function addDataToLocalStorageFrom(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateItemCount();
}

function getDataFromLocalStorage() {
  const data = localStorage.getItem("tasks");
  if (data) {
    taskList = JSON.parse(data);
    addElementsToPageFrom(taskList);
    updateItemCount();
  }

  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    darkMode.textContent = "☀ Light Mode";
  }
  toggleElementsVisibility();
}

// 🗑️ Delete Task
function deleteTaskWith(taskId) {
  taskList = taskList.filter((task) => task.id !== Number(taskId));
  addDataToLocalStorageFrom(taskList);
  addElementsToPageFrom(taskList);
  updateItemCount();
  toggleElementsVisibility();
}

// ✅ Toggle Task Status
function toggleTaskStatusWith(taskId) {
  const task = taskList.find((task) => task.id === Number(taskId));
  if (task) {
    task.completed = !task.completed;
    addDataToLocalStorageFrom(taskList);
    updateItemCount();
  }
}

// 🧹 Clear All Tasks
function clearAllTasks() {
  const tasks = document.querySelectorAll('.task');
  tasks.forEach(task => {
    task.classList.add('delete');
  });
  
  setTimeout(() => {
    taskList = [];
    localStorage.removeItem("tasks");
    addElementsToPageFrom(taskList);
    updateItemCount();
    toggleElementsVisibility();
  }, 300);
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
  updateItemCount();
}

// ✏️ Edit Task
function editTask(taskId) {
  const taskElement = document.querySelector(`[data-id="${taskId}"]`);
  if (!taskElement) return;

  const textSpan = taskElement.querySelector(".text");
  const checkbox = taskElement.querySelector('input[type="checkbox"]');
  const rightSide = taskElement.querySelector(".right-side");

  checkbox.style.display = "none";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "edit-input";
  input.value = textSpan.textContent;
  textSpan.replaceWith(input);

  rightSide.innerHTML = `
    <button class="save">Save</button>
    <button class="cancel">Cancel</button>
  `;

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
  darkMode.textContent = isDarkMode ? "☀ Light Mode" : "🌙 Dark Mode";
}

function updateItemCount() {
  const remainingTasks = taskList.filter((task) => !task.completed).length;
  itemCount.textContent = `${remainingTasks} items left`;
}

function toggleElementsVisibility() {
  if (taskList.length === 0) {
    hr.style.display = "none";
    itemCount.style.display = "none";
    filterButtons.forEach((btn) => (btn.style.display = "none"));
  } else {
    hr.style.display = "inline";
    itemCount.style.display = "inline";
    filterButtons.forEach((btn) => (btn.style.display = "inline"));
  }
}
