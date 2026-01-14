// ===============================
// NAVIGATION BETWEEN SECTIONS
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar-menu a[data-page]");
  const pages = document.querySelectorAll(".page");

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetPage = link.dataset.page;

      // Quitar clase active de todas las secciones
      pages.forEach(page => page.classList.remove("active-page"));

      // Mostrar solo la sección seleccionada
      const activePage = document.getElementById(targetPage);
      if (activePage) activePage.classList.add("active-page");

      // Actualizar menú lateral
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
});
