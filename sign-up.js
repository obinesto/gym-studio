const signupForm = document.getElementById("signup-form");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const confirmError = document.getElementById("confirm-error");
const signupButton = document.getElementById("signup-button");
const signupFeedback = document.getElementById("signup-feedback");
let signupComplete = false;

function checkPasswordMatch() {
  const mismatch =
    confirmPasswordInput.value !== "" &&
    passwordInput.value !== confirmPasswordInput.value;
  const message = mismatch ? "Your passwords must match." : "";
  confirmPasswordInput.setCustomValidity(message);
  confirmPasswordInput.setAttribute("aria-invalid", String(mismatch));
  confirmError.textContent = message;
}

passwordInput.addEventListener("input", checkPasswordMatch);
confirmPasswordInput.addEventListener("input", checkPasswordMatch);

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (signupComplete) return;
  checkPasswordMatch();
  if (!signupForm.reportValidity()) return;

  signupComplete = true;
  signupButton.disabled = true;
  signupButton.textContent = "Returning to studio…";
  const notification = document.getElementById("signup-notification").content.firstElementChild.cloneNode(true);
  const dismissButton = notification.querySelector("button");
  const returnToStudio = () => window.location.assign("index.html");

  if (typeof Toastify === "function") {
    const toast = Toastify({
      node: notification,
      duration: 3000,
      gravity: "top",
      position: "right",
      close: false,
      stopOnFocus: false,
      className: "signup-toast",
      ariaLive: "polite",
      callback: returnToStudio,
    });
    dismissButton.addEventListener("click", () => toast.hideToast());
    toast.showToast();
  } else {
    signupFeedback.replaceChildren(notification);
    dismissButton.addEventListener("click", returnToStudio);
    signupFeedback.hidden = false;
    setTimeout(returnToStudio, 3000);
  }
});

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  signupComplete = false;
  signupButton.disabled = false;
  signupButton.textContent = "Sign Up";
  signupFeedback.hidden = true;
});
