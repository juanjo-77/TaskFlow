// ===============================
// FILTERS
// ===============================
function applyFilters() {
  if (!window.tasks) return; 

  let filtered = [...tasks];

  const status = document.getElementById("statusFilter")?.value || "all";
  const priority = document.getElementById("priorityFilter")?.value || "all";

  // Filtrar por estado
  if (status !== "all") {
    filtered = filtered.filter(task => task.status === status);
  }

  // Filtrar por prioridad
  if (priority !== "all") {
    filtered = filtered.filter(task => task.priority === priority);
  }

  renderTasks(filtered);
}

// ===============================
// EVENT LISTENERS
// ===============================
const statusFilterEl = document.getElementById("statusFilter");
const priorityFilterEl = document.getElementById("priorityFilter");

if (statusFilterEl) statusFilterEl.addEventListener("change", applyFilters);
if (priorityFilterEl) priorityFilterEl.addEventListener("change", applyFilters);
