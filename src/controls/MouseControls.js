import { Raycaster, Vector2 } from "three"
import { addIntersects, setSelected } from "../store/mousePointer/Slice"
import { store } from "../store"

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
    this.scene = scene
    this.camera = camera
    store.subscribe(this.storeUpdater)
  }

  setPointer = (evt) => {
    this.pointer.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;

    this.raycaster.setFromCamera( this.pointer, this.camera );

    const objectsToIntersect = this.scene.children.filter(ch => ch.mouseSelectable)
    const intersects = this.raycaster.intersectObjects(
      objectsToIntersect
    )

    if (!!this.published.intersects || intersects.length > 0) {
      store.dispatch(
        addIntersects(
          intersects[0] ?
            { id: intersects[0].object.id } :
            null
        )
      )
    }
  }

  select = () => {
    store.dispatch(
      setSelected(
        this.published.intersects
      )
    )
  }

  storeUpdater = () => {
    const state = store.getState()
    this.published = state.mousePointer
  }

  update() {}

}