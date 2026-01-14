const taskList = document.getElementById("tasksContainer"); // unificado con dashboard
const taskCounter = document.getElementById("totalTasks"); // usar stat totalTasks

// ===============================
// RENDER TASKS
// ===============================
function renderTasks(tasks = getTasks()) {
  if (!taskList) return;

  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <p>No tasks yet. Create your first task 🚀</p>
      </div>
    `;
    if (taskCounter) taskCounter.textContent = "0";
    return;
  }

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.classList.add("task-card", `priority-${task.priority}`);
    card.dataset.id = task.id;

    card.innerHTML = `
      <div class="task-header">
        <h5>${task.title}</h5>
        <span class="badge ${task.status}">${task.status}</span>
      </div>

      <p>${task.description}</p>

      <div class="task-footer">
        <select class="statusSelect form-select form-select-sm">
          <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>In Progress</option>
          <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
        </select>

        <button class="delete-btn btn btn-sm btn-outline-danger">🗑</button>
      </div>
    `;

    taskList.appendChild(card);
  });

  if (taskCounter) taskCounter.textContent = tasks.length;
}

/* ===============================
   AUTH NAV LOGIC
================================ */
const authLink = document.getElementById("authLink");
const user = JSON.parse(localStorage.getItem("taskflowUser"));

if (authLink) {
  authLink.innerHTML = user
    ? `<a href="dashboard.html" class="btn-join">Dashboard</a>`
    : `<a href="login.html">Login</a>`;
}

/* ===============================
   HAMBURGER MENU
================================ */
const navToggle = document.getElementById("navToggle");
const navbar = document.getElementById("navbar");

if (navToggle && navbar) {
  navToggle.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });
}

/* ===============================
   LOGOUT
================================ */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("taskflowUser");
    window.location.href = "login.html";
  });
}
// ================= MODO DÍA / NOCHE =================
const toggleThemeBtn = document.getElementById("toggleTheme");
const body = document.body;

// Cargar modo guardado
const savedTheme = localStorage.getItem("taskflowTheme");
if (savedTheme === "light") {
  body.classList.add("light-mode");
  toggleThemeBtn.textContent = "Night";
} else {
  body.classList.remove("light-mode");
  toggleThemeBtn.textContent = "Day";
}

// Cambiar modo al hacer clic
toggleThemeBtn.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  const isLight = body.classList.contains("light-mode");
  localStorage.setItem("taskflowTheme", isLight ? "light" : "dark");
  toggleThemeBtn.textContent = isLight ? "Night" : "Day";
});
