const DESIGN_WIDTH = 2560;
const DESIGN_HEIGHT = 1606;

function fitPrototype() {
  const scale = Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT);
  document.documentElement.style.setProperty("--scale", String(scale));
}

window.addEventListener("resize", fitPrototype);
window.addEventListener("orientationchange", fitPrototype);
fitPrototype();
