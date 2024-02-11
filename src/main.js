import MenuUI from './menu';
import SceneManager from './scene-manager'

const canvas = document.getElementById("three-container")
const sceneManager = new SceneManager(canvas);
const menuUI = new MenuUI()
bindEventListeners();
render();

function bindEventListeners () {
  window.addEventListener("resize", sceneManager.onWindowResize)
}

function render(d) {
  requestAnimationFrame(render);
  sceneManager.update(d);
}