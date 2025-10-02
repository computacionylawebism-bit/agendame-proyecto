const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskTimeInput = document.getElementById("taskTimeInput");

const increaseFont = document.getElementById("increaseFont");
const decreaseFont = document.getElementById("decreaseFont");
const toggleContrast = document.getElementById("toggleContrast");

const parentPassword = document.getElementById("parentPassword");
const newPassword = document.getElementById("newPassword");
const setPasswordBtn = document.getElementById("setPasswordBtn");

const setPasswordSection = document.getElementById("setPasswordSection");
const loginSection = document.getElementById("loginSection");
const taskForm = document.getElementById("taskForm");
const calendarSection = document.getElementById("calendarSection");
const accessibilitySection = document.getElementById("accessibilitySection");

const calendarView = document.getElementById("calendarView");

let fontSize = 16;
let tasks = [];
let sessionPassword = null;

// Definir la clave al ingresar
setPasswordBtn.addEventListener("click", () => {
  const newPass = newPassword.value.trim();
  if (newPass === "") {
    alert("Escribe una clave válida");
    return;
  }
  sessionPassword = newPass;
  newPassword.value = "";
  setPasswordSection.style.display = "none";
  loginSection.style.display = "block";
  taskForm.style.display = "block";
  calendarSection.style.display = "block";
  accessibilitySection.style.display = "block";
  alert("Clave configurada. Ahora puedes usar la agenda.");
});

function checkPassword() {
  const pass = parentPassword.value;
  if (sessionPassword === null) {
    alert("No hay clave configurada todavía");
    return false;
  }
  if (pass === sessionPassword) {
    return true;
  } else {
    alert("Clave incorrecta");
    return false;
  }
}

addTaskBtn.addEventListener("click", () => {
  if (!checkPassword()) return;

  const text = taskInput.value.trim();
  const category = categorySelect.value;
  const endTime = taskTimeInput.value;

  if (text === "") return alert("Escribe una tarea");
  if (endTime === "") return alert("Selecciona fecha y hora");

  tasks.push({ text, category, endTime });
  renderTasks();
  taskInput.value = "";
  taskTimeInput.value = "";
});

function renderTasks() {
  taskList.innerHTML = "";

  let selectedDate = calendarView.value ? new Date(calendarView.value) : null;

  tasks.forEach((t, index) => {
    const finishDate = new Date(t.endTime);
    if (selectedDate) {
      let sel = selectedDate.toDateString();
      let taskDay = finishDate.toDateString();
      if (sel !== taskDay) return;
    }

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task", t.category);

    const pictogram = categorySelect.querySelector(`[value="${t.category}"]`).textContent.split(" ")[0];

    taskDiv.innerHTML = `
      <p>${pictogram} ${t.text}</p>
      <small>Hora: ${finishDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
      <button onclick="speakTask('${t.text} a las ${finishDate.toLocaleTimeString()}')">🔊 Leer</button>
      <button class="completeBtn" onclick="completeTask(this)">✔ Hecho</button>
      <button class="deleteBtn" onclick="deleteTask(${index}, this)">❌ Borrar</button>
    `;

    taskList.appendChild(taskDiv);

    const now = new Date().getTime();
    const finish = finishDate.getTime();
    const msUntilDelete = finish - now;
    if (msUntilDelete > 0) {
      setTimeout(() => {
        tasks.splice(index,1);
        renderTasks();
      }, msUntilDelete);
    }
  });
}

calendarView.addEventListener("change", renderTasks);

function speakTask(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  speechSynthesis.speak(utterance);
}

function completeTask(btn) {
  btn.parentElement.style.textDecoration = "line-through";
  const utterance = new SpeechSynthesisUtterance("¡Felicitaciones, lo estás haciendo muy bien!");
  utterance.lang = "es-ES";
  speechSynthesis.speak(utterance);
}

function deleteTask(index, btn) {
  if (!checkPassword()) return;
  tasks.splice(index,1);
  renderTasks();
}

increaseFont.addEventListener("click", () => {
  fontSize += 2;
  document.documentElement.style.fontSize = fontSize + "px";
});

decreaseFont.addEventListener("click", () => {
  fontSize = Math.max(10, fontSize - 2);
  document.documentElement.style.fontSize = fontSize + "px";
});

toggleContrast.addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
});