import * as THREE from 'three'

const SIZE = 1.5
const color = 0xa4444a
export class SimpleTower {
  constructor (scene, camera, opts) {

    const { helpers, basePosition } = opts ?? {}

    this.scene = scene
    this.camera = camera

    this.character = new THREE.Object3D

    const geometry = new THREE.CylinderGeometry( SIZE * 1, SIZE * 1.5, SIZE * 4, 8 ); 
    const material = new THREE.MeshStandardMaterial( { color } );
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.y = 1
    this.cube.castShadow = true
    this.character.add( this.cube );

    if (helpers) {
      this.character.add( createPlaneGeo() );
    } 


    if (basePosition) {
      this.character.position.x = basePosition.x
      this.character.position.y = basePosition.y
      this.character.position.z = basePosition.z
    }

    this.scene.add(this.character)
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2(0,0)
    window.addEventListener('pointermove', this.setPointer)
  }

  setPointer = (evt) => {
  
    this.pointer.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;
  
  }

  isSelectable () {// update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera( this.pointer, this.camera );
  
    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObject( this.character );
  
    if (intersects[0] && intersects[0].object.id == this.cube.id) {
      this.cube.material.color.set( 0x0000ff );
      document.body.style.cursor = 'pointer';
    } else {
      this.cube.material.color.set( color );
    }
  }

  update () {
    this.isSelectable()
  }
}