document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // LOAD USER INFO
  // ===============================
  const user = JSON.parse(localStorage.getItem("taskflowUser"));

  if (user) {
    const userName = document.getElementById("userName");
    const greetingName = document.getElementById("greetingName");
    const userAvatar = document.getElementById("userAvatar");

    if (userName) userName.textContent = user.name || "User";
    if (greetingName) greetingName.textContent = user.name || "User";
    if (userAvatar) userAvatar.src = user.avatar || "assets/avatars/default.png";
  }

  // ===============================
  // LOAD TASKS & PROJECTS
  // ===============================
  let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];
  let projects = JSON.parse(localStorage.getItem("taskflowProjects")) || [];

  // ===============================
  // RENDER TASKS
  // ===============================
  function renderTasks(filteredTasks = tasks) {
    const container = document.getElementById("tasksContainer");
    if (!container) return;

    container.innerHTML = "";

    if (filteredTasks.length === 0) {
      container.innerHTML = `<p class="text-muted">No tasks found</p>`;
      updateTaskStats();
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

    updateTaskStats();
  }

  function updateTaskStats() {
    const total = document.getElementById("totalTasks");
    const pending = document.getElementById("pendingTasks");
    const completed = document.getElementById("completedTasks");

    if (!total || !pending || !completed) return;

    total.textContent = tasks.length;
    pending.textContent = tasks.filter(t => t.status === "pending").length;
    completed.textContent = tasks.filter(t => t.status === "completed").length;
  }

  renderTasks();

  // ===============================
  // RENDER PROJECTS
  // ===============================
  const projectsGrid = document.querySelector(".projects-grid");

  function renderProjects() {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = "";

    if (projects.length === 0) {
      projectsGrid.innerHTML = `<p class="text-muted">No projects yet</p>`;
      return;
    }

    projects.forEach(proj => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.dataset.id = proj.id;

      card.innerHTML = `
        <h6>${proj.name}</h6>
        <p>${proj.description}</p>
        <div class="progress-bar">
          <span style="width:${proj.progress}%"></span>
        </div>
        <div class="project-meta">
          <span>${proj.members} members</span>
          <span>${proj.progress}%</span>
        </div>
        <div class="project-actions mt-2">
          <button class="edit-project btn btn-sm btn-outline-primary">Edit</button>
          <button class="delete-project btn btn-sm btn-outline-danger">✕</button>
        </div>
      `;
      projectsGrid.appendChild(card);
    });
  }

  renderProjects();

  // ===============================
  // ADD PROJECT
  // ===============================
  const newProjectBtn = document.querySelector(".page-header .btn-primary");

  if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {
      const name = prompt("Project name:");
      if (!name) return alert("Project name required");

      const description = prompt("Description:");
      if (!description) return;

      let members = parseInt(prompt("Number of members:"), 10);
      if (isNaN(members) || members < 1) members = 1;

      let progress = parseInt(prompt("Progress (0-100):"), 10);
      if (isNaN(progress) || progress < 0) progress = 0;
      if (progress > 100) progress = 100;

      const newProject = {
        id: Date.now(),
        name,
        description,
        members,
        progress
      };

      projects.push(newProject);
      localStorage.setItem("taskflowProjects", JSON.stringify(projects));

      renderProjects();
    });
  }

  // ===============================
  // PROJECT EVENTS (EDIT / DELETE)
  // ===============================
  if (projectsGrid) {
    projectsGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".project-card");
      if (!card) return;
      const projId = Number(card.dataset.id);
      const projIndex = projects.findIndex(p => p.id === projId);
      if (projIndex === -1) return;

      // Delete
      if (e.target.classList.contains("delete-project")) {
        projects.splice(projIndex, 1);
        localStorage.setItem("taskflowProjects", JSON.stringify(projects));
        renderProjects();
      }

      // Edit
      if (e.target.classList.contains("edit-project")) {
        const proj = projects[projIndex];
        const newName = prompt("Edit project name", proj.name);
        const newDesc = prompt("Edit description", proj.description);
        let newMembers = parseInt(prompt("Number of members", proj.members), 10);
        let newProgress = parseInt(prompt("Progress 0-100", proj.progress), 10);

        if (!newName || !newDesc || isNaN(newMembers) || isNaN(newProgress)) return;

        proj.name = newName;
        proj.description = newDesc;
        proj.members = newMembers;
        proj.progress = Math.min(Math.max(newProgress, 0), 100);

        localStorage.setItem("taskflowProjects", JSON.stringify(projects));
        renderProjects();
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

  // ===============================
  // LOGOUT
  // ===============================
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("taskflowUser");
      window.location.replace("login.html");
    });
  }

});
