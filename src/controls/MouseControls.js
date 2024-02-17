import { Raycaster, Vector2 } from "three"
import { addIntersects, setSelected } from "../store/mousePointerSlice"
import { store } from "../store"
import { publish, subscribe } from "../utilities/EventBus"
import { getSceneSubjects } from "../scene-manager"

const roundToTwo = x => Math.round(x / 2) * 2

export default class MouseControls {
  raycaster = new Raycaster()
  pointer = new Vector2(0,0)
  placeableObject = null
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
    subscribe('PlaceObject', placeableObject => this.placeableObject = placeableObject)

  }

  setPointer = (evt) => {
    this.pointer.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;
  }

  select = () => {
    if (this.placeableObject) {
      publish('ConstructObject', this.placeableObject)
      this.placeableObject = null
      return
    }
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

  handleIntersections () {

    this.raycaster.setFromCamera( this.pointer, this.camera );

    const objectsToIntersect = getSceneSubjects().filter(ch => ch.mouseSelectable)
    const intersects = this.raycaster.intersectObjects(
      objectsToIntersect
    )

    if ((!!this.published.intersects || intersects.length > 0) && !this.placeableObject) {
      store.dispatch(
        addIntersects(
          intersects[0] ?
            { id: intersects[0].object.id } :
            null
        )
      )
    }
  }

  handlePlacing () {
    this.placeableObject.position.x = this.pointer.x
    this.placeableObject.position.y = this.pointer.y

    this.raycaster.setFromCamera( this.pointer, this.camera );
    const intersection = this.raycaster.intersectObject(getSceneSubjects().find(ss => ss.isFloor))
    if (intersection.length > 0) {
      this.placeableObject.position.x = roundToTwo(intersection[0].point.x)
      this.placeableObject.position.y = (intersection[0].point.y)
      this.placeableObject.position.z = roundToTwo(intersection[0].point.z)
    }
}

update() {
    this.handleIntersections()
    if (this.placeableObject)
      this.handlePlacing()
  }

}