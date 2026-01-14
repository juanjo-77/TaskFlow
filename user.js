document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("taskflowUser"));

  if (!user) {
    // Redirigir si no hay usuario
    window.location.replace("login.html");
    return;
  }

  // Elementos de usuario
  const userNameEl = document.getElementById("userName");
  const greetingNameEl = document.getElementById("greetingName");
  const userAvatarEl = document.getElementById("userAvatar");

  if (userNameEl) userNameEl.textContent = user.name || "User";
  if (greetingNameEl) greetingNameEl.textContent = user.name || "User";
  if (userAvatarEl) userAvatarEl.src = user.avatar || "assets/avatars/default.png";
});
