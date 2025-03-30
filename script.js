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
        </svg>
        `,
  clear: `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M6 18L18 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          `,
  light: `
          <svg
              height="36px"
              width="36px"
              version="1.1"
              id="_x34_"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
              xml:space="preserve"
              fill="#000000"
          >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                  <g>
                      <g>
                          <g>
                              <path
                                  style="fill:#BFB61E;"
                                  d="M258.373,448.122c-11.783,0-21.337,1.395-21.337,18.136c0,8.131,9.553,45.742,21.337,45.742 
                                  c11.784,0,21.336-37.611,21.336-45.742C279.709,449.518,270.156,448.122,258.373,448.122z"
                              ></path>
                              <path
                                  style="fill:#BFB61E;"
                                  d="M352.653,422.86c-10.205,5.891-17.78,11.876-9.41,26.374c4.065,7.041,31.144,34.837,41.349,28.945 
                                  c10.205-5.892-0.328-43.241-4.393-50.282C371.829,413.4,362.858,416.968,352.653,422.86z"
                              ></path>
                              <path
                                  style="fill:#BFB61E;"
                                  d="M448.046,344.432c-14.498-8.37-20.483-0.795-26.375,9.41c-5.892,10.205-9.46,19.176,5.038,27.546 
                                  c7.041,4.065,44.39,14.598,50.282,4.393C482.883,375.576,455.087,348.497,448.046,344.432z"
                              ></path>
                              <path
                                  style="fill:#BFB61E;"
                                  d="M465.07,238.225c-16.741,0-18.136,9.553-18.136,21.337c0,11.784,1.396,21.336,18.136,21.336 
                                  c8.13,0,45.742-9.553,45.742-21.336C510.812,247.777,473.2,238.225,465.07,238.225z"
                              ></path>
                              <path
                                  style="fill:#BFB61E;"
                                  d="M426.71,137.735c-14.498,8.37-10.93,17.341-5.038,27.546c5.892,10.204,11.877,17.78,26.375,9.41 
                                  c7.041-4.065,34.837-31.144,28.945-41.349C471.099,123.137,433.75,133.67,426.71,137.735z"
                              ></path>
                              <path
                                  style="fill:#BFB61E;"
                                  d="M164.092,422.86c-10.205-5.892-19.176-9.46-27.546,5.038c-4.065,7.041-14.598,44.39-4.393,50.282 
                                  c10.205,5.892,37.283-21.904,41.349-28.945C181.872,434.737,174.297,428.752,164.092,422.86z"
                              ></path>
                              <path
                                  style="fill:#BFB61E;"
                                  d="M424.226,259.561c0-45.799-18.564-87.263-48.577-117.276L141.097,376.837 
                                  c30.013,30.013,71.477,48.578,117.276,48.578C349.971,425.415,424.226,351.159,424.226,259.561z"
                              ></path>
                          </g>
                          <g>
                              <path
                                  style="fill:#C6BA56;"
                                  d="M164.11,96.239c-10.143,5.855-19.05,9.401-27.297-4.618c-0.082-0.083-0.165-0.247-0.248-0.412 
                                  c-4.123-7.009-14.596-44.367-4.453-50.305c7.669-4.454,25.07,10.308,34.719,20.781c3.298,3.464,5.69,6.433,6.68,8.164 
                                  C181.84,84.364,174.336,90.384,164.11,96.239z"
                              ></path>
                              <g>
                                  <path
                                      style="fill:#C6BA56;"
                                      d="M279.729,52.861v0.577c-0.248,16.164-9.732,17.566-21.359,17.566 
                                      c-9.319,0-17.236-0.907-20.122-9.483c-0.824-2.227-1.237-5.113-1.237-8.66c0-5.03,3.629-21.276,9.154-32.987 
                                      c3.546-7.257,7.752-12.782,12.205-12.782c1.319,0,2.639,0.495,3.876,1.402C272.225,15.174,279.729,45.604,279.729,52.861z"
                                  ></path>
                                  <path
                                      style="fill:#C6BA56;"
                                      d="M95.085,165.264c-5.938,10.226-11.875,17.813-26.39,9.401 
                                      c-3.958-2.227-14.432-11.793-21.854-21.524c-0.082-0.083-0.165-0.165-0.165-0.248c-5.69-7.504-9.484-15.091-6.928-19.545 
                                      c5.938-10.226,43.213,0.33,50.305,4.371c1.237,0.742,2.391,1.484,3.381,2.226C103.909,147.699,100.445,155.945,95.085,165.264z"
                                  ></path>
                                  <path
                                      style="fill:#C6BA56;"
                                      d="M69.85,259.524c0,11.546-1.32,21.03-17.236,21.359h-0.907c-7.834,0-43.13-8.907-45.605-20.122 
                                      c-0.082,0-0.082,0-0.082,0c0-0.412-0.083-0.824-0.083-1.237c0-4.536,5.69-8.824,13.112-12.205 
                                      c11.711-5.525,27.709-9.071,32.657-9.071c4.701,0,8.164,0.742,10.721,2.062C69.108,243.773,69.85,251.113,69.85,259.524z"
                                  ></path>
                                  <path
                                      style="fill:#C6BA56;"
                                      d="M68.7,344.432c-7.041,4.065-34.837,31.144-28.945,41.349c5.892,10.205,43.241-0.328,50.281-4.393 
                                      c14.498-8.37,10.93-17.341,5.038-27.546C89.183,343.637,83.197,336.062,68.7,344.432z"
                                  ></path>
                                  <path
                                      style="fill:#C6BA56;"
                                      d="M352.653,96.263c10.205,5.892,19.176,9.46,27.546-5.038c4.065-7.041,14.598-44.39,4.393-50.282 
                                      c-10.205-5.892-37.284,21.904-41.349,28.945C334.873,84.386,342.448,90.371,352.653,96.263z"
                                  ></path>
                                  <path
                                      style="fill:#C6BA56;"
                                      d="M258.373,93.708c-91.598,0-165.853,74.255-165.853,165.853 
                                      c0,45.799,18.563,87.262,48.577,117.276l234.552-234.552C345.635,112.271,304.172,93.708,258.373,93.708z"
                                  ></path>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
          </svg>
          `,

  dark: `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="36px" height="36px">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#FFD700">
            </path>
          </g>
        </svg>
        `,
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
    updateAddButtonState();
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
  updateAddButtonState();
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
    darkMode.innerHTML = icons.light;
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
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.classList.add("delete");
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
        updateItemCount();
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

function updateItemCount() {
  const remainingTasks = taskList.filter((task) => !task.completed).length;
  itemCount.textContent =
    remainingTasks === 1
      ? `1 item left`
      : `${remainingTasks} items left`;
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
