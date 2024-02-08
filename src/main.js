import MenuManager from './menu/Menu';
import SceneManager from './scene-manager'

const canvas = document.getElementById("three-container")
const sceneManager = new SceneManager(canvas);
const menuManager = new MenuManager()
bindEventListeners();
render();

function bindEventListeners () {
  window.addEventListener("resize", sceneManager.onWindowResize)
}

function render(d) {
  requestAnimationFrame(render);
  sceneManager.update(d);
}