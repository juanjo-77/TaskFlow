const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

// Usuario demo
const DEMO_USER = {
  email: "al3xis9920@gmail.com",
  password: "123456",
  name: "Alexis",
  avatar: "assets/avatars/default.png", 
  theme: "dark"
};

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // Intentamos obtener usuario registrado desde localStorage
    let savedUser = JSON.parse(localStorage.getItem("taskflowUser"));

    // Si no hay usuario registrado, permitimos DEMO_USER
    if (!savedUser && email === DEMO_USER.email && password === DEMO_USER.password) {
      savedUser = DEMO_USER;
      localStorage.setItem("taskflowUser", JSON.stringify(DEMO_USER));
    }

    if (savedUser && email === savedUser.email && password === savedUser.password) {
      // Login exitoso
      localStorage.setItem("taskflowUser", JSON.stringify(savedUser));
      loginMessage.textContent = "Login successful!";
      loginMessage.className = "text-success mt-2";

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    } else {
      // Credenciales incorrectas
      loginMessage.textContent = "Correo o contraseña incorrectos";
      loginMessage.className = "text-danger mt-2";
    }
  });
}
