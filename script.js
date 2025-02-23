// DOM Elements
const inputField = document.getElementById("task-text");
const taskContainer = document.getElementById("task-list");
const addButton = document.getElementById("add");
const clearButton = document.getElementById("clear");

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

// Array for storing the tasks
var taskList = [];

// Retrieve data from local storage
getDataFromLocalStorage();

// Initialize all event listeners
addButton.addEventListener("click", () => addTaskToArray(inputField.value));
inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTaskToArray(inputField.value);
});
inputField.addEventListener("input", updateAddButtonColor);
inputField.addEventListener("input", search);
clearButton.addEventListener("click", clearAllTasks);

// Handle click events on task elements
taskContainer.addEventListener("click", (e) => {
  // Find the closest task element
  const taskElement = e.target.closest(".task");
  if (e.target.closest(".clear")) {
    // Remove the task from the page
    taskElement.remove();
    // Remove the task from local storage
    deleteTaskWith(taskElement.getAttribute("data-id"));
  }

  if (e.target.type === "checkbox") {
    // Toggle done class
    e.target.parentElement.parentElement.classList.toggle("done");

    // Toggle completed for the task
    toggleTaskStatusWith(
      e.target.parentElement.parentElement.getAttribute("data-id")
    );
  }
});

// Function to update the add button color
function updateAddButtonColor() {
  addButton.style.backgroundColor = inputField.value
    ? colors.active
    : colors.inactive;
}

// Function to add a task to the initial array
function addTaskToArray(input) {
  const task = {
    id: Date.now(),
    title: input,
    completed: false,
  };

  // Clear the input field
  inputField.value = "";

  // Push the task into the array
  taskList.push(task);

  // Update the color of the add button
  updateAddButtonColor();

  // Display tasks on the page
  addElementsToPageFrom(taskList);

  // Add the task to local storage
  addDataToLocalStorageFrom(taskList);
}

function addElementsToPageFrom(taskList) {
  // Empty the task container to avoid duplication
  taskContainer.innerHTML = "";

  // Display an empty state if there are no tasks
  if (taskList.length === 0) {
    taskContainer.innerHTML = `
        <span class="icon">📝</span>
        <p class="empty-message">
          No tasks found. Add some tasks to get started!
        </p>
      `;
    return;
  }

  taskList.forEach((task) => {
    // Initialize the main div
    const div = document.createElement("div");
    div.setAttribute("data-id", task.id);
    div.className = "task";
    if (task.completed) div.classList.add("done");

    // The left side contains the checkbox and task title
    const leftSide = document.createElement("span");
    leftSide.className = "left-side";

    // Initialize the checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    // Initialize a span for the task title
    const span = document.createElement("span");
    span.innerHTML = task.title;
    span.className = "text";

    // Add the checkbox and the title to the left side span
    leftSide.append(checkbox, span);

    // The right side contains the edit and delete buttons
    const rightSide = document.createElement("span");
    rightSide.className = "right-side";

    // Initialize the edit button
    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.innerHTML = icons.edit;

    // Initialize the delete button
    const removeButton = document.createElement("button");
    removeButton.className = "clear";
    removeButton.innerHTML = icons.clear;

    // Add the edit and delete buttons to the right side span
    rightSide.append(editButton, removeButton);

    // Add the left and right sides to the main div
    div.append(leftSide, rightSide);

    // Finally, append the main div to the task container
    taskContainer.appendChild(div);
  });
}

// Function to store tasks in local storage
function addDataToLocalStorageFrom(taskList) {
  window.localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Function to retrieve tasks from local storage
function getDataFromLocalStorage() {
  const data = window.localStorage.getItem("tasks");
  if (data) {
    taskList = JSON.parse(data);
    addElementsToPageFrom(taskList);
  }
}

function deleteTaskWith(taskId) {
  taskList = taskList.filter((task) => task.id !== Number(taskId));
  addDataToLocalStorageFrom(taskList);
  addElementsToPageFrom(taskList);
}

function toggleTaskStatusWith(taskId) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === Number(taskId)) {
      taskList[i].completed = !taskList[i].completed;
    }
  }
  addDataToLocalStorageFrom(taskList);
}

function clearAllTasks() {
  taskList = [];
  taskContainer.innerHTML = "";
  window.localStorage.removeItem("tasks");
  addElementsToPageFrom(taskList);
}
