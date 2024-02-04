import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

const SIZE = 1.5

const createRectLight = (x, y, z) => {
  const width = SIZE * 1.33;
  const height = SIZE * 1.33;
  const intensity = .5;
  const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
  rectLight.position.set( x, y, z );
  rectLight.lookAt( 0, 0, 0 );
  return rectLight
}

const createPlaneGeo = () => {
  const planegeometry = new THREE.PlaneGeometry( SIZE, SIZE );
  const planematerial = new THREE.MeshStandardMaterial( {color: 0xaaaaaa, side: THREE.FrontSide} );
  const plane = new THREE.Mesh( planegeometry, planematerial );
  plane.rotation.x = - Math.PI / 2
  plane.receiveShadow = true
  return plane
}


export const EnemyCharacter = (props) => {
  const { helpers, basePosition } = props

  const character = new THREE.Object3D

  // const rectLight = createRectLight(1.75, 1.75, 0)
  // character.add(rectLight)
  // const rectLight2 = createRectLight(-1, 1.75, -1)
  // character.add(rectLight2)

  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshStandardMaterial( { color: 0xbb4400 } );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.y = 1
  cube.castShadow = true
  character.add( cube );


  if (helpers) {
    // const rectLightHelper = new RectAreaLightHelper( rectLight );
    // const rectLightHelper2 = new RectAreaLightHelper( rectLight2 );
    // rectLight.add( rectLightHelper );
    // rectLight2.add( rectLightHelper2 );
    character.add( createPlaneGeo() );
  } 

  function animate () {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
  animate()
  if (basePosition) {
    character.position.x = basePosition.x
    character.position.y = basePosition.y
    character.position.z = basePosition.z
  }
  return character
}