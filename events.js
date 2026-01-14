document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // HELPER: Show message
  // ===============================
  function showMessage(msg, type = "success") {
    const msgEl = document.getElementById("formMessage");
    if (!msgEl) return;
    msgEl.textContent = msg;
    msgEl.className = type === "error" ? "text-danger mt-2" : "text-success mt-2";

    setTimeout(() => {
      msgEl.textContent = "";
    }, 2000);
  }

  // ===============================
  // LOAD TASKS
  // ===============================
  let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

  // ===============================
  // RENDER TASKS
  // ===============================
  function renderTasks(filteredTasks = tasks) {
    const container = document.getElementById("tasksContainer");
    if (!container) return;

    container.innerHTML = "";

    if (filteredTasks.length === 0) {
      container.innerHTML = `<p class="text-muted">No tasks found</p>`;
      updateStats();
      return;
    }

    filteredTasks.forEach(task => {
      const card = document.createElement("div");
      card.className = `task-card priority-${task.priority}`;
      card.dataset.id = task.id;

      card.innerHTML = `
        <div class="task-header d-flex justify-content-between align-items-center">
          <h6>${task.title}</h6>
          <div>
            <button class="edit-btn btn btn-sm btn-outline-primary">Edit</button>
            <button class="delete-btn btn btn-sm btn-outline-danger">✕</button>
          </div>
        </div>
        <p>${task.description}</p>
        <div class="task-footer d-flex justify-content-between align-items-center">
          <select class="statusSelect form-select form-select-sm w-auto">
            <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>In Progress</option>
            <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
          <span class="badge bg-secondary text-uppercase">${task.priority}</span>
        </div>
      `;

      container.appendChild(card);
    });

    updateStats();
  }

  renderTasks();

  // ===============================
  // STATS
  // ===============================
  function updateStats() {
    const total = document.getElementById("totalTasks");
    const pending = document.getElementById("pendingTasks");
    const completed = document.getElementById("completedTasks");

    if (!total || !pending || !completed) return;

    total.textContent = tasks.length;
    pending.textContent = tasks.filter(t => t.status === "pending").length;
    completed.textContent = tasks.filter(t => t.status === "completed").length;
  }

  // ===============================
  // TASK FUNCTIONS
  // ===============================
  function addTask(title, description, priority) {
    const newTask = {
      id: Date.now(),
      title,
      description,
      priority,
      status: "pending"
    };
    tasks.push(newTask);
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
    renderTasks();
  }

  function updateTaskStatus(id, status) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.status = status;
      localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
      renderTasks();
    }
  }

  function updateTask(id, updated) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      Object.assign(task, updated);
      localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
      renderTasks();
    }
  }

  // ===============================
  // CREATE TASK
  // ===============================
  const taskForm = document.getElementById("taskForm");

  if (taskForm) {
    taskForm.addEventListener("submit", e => {
      e.preventDefault();

      const title = document.getElementById("taskTitle").value.trim();
      const description = document.getElementById("taskDescription").value.trim();
      const priority = document.getElementById("taskPriority").value;

      if (!title || !description || !priority) {
        showMessage("Please fill all fields", "error");
        return;
      }

      addTask(title, description, priority);
      taskForm.reset();
      showMessage("Task created successfully", "success");
    });
  }

  // ===============================
  // DELEGATION 
  // ===============================
  const tasksContainer = document.getElementById("tasksContainer");

  if (tasksContainer) {
    tasksContainer.addEventListener("click", e => {
      const card = e.target.closest(".task-card");
      if (!card) return;

      const id = Number(card.dataset.id);

      if (e.target.classList.contains("delete-btn")) {
        deleteTask(id);
        showMessage("Task deleted", "success");
      }

      if (e.target.classList.contains("edit-btn")) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const title = prompt("Edit title:", task.title);
        if (!title) return;
        const description = prompt("Edit description:", task.description);
        if (!description) return;
        const priority = prompt("Priority (high, medium, low):", task.priority);
        if (!["high", "medium", "low"].includes(priority)) return;
        const status = prompt("Status (pending, in-progress, completed):", task.status);
        if (!["pending", "in-progress", "completed"].includes(status)) return;

        updateTask(id, { title, description, priority, status });
        showMessage("Task updated", "success");
      }
    });

    tasksContainer.addEventListener("change", e => {
      if (e.target.classList.contains("statusSelect")) {
        const card = e.target.closest(".task-card");
        const id = Number(card.dataset.id);
        updateTaskStatus(id, e.target.value);
        showMessage("Status updated", "success");
      }
    });
  }

  // ===============================
  // FILTERS
  // ===============================
  const statusFilter = document.getElementById("statusFilter");
  const priorityFilter = document.getElementById("priorityFilter");

  function applyFilters() {
    let filtered = [...tasks];
    if (statusFilter && statusFilter.value !== "all") {
      filtered = filtered.filter(t => t.status === statusFilter.value);
    }
    if (priorityFilter && priorityFilter.value !== "all") {
      filtered = filtered.filter(t => t.priority === priorityFilter.value);
    }
    renderTasks(filtered);
  }

  if (statusFilter) statusFilter.addEventListener("change", applyFilters);
  if (priorityFilter) priorityFilter.addEventListener("change", applyFilters);

});
