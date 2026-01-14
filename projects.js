// =====================================================
// GLOBAL PROJECTS ARRAY
// =====================================================
window.projects = JSON.parse(localStorage.getItem("taskflowProjects")) || [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesign company website with new branding",
    members: 3,
    progress: 65
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "iOS & Android app for the platform",
    members: 2,
    progress: 35
  }
];

// =====================================================
// SAVE TO LOCALSTORAGE
// =====================================================
function saveProjects() {
  localStorage.setItem("taskflowProjects", JSON.stringify(projects));
}

// =====================================================
// SHOW FLOATING MESSAGE
// =====================================================
function showMessage(text, type = "success") {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = text;
  messageBox.className = `message show ${type}`;
  setTimeout(() => messageBox.className = "message", 3000);
}

// =====================================================
// RENDER PROJECTS
// =====================================================
function renderProjects(list = projects) {
  const container = document.getElementById("projectsContainer");
  if (!container) return;
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<p class="text-muted">No projects yet</p>`;
    return;
  }

  list.forEach(project => {
    // Color de la barra de progreso usando variables CSS
    let progressColor = "var(--primary)";
    if (project.progress < 50) progressColor = "var(--danger)";
    else if (project.progress < 80) progressColor = "var(--warning)";
    else progressColor = "var(--success)";

    const card = document.createElement("div");
    card.className = "project-card";
    card.dataset.id = project.id;

    card.innerHTML = `
      <h6>${project.name}</h6>
      <p>${project.description}</p>
      <div class="progress-bar" style="width:${project.progress}%; background:${progressColor}; height:8px; border-radius:20px;"></div>
      <div class="project-meta d-flex justify-content-between mt-2">
        <span>${project.members} members</span>
        <span>${project.progress}%</span>
      </div>
      <div class="project-actions mt-2">
        <button class="edit-project btn btn-sm btn-outline-primary">Edit</button>
        <button class="delete-project btn btn-sm btn-outline-danger">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// =====================================================
// INITIAL RENDER
// =====================================================
renderProjects();

// =====================================================
// CREATE NEW PROJECT
// =====================================================
const projectForm = document.getElementById("projectForm");

projectForm?.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("projectName").value.trim();
  const description = document.getElementById("projectDesc").value.trim();
  const members = Number(document.getElementById("projectMembers").value);
  const progress = Number(document.getElementById("projectProgress").value);

  if (!name || !description || members < 1 || isNaN(progress) || progress < 0 || progress > 100) {
    showMessage("Fill all fields correctly", "error");
    return;
  }

  const newProject = {
    id: projects.length ? projects[projects.length - 1].id + 1 : 1,
    name,
    description,
    members,
    progress
  };

  projects.push(newProject);
  saveProjects();
  renderProjects();

  projectForm.reset();
  showMessage("Project added successfully!", "success");
});

// =====================================================
// EDIT AND DELETE PROJECTS
// =====================================================
document.getElementById("projectsContainer")?.addEventListener("click", e => {
  const card = e.target.closest(".project-card");
  if (!card) return;
  const id = Number(card.dataset.id);
  const project = projects.find(p => p.id === id);

  // DELETE
  if (e.target.classList.contains("delete-project")) {
    projects = projects.filter(p => p.id !== id);
    saveProjects();
    renderProjects();
    showMessage("Project deleted successfully!", "success");
  }

  // EDIT
  if (e.target.classList.contains("edit-project")) {
    const name = prompt("Project name:", project.name);
    const description = prompt("Description:", project.description);
    const members = Number(prompt("Members:", project.members));
    const progress = Number(prompt("Progress %:", project.progress));

    if (!name || !description || isNaN(members) || members < 1 || isNaN(progress) || progress < 0 || progress > 100) {
      showMessage("Invalid input. Project not updated.", "error");
      return;
    }

    project.name = name;
    project.description = description;
    project.members = members;
    project.progress = progress;

    saveProjects();
    renderProjects();
    showMessage("Project updated successfully!", "success");
  }
});
