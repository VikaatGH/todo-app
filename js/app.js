const greet = document.getElementById("greet-container");
let choices;
function checkUserStatus() {
  const userName = localStorage.getItem("userName");

  if (!userName) {
    greet.innerHTML = `
        <header class="header-hello">
        <h1>Hello! Welcome to the Todo App.
        </h1>
        </header>
        <h3>
        What's your name?
        </h3>
        <div class="input-name">
        <input type="text" class="input-field" id="nameInput" placeholder="Enter your name:">
        <button class="btn-remember" onclick="saveName()">
        </button>
        </div>
        `;
    const nameInput = document.getElementById("nameInput");
    nameInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        saveName();
      }
    });
  } else {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const today = new Date();

    var year = today.getFullYear();
    var monthIndex = today.getMonth();
    var day = today.getDate();
    var monthName = monthNames[monthIndex];

    var formattedDate = `${day} ${monthName} ${year}`;

    greet.innerHTML = `
    <header class="header-hello header-plan">
    <h1>Welcome, ${userName}! Ready to get productive?
    </h1>
    </header>
    <div class="plan-container">
    <div class="calendar-form">
    <div class="calendar-wrapper">
    <h3 class="calendar-heading" id="calendar-heading">Let's choose a day to plan.<br>Today is ${formattedDate}</h3>
    <div id="calendar-container"></div>
    </div>
    <div class="todo-container" id="todo-container"></div> 
    </div> 
    <div class="todos">
    <ul class="todo-list"></ul>
    <div id="progress"></div>
    </div>
    </div>
    `;
    displayCalendar();
  }
}

function saveName() {
  const nameInput = document.getElementById("nameInput").value;

  if (nameInput) {
    localStorage.setItem("userName", nameInput);
    checkUserStatus();
  } else {
    alert("Please enter the name.");
    return;
  }
}

function displayCalendar() {
  var field = document.getElementById("calendar-container");
  var picker = new Pikaday({
    firstDay: 1,
    onSelect: function (date) {
      showDate(date);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate >= currentDate) displayForm(date);
      else displayTodos(date);
    },
  });
  field.parentNode.insertBefore(picker.el, field.nextSibling);
}

function showDate(date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  var year = date.getFullYear();
  var monthIndex = date.getMonth();
  var day = date.getDate();
  var monthName = monthNames[monthIndex];

  var formattedDate = `${day} ${monthName} ${year}`;

  let heading = document.getElementById("calendar-heading");
  heading.innerHTML = `${formattedDate}`;
}

function displayForm(date) {
  let todoContainer = document.getElementById("todo-container");
  todoContainer.innerHTML = `<div class="todo-small-container"><input type="text" placeholder="Add a new todo" class="input-todo" id="input-todo">
  <div class="select-container">
  <label for="categories" class="label-todo">Choose a category:</label>
  <select name="categories" class="select-category" id="categories">
  <option value="cooking">cooking</option>
  <option value="eating">eating</option>
  <option value="hobby">hobby</option>
  <option value="housework">housework</option>
  <option value="other" selected>other</option>
  <option value="rest">rest</option>
  <option value="shopping">shopping</option>
  <option value="sport">sport</option>
  <option value="study">study</option>
  <option value="travel">travel</option>
  <option value="work">work</option>
  </select>
  </div>
  <div class="time-container">
  <label for="input-time" class="label-time">Choose time:</label>
  <input type="text" class="input-time" id="timepicker">
  </div>
  </div>
  <button class="btn-add" id="btn-add" onclick="addTodo('${date}')"></button>
  `;

  $("#timepicker").clockTimePicker({
    duration: true, // Optional: enables duration mode
    precision: 5, // Optional: sets precision in minutes
    colors: {
      clockInnerCircleTextColor: "#221712", // Change this to your desired color
      clockOuterCircleTextColor: "#221712",
      hoverCircleColor: "rgb(38,78,54,0.7)",
      selectorColor: "rgb(38,78,54,0.7)",
    },
    fonts: {
      clockInnerCircleFontSize: 14,
      clockOuterCircleFontSize: 16,
    },
  }),
    displayTodos(date);
  const selectElement = document.getElementById("categories");
  choices = new Choices(selectElement, {
    searchEnabled: false,
    itemSelectText: "",
    position: "bottom",
  });
}

