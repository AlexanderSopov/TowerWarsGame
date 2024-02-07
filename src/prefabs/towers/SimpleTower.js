import * as THREE from 'three'
import { subscribe } from '../../utilities/EventBus'

const SIZE = 1.5
const color = 0xa4444a

export class SimpleTower {

  mousePointer = {}

  constructor (scene, camera, opts) {

    const { helpers, basePosition } = opts ?? {}

    this.scene = scene
    this.camera = camera

    this.character = new THREE.Object3D()
    this.character.mouseSelectable = true

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

    subscribe('mousePointer', mousePointer => {
      this.mousePointer = mousePointer
    })
  }

  isSelectable () {
    const { intersects } = this.mousePointer
    if (
      intersects
      && intersects[0]
      && intersects[0].object.id == this.cube.id
    ) {
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