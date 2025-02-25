import MenuUI from './menu';
import SceneManager from './scene-manager'
import * as THREE from 'three'

const canvas = document.getElementById("three-container")
const sceneManager = new SceneManager(canvas);
const menuUI = new MenuUI()
bindEventListeners();
const clock = new THREE.Clock();
let previousTime = 0;
render();

function bindEventListeners () {
  window.addEventListener("resize", sceneManager.onWindowResize)
}

function render() {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  requestAnimationFrame(render);
  sceneManager.update(deltaTime);
}