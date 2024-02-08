import * as THREE from 'three'
import { EnemyCharacter } from './prefabs/characters/EnemyCharacter';
import { SimpleTower } from './prefabs/towers/SimpleTower';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { WASDControls } from './controls/WASDControls'
import MouseControls from './controls/MouseControls'

// later in your init routine

const initScene = (body) => {
  const canvas = body

  var scene,
    composer,
    renderer,
    camera

  const sceneSubjects = []

  const buildScene = () => {
    scene = new THREE.Scene();
    const texture = new THREE.TextureLoader().load( "textures/background.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );
    scene.background = texture
    // scene.background = new THREE.Color( 0xas0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 10, 150 );
  }

  const buildCamera = () => {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 30
    camera.position.x = 4
    camera.position.y = 20
    camera.rotation.x = -.65  
  }

  const buildRender = () => {
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    canvas.appendChild( renderer.domElement );
    const luminosityPass = new ShaderPass( LuminosityShader );
    composer = new EffectComposer( renderer );
    composer.addPass( luminosityPass );
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
  }

  function createSceneSubjects () {
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );
    
    const floor = new THREE.Mesh( new THREE.PlaneGeometry( 500, 500 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add( floor );
    
    const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( 3, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add( dirLight );

    sceneSubjects.push(
      new WASDControls( camera, renderer.domElement )
    )
    sceneSubjects.push(
      new MouseControls( scene, camera, renderer.domElement )
    )
      
    sceneSubjects.push(
      new SimpleTower( scene, camera )
    )
    sceneSubjects.push(
      new SimpleTower( scene, camera, { basePosition: new THREE.Vector3(8, 0, 8) } )
    )
    sceneSubjects.push(
      new SimpleTower( scene, camera, { basePosition: new THREE.Vector3(0, 0, 8) } )
    )
    sceneSubjects.push(
      new SimpleTower( scene, camera, { basePosition: new THREE.Vector3(8, 0, 0) } )
    )
    // scene.add(EnemyCharacter({
    //   // helpers: true,
    //   // basePosition: new THREE.Vector3(0, 0, 0)
    // }))

  }

  function update(d) {
    for(let i=0; i<sceneSubjects.length; i++)
      sceneSubjects[i].update(d);  
    composer.render();
  }

  buildScene();
  buildCamera();
  buildRender();
  createSceneSubjects();



  return {
    update,
    onWindowResize: evt => {
      const { clientWidth, clientHeight } = canvas;
      // screenDimensions.clientWidth = clientWidth;
      // screenDimensions.clientHeight = clientHeight;
      renderer.setSize(clientWidth, clientHeight);
      composer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    }
  }
}

export default class SceneManager {
  scene
  constructor (canvas) {
    this.scene = initScene(canvas)
  }

  update = (d) => {
    this.scene.update(d)
  }
  onWindowResize = (d) => {
    this.scene.onWindowResize(d)
  }
}

