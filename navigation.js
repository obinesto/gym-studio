const siteHeader = document.getElementById("site-header");
const mobileMenu = document.getElementById("mobile-menu");
const menuToggle = document.getElementById("menu-toggle");
const desktopViewport = window.matchMedia("(min-width: 901px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let previousOverflow;

function updateHeader() {
  siteHeader.classList.toggle(
    "is-scrolled",
    window.scrollY >= document.getElementById("about").offsetTop,
  );
}

function closeMobileMenu() {
  if (!mobileMenu.open) return;
  mobileMenu.close();
  document.body.style.overflow = previousOverflow;
  menuToggle.setAttribute("aria-expanded", "false");
  if (!desktopViewport.matches) menuToggle.focus({ preventScroll: true });
}

menuToggle.addEventListener("click", () => {
  previousOverflow = document.body.style.overflow;
  mobileMenu.showModal();
  document.body.style.overflow = "hidden";
  menuToggle.setAttribute("aria-expanded", "true");
});

document
  .getElementById("menu-close")
  .addEventListener("click", closeMobileMenu);
mobileMenu.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeMobileMenu();
});
mobileMenu.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const controls = mobileMenu.querySelectorAll("button, a[href]");
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
mobileMenu.addEventListener("click", (event) => {
  if (event.target !== mobileMenu) return;
  const bounds = mobileMenu.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  ) {
    closeMobileMenu();
  }
});
desktopViewport.addEventListener("change", (event) => {
  if (event.matches) closeMobileMenu();
});

document.querySelectorAll(".anchor-2").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.getElementById(link.dataset.target);
    if (!target) return;
    event.preventDefault();
    const fromMobileMenu = mobileMenu.contains(link);
    closeMobileMenu();
    target.scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
    if (fromMobileMenu) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader);
window.addEventListener("pageshow", updateHeader);
updateHeader();
