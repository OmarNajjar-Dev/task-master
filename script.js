const input = document.getElementById("task-text");
const taskSection = document.getElementById("task-list");
const addButton = document.getElementById("add");

input.addEventListener("input", () => {
  addButton.style.backgroundColor =
    input.value.trim() !== "" ? "#34c66c" : "#a4e5ba";
});

// Empty Array To Store The Tasks
var arrayOfTaks = [];

// Check if Theres are Tasks In Local Storage
if (localStorage.getItem("tasks")) {
  arrayOfTaks = JSON.parse(localStorage.getItem("tasks"));
}

// Trigger Get Data From Local Storage Function
getDataFromLocalStorage();

// Add Task
addButton.addEventListener("click", () => {
  if (input.value !== "") {
    addTaskToArray(input.value); // Add Task To Array Of Tasks
    input.value = ""; // Empty Input Field
  }
});

// Click On Task Element
taskSection.addEventListener("click", (e) => {
  // Delete Button
  if (e.target.classList.contains("clear")) {
    // Remove Task From Local Storage
    deleteTaskWith(e.target.parentElement.getAttribute("data-id"));
    // Remove Element From Page
    e.target.parentElement.remove();
  }
  // Task Element
  if (e.target.classList.contains("task")) {
    // Toggle Completed For The Task
    toggleStatusTaskWith(e.target.getAttribute("data-id"));
    // Toggle Done class
    e.target.classList.toggle("done");
  }
});

function addTaskToArray(taskText) {
  // Task Data
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  // Push Task To Array Of Tasks
  arrayOfTaks.push(task);
  // Add Tasks To Page
  addElementsToPageFrom(arrayOfTaks);
  // Add Tasks To Locale Storage
  addDataToLocalStorageFrom(arrayOfTaks);
}

function addElementsToPageFrom(arrayOfTaks) {
  // Empty Tasks Div
  taskSection.innerHTML = "";
  // Looping On Array Of Tasks
  arrayOfTaks.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task";
    // Check If Task is Done
    if (task.completed) {
      div.className = "task done";
    }
    div.setAttribute("data-id", task.id);
    div.appendChild(document.createTextNode(task.title));
    // Create clear Button
    const span = document.createElement("span");
    span.className = "clear";
    span.appendChild(document.createTextNode("❌"));
    // Append Button To Main Div
    div.appendChild(span);
    // Add Task Div To Tasks Section
    taskSection.appendChild(div);
  });
}

function addDataToLocalStorageFrom(arrayOfTaks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTaks));
}

function getDataFromLocalStorage() {
  const data = window.localStorage.getItem("tasks");
  if (data) {
    const tasks = JSON.parse(data);
    addElementsToPageFrom(tasks);
  }
}

function deleteTaskWith(taskId) {
  arrayOfTaks = arrayOfTaks.filter((task) => task.id != taskId);
  addDataToLocalStorageFrom(arrayOfTaks);
}

function toggleStatusTaskWith(taskId) {
  for (var i = 0; i < arrayOfTaks.length; i++) {
    if (arrayOfTaks[i].id === taskId) {
      arrayOfTaks[i].completed === false
        ? (arrayOfTaks[i].completed = true)
        : (arrayOfTaks[i].completed = false);
    }
  }
}
