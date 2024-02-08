import { Raycaster, Vector2 } from "three"
import { publish, subscribe } from "../utilities/EventBus"

export default class MouseControls {
  raycaster = new Raycaster()
  pointer = new Vector2(0,0)
  published = {
    intersects: null,
    selected: null
  }

  constructor (scene, camera) {
    window.addEventListener('pointermove', this.setPointer)
    window.addEventListener('click', this.select)
    setTimeout(() => publish('mousePointer', this.published), 125)
    this.scene = scene
    this.camera = camera
    subscribe('refreshMouseState', () => {
      this.published.intersects = []
      this.published.selected = null
      publish('mouseSelect', null)
    })
  }

  setPointer = (evt) => {
    this.pointer.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;

    this.raycaster.setFromCamera( this.pointer, this.camera );
    // calculate objects intersecting the picking ray
    this.published.intersects = this.raycaster.intersectObjects(
      this.scene.children.filter(ch => ch.mouseSelectable)
    )
  }

  select = () => {
    this.published.selected = this.published.intersects[0]
    publish('mouseSelect', this.published.selected)
  }



  update() {}

}