// 🚀 Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("search");
  const clearAll = document.getElementById("clear");
  const addButton = document.getElementById("add");
  const clearButtons = document.querySelectorAll(".clear");

  search.addEventListener("change", filterTasks);
  clearAll.addEventListener("click", clear);
  addButton.addEventListener("click", addTask);

  clearButtons.forEach((button) =>
    button.addEventListener("click", () => clear(this))
  );
});

var arrayOfTasks = [];

function addTask() {
  const input = document.getElementById("task-text");
  const taskSection = document.getElementById("task-list");
  if (input.value !== "") {
    addTaskToArray(input.value);
    input.value = "";
  }

  const addTaskToArray = (taskText) => {
    const task = {
      id: Date.now(),
      title: taskText,
      completed: false,
    };
    arrayOfTasks.push(task);
    displayTasks(arrayOfTasks);
  };

  const displayTasks = (arrayOfTasks) => {
    taskSection.innerHTML = "";
    const div = document.createElement("div");

    div.classList.add("task");
    arrayOfTasks.forEach((task) => {
      
    });

  };
}
