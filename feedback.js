// ===============================
// MESSAGE BOX
// ===============================
const messageBox = document.getElementById("messageBox");
let messageTimeout;

// ===============================
// SHOW MESSAGE
// ===============================
function showMessage(text, type = "success") {
  if (!messageBox) return;

  clearTimeout(messageTimeout);

  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  messageBox.classList.add("show");

  messageTimeout = setTimeout(() => {
    messageBox.classList.remove("show");
  }, 3000);
}

// ===============================
//  SHOW INLINE FORM MESSAGE
// ===============================
function showFormMessage(text, type = "success") {
  const formMessage = document.getElementById("formMessage");
  if (!formMessage) return;

  formMessage.textContent = text;
  formMessage.className = type === "error" ? "text-danger mt-2" : "text-success mt-2";

  setTimeout(() => {
    formMessage.textContent = "";
  }, 2000);
}
