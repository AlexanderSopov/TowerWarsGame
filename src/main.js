import SceneManager from './scene-manager'

const canvas = document.body
const sceneManager = new SceneManager(canvas);
bindEventListeners();
render();

function bindEventListeners () {
  window.addEventListener("resize", sceneManager.onWindowResize)
}

function render(d) {
  requestAnimationFrame(render);
  sceneManager.update(d);
}