
function showMsg(elementId, msg, type = "error") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = msg;
  el.className = type === "error" ? "text-danger mt-2" : "text-success mt-2";
}

/* =========================
   REGISTER
========================= */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
      showMsg("registerMessage", "All fields are required");
      return;
    }

    const user = {
      name,
      email,
      password,
      avatar: "assets/avatars/default.png",
      theme: "dark"
    };

    localStorage.setItem("taskflowUser", JSON.stringify(user));
    showMsg("registerMessage", "Account created successfully!", "success");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  });
}

/* =========================
   LOGIN
========================= */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    
    let savedUser = JSON.parse(localStorage.getItem("taskflowUser"));

    
    const DEMO_USER = {
      email: "al3xis9920@gmail.com",
      password: "123456",
      name: "Alexis",
      avatar: "assets/avatars/default.png",
      theme: "dark"
    };

    if (!savedUser && email === DEMO_USER.email && password === DEMO_USER.password) {
      savedUser = DEMO_USER;
      localStorage.setItem("taskflowUser", JSON.stringify(DEMO_USER));
    }

    if (savedUser && email === savedUser.email && password === savedUser.password) {
      localStorage.setItem("taskflowUser", JSON.stringify(savedUser));
      showMsg("loginMessage", "Login successful!", "success");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    } else {
      showMsg("loginMessage", "Correo o contraseña incorrectos", "error");
    }
  });
}

/* =========================
   AUTH GUARD & DASHBOARD INIT
========================= */
if (document.body.dataset.auth === "true") {
  const user = JSON.parse(localStorage.getItem("taskflowUser"));
  if (!user) {
    window.location.replace("login.html");
  } else {
    const userNameEl = document.getElementById("userName");
    const greetingNameEl = document.getElementById("greetingName");
    const avatarEl = document.getElementById("userAvatar");

    if (userNameEl) userNameEl.textContent = user.name;
    if (greetingNameEl) greetingNameEl.textContent = user.name;
    if (avatarEl) avatarEl.src = user.avatar || "assets/avatars/default.png";

    // ===== LOGOUT =====
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("taskflowUser");
        window.location.href = "login.html";
      });
    }
  }
}