function displayTodos(date) {
  const todoListElements = document.getElementsByClassName("todo-list");
  const todoListElement = todoListElements[0];
  todoListElement.innerHTML = "";

  const todos = JSON.parse(localStorage.getItem(date)) || [];

  const sortedTodos = sortTodosByComplete(todos);

  const categoryImages = {
    cooking: "./pictures/cook.png",
    eating: "./pictures/eat.png",
    hobby: "./pictures/hobby.png",
    housework: "./pictures/house.png",
    other: "./pictures/other.png",
    rest: "./pictures/rest.png",
    shopping: "./pictures/shop.png",
    sport: "./pictures/sport.png",
    study: "./pictures/study.png",
    travel: "./pictures/travel.png",
    work: "./pictures/work.png",
    completed: "./pictures/done.png",
  };

  sortedTodos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.classList.add("todo-item");

    const img = document.createElement("img");
    img.src = todo.completed
      ? categoryImages.completed
      : categoryImages[todo.category];
    img.classList.add("category-icon");
    img.alt = `${todo.category} icon`;

    const timeTodo = document.createElement("span");
    timeTodo.textContent = todo.time;
    timeTodo.style.textDecoration = todo.completed ? "line-through" : "none";
    timeTodo.classList.add("timeTodo");

    const todoText = document.createElement("span");
    todoText.textContent = todo.task;
    todoText.style.textDecoration = todo.completed ? "line-through" : "none";
    todoText.classList.add("todoText");
    todoText.id = "todoText";

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const edit = document.createElement("button");
    edit.classList.add("btn-edit");

    const remove = document.createElement("button");
    remove.classList.add("btn-remove");

    const ready = document.createElement("button");
    ready.classList.add("btn-ready");

    buttons.appendChild(edit);
    buttons.appendChild(remove);
    buttons.appendChild(ready);

    li.appendChild(img);
    li.appendChild(timeTodo);
    li.appendChild(todoText);
    li.appendChild(buttons);

    todoListElement.appendChild(li);

    edit.onclick = () => {
      editTodo(date, index);
    };

    remove.onclick = () => {
      removeTodo(date, index);
    };

    ready.onclick = () => {
      toggleComplete(date, index);
    };
  });

  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;

  const progressContainer = document.getElementById("progress");
  progressContainer.innerHTML = `Progress: ${completedTodos} / ${totalTodos}`;
}

function addTodo(date) {
  const task = document.getElementById("input-todo").value;
  const category = document.getElementById("categories").value;
  const time = $("#timepicker").val();

  if (!task.trim()) {
    alert("Please enter a todo.");
    return;
  }

  if (!time) {
    alert("Please enter time.");
    return;
  }

  const newTodo = {
    task,
    category,
    time,
    completed: false,
  };

  let todos = JSON.parse(localStorage.getItem(date)) || [];

  todos.push(newTodo);

  const sortedTodos = sortTodosByTime(todos);

  localStorage.setItem(date, JSON.stringify(sortedTodos));

  document.getElementById("input-todo").value = "";
  choices.setChoiceByValue("other");
  $("#timepicker").val("");

  displayTodos(date);
  resetAddButton(date);
}

function resetAddButton(date) {
  const btnAdd = document.getElementById("btn-add");
  btnAdd.onclick = () => addTodo(date);
}

function sortTodosByTime(todos) {
  return todos.sort((a, b) => {
    const timeA = formatTime(a.time); // Get time in minutes
    const timeB = formatTime(b.time); // Get time in minutes
    return timeA - timeB; // Sort numerically
  });
}

function sortTodosByComplete(todos) {
  return todos.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const timeA = formatTime(a.time);
    const timeB = formatTime(b.time);
    return timeA - timeB;
  });
}
function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes; // Total minutes from midnight
}
function toggleComplete(date, index) {
  let todos = JSON.parse(localStorage.getItem(date));
  todos[index].completed = !todos[index].completed;

  const sortedTodos = sortTodosByComplete(todos);

  localStorage.setItem(date, JSON.stringify(sortedTodos));
  displayTodos(date);
}

function removeTodo(date, index) {
  let todos = JSON.parse(localStorage.getItem(date));
  todos.splice(index, 1);
  localStorage.setItem(date, JSON.stringify(todos));
  displayTodos(date);
}
function editTodo(date, index) {
  let todos = JSON.parse(localStorage.getItem(date));

  let inputTodo = document.getElementById("input-todo");
  inputTodo.value = todos[index].task;

  choices.setChoiceByValue(todos[index].category);

  $("#timepicker").val(todos[index].time);

  const todoItems = document.querySelectorAll(".todo-item");
  const currentTodItem = todoItems[index];

  currentTodItem.classList.add("editing");

  let btnAdd = document.getElementById("btn-add");
  btnAdd.onclick = null;

  btnAdd.onclick = () => {
    if (!inputTodo.value.trim()) {
      alert("Please enter a todo.");
      return;
    }

    if (!$("#timepicker").val()) {
      alert("Please enter time.");
      return;
    }

    todos[index].task = inputTodo.value;
    todos[index].category = document.getElementById("categories").value;
    todos[index].time = $("#timepicker").val();

    inputTodo.value = "";
    choices.setChoiceByValue("other");
    $("#timepicker").val("");

    let sortedTodos = sortTodosByTime(todos);
    localStorage.setItem(date, JSON.stringify(sortedTodos));

    displayTodos(date);

    resetAddButton(date);
    currentTodoItem.classList.remove("editing");
  };
}
window.onload = checkUserStatus;
