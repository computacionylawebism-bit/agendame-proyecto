const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskTimeInput = document.getElementById("taskTimeInput");

const increaseFont = document.getElementById("increaseFont");
const decreaseFont = document.getElementById("decreaseFont");
const toggleContrast = document.getElementById("toggleContrast");

const toggleModeBtn = document.getElementById("toggleModeBtn");
const parentPassword = document.getElementById("parentPassword");
let isParent = false;

const calendarView = document.getElementById("calendarView");

let fontSize = 16;
let tasks = [];

// Modo padre
toggleModeBtn.addEventListener("click", () => {
  if (!isParent) {
    if (parentPassword.value === "1234") {
      isParent = true;
      toggleModeBtn.textContent = "Salir modo padre";
      addTaskBtn.disabled = false;
      document.querySelectorAll(".deleteBtn").forEach(b => b.disabled = false);
    } else {
      alert("Clave incorrecta");
    }
  } else {
    isParent = false;
    toggleModeBtn.textContent = "Entrar modo padre";
    addTaskBtn.disabled = true;
    document.querySelectorAll(".deleteBtn").forEach(b => b.disabled = true);
  }
});

addTaskBtn.disabled = true;

// Agregar tareas
addTaskBtn.addEventListener("click", () => {
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
      <button class="deleteBtn" onclick="deleteTask(${index}, this)" ${!isParent ? "disabled":""}>❌ Borrar</button>
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

// Lector de voz
function speakTask(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  speechSynthesis.speak(utterance);
}

// Completar tarea con mensaje de felicitación
function completeTask(btn) {
  btn.parentElement.style.textDecoration = "line-through";
  const utterance = new SpeechSynthesisUtterance("¡Felicitaciones, lo estás haciendo muy bien!");
  utterance.lang = "es-ES";
  speechSynthesis.speak(utterance);
}

// Eliminar tarea
function deleteTask(index, btn) {
  if (!isParent) return alert("Solo los padres pueden borrar");
  tasks.splice(index,1);
  renderTasks();
}

// Accesibilidad: tamaño de letra
increaseFont.addEventListener("click", () => {
  fontSize += 2;
  document.documentElement.style.fontSize = fontSize + "px";
});

decreaseFont.addEventListener("click", () => {
  fontSize = Math.max(10, fontSize - 2);
  document.documentElement.style.fontSize = fontSize + "px";
});

// Alto contraste
toggleContrast.addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
});