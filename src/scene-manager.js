import * as THREE from 'three'

import { SimpleTower } from './prefabs/towers/SimpleTower';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { KeyboardControls } from './controls/KeyboardControls'
import MouseControls from './controls/MouseControls'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import TowerBuilders from './builders/TowerBuilders';
import { TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH, roundToTile } from './tile-system';
import { TestEnemy } from './prefabs/characters/TestEnemy';
import { TextureLoader } from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";

const textureLoader = new TextureLoader();
const rgbeLoader = new RGBELoader();

const loadEnv = async (scene, renderer) => {
  const env = await rgbeLoader.loadAsync("/minedump_flats_1k.hdr")
  env.mapping = THREE.EquirectangularReflectionMapping;
  renderer.toneMappingExposure = 0.65;
  renderer.toneMapping =
    // THREE.ACESFilmicToneMapping
    THREE.NoToneMapping
    // THREE.LinearToneMapping
    // THREE.ReinhardToneMapping
    // THREE.CineonToneMapping
  scene.background = env;
  scene.environment = env;
  scene.environmentIntensity = 1.5
  // environmentMap.rotation.y = Math.PI * 0.5
  scene.environmentRotation = new THREE.Euler( 0, Math.PI / -2, 0, 'XYZ' );
  scene.backgroundRotation = new THREE.Euler( 0, Math.PI / -2, 0, 'XYZ' );

}

// ORIGINAL PASS
const loadFloor = async (midW, midH) => {
  const [
    diff,
    dis,
    ao,
    rough,
    nor
  ] = await Promise.all([
      textureLoader.loadAsync("/textures/tiles/DIFF.jpg").catch(err => {
        console.log("error loading", "/textures/tiles/DIFF.jpg", err)
      }),
      textureLoader.loadAsync("/textures/tiles/DIS.jpg").catch(err => {
        console.log("error loading", "/textures/tiles/DIS.jpg", err)
      }),
      textureLoader.loadAsync("/textures/tiles/AO.jpg").catch(err => {
        console.log("error loading", "/textures/tiles/AO.jpg", err)
      }),
      textureLoader.loadAsync("/textures/tiles/ROUGH.jpg").catch(err => {
        console.log("error loading", "/textures/tiles/ROUGH.jpg", err)
      }),
      textureLoader.loadAsync("/textures/tiles/NORGL.jpg").catch(err => {
        console.log("error loading", "/textures/tiles/NORGL.jpg", err)
      }),
  ])
  diff.colorSpace = THREE.SRGBColorSpace;
  diff.wrapS = THREE.RepeatWrapping;
  diff.wrapT = THREE.RepeatWrapping;
  diff.repeat.set(8, 8);
  nor.wrapS = THREE.RepeatWrapping;
  nor.wrapT = THREE.RepeatWrapping;
  nor.repeat.set(8, 8);
  dis.wrapS = THREE.RepeatWrapping;
  dis.wrapT = THREE.RepeatWrapping;
  dis.repeat.set(8, 8);
  ao.wrapS = THREE.RepeatWrapping;
  ao.wrapT = THREE.RepeatWrapping;
  ao.repeat.set(8, 8);
  rough.wrapS = THREE.RepeatWrapping;
  rough.wrapT = THREE.RepeatWrapping;
  rough.repeat.set(15, 15);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry( WORLD_WIDTH * TILE_SIZE, WORLD_HEIGHT * TILE_SIZE, 50, 50 ),
    new THREE.MeshStandardMaterial({
      displacementBias: -.325,
      displacementScale: .75,
      displacementMap: dis,
      normalMap: nor,
      normalScale: new THREE.Vector2(5, 5),
      aoMap: ao,
      map: diff,
      metalness: 1,
      roughnessMap: rough,
      roughness: 1
    })
  );
  floor.rotation.x = - Math.PI / 2;
  floor.receiveShadow = true;
  floor.isFloor = true
  floor.position.add(new THREE.Vector3(midW, 0, midH))
  floor.position.setY(0)
  return floor
  // floor.position.add(new THREE.Vector3(WORLD_WIDTH * TILE_SIZE / 2, WORLD_HEIGHT * TILE_SIZE / 2, 0))
  
}


const sceneSubjects = []

export const removeSceneSubject = (ch) => {
  const i = sceneSubjects.findIndex(ss => ss.id == ch.id)
  if (i < 0)
    throw new Error("Object not a subject of scene")
  sceneSubjects.splice(i, 1)
}
export const addSceneSubject = (ss) => sceneSubjects.push(ss)
export const getSceneSubjects = () => sceneSubjects


const initScene = (body) => {
  const canvas = body
  const midW = WORLD_WIDTH * TILE_SIZE / 2
  const midH = WORLD_HEIGHT * TILE_SIZE / 2
  var scene,
    composer,
    renderer,
    camera

  const buildScene = () => {
    scene = new THREE.Scene();
    // const texture = new THREE.TextureLoader().load( "textures/background.png" );
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set( 1, 1 );
    // scene.background = texture
    // scene.background = new THREE.Color( 0xas0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 10, 250 );
  }

  const buildCamera = () => {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 50 + midH
    camera.position.x = 4 + midW
    camera.position.y = 40
  }

  const buildRender = async () => {
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    canvas.appendChild( renderer.domElement );
    const luminosityPass = new ShaderPass( LuminosityShader );
    composer = new EffectComposer( renderer );
    composer.addPass( luminosityPass );
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
    loadEnv(scene, renderer)
  }

  async function createSceneSubjects () {
    // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
    // hemiLight.position.set( 0, 20, 0 );
    // scene.add( hemiLight );
    
    const floor = await loadFloor(midW, midH);
    scene.add( floor );
    floor.update = () => {}
    sceneSubjects.push(floor)
    
    // const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    // dirLight.position.set( 3, 10, 10 );
    // dirLight.castShadow = true;
    // dirLight.shadow.camera.top = 2;
    // dirLight.shadow.camera.bottom = - 2;
    // dirLight.shadow.camera.left = - 2;
    // dirLight.shadow.camera.right = 2;
    // dirLight.shadow.camera.near = 0.1;
    // dirLight.shadow.camera.far = 40;
    // scene.add( dirLight );

    sceneSubjects.push(
      new KeyboardControls( camera, renderer.domElement )
    )
    sceneSubjects.push(
      new MouseControls( scene, camera, renderer.domElement )
    )
    
    // sceneSubjects.push(
    //   new OrbitControls( camera, renderer.domElement )
    // )
      
    sceneSubjects.push(
      new TestEnemy ( scene )
    )
    // sceneSubjects.push(
    //   new SimpleTower( scene, camera, { basePosition: new THREE.Vector3(roundToTile(8 + midW), 0, roundToTile(8 + midH)) } )
    // )
    // sceneSubjects.push(
    //   new SimpleTower( scene, camera, { basePosition: new THREE.Vector3(midW, 0, roundToTile(8 + midH)) } )
    // )
    // sceneSubjects.push(
    //   new SimpleTower( scene, camera, { basePosition: new THREE.Vector3(roundToTile(8 + midW), 0, midH) } )
    // )
    sceneSubjects.push(
      new TowerBuilders(scene, camera)
    )
    // scene.add(EnemyCharacter({
    //   // helpers: true,
    //   // basePosition: new THREE.Vector3(0, 0, 0)
    // }))
    // scene.add(new TestEnemy({
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

