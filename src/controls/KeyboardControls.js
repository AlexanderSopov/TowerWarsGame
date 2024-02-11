import { store } from "../store"
import { refreshState } from "../store/mousePointer/Slice"

export class KeyboardControls {
  camera
  up = false
  down = false
  left = false
  right = false
  y = 0

  constructor (camera) {
    this.camera = camera
    document.addEventListener('keydown', evt => {
      switch (evt.key) {
        case "w":
          this.up = true
          break
        case "a":
          this.left = true
          break
        case "d":
          this.right = true
          break
        case "s":
          this.down = true
          break
        case "x":
          this.y = 1
          break
        case "z":
          this.y = -1
          break
        case "Escape":
          store.dispatch(refreshState())
          break
      }
    })
    document.addEventListener('keyup', evt => {
      switch (evt.key) {
        case "w":
          this.up = false
          break
        case "a":
          this.left = false
          break
        case "d":
          this.right = false
          break
        case "s":
          this.down = false
          break
        case "x":
          this.y = 0
          break
        case "z":
          this.y = 0
          break
      }
    })
  }

  update(delta) {
    const x = this.left ? -1 : 0 + this.right ? 1 : 0
    const z = this.up ? -1 : 0 + this.down ? 1 : 0
    this.camera.position.x += x / 3
    this.camera.position.z += z / 3
    this.camera.translateZ(this.y / 3)
    // var direction = new THREE.Vector3();
    // this.camera.getWorldPosition( direction );
    // this.camera.position.add(direction.multiplyScalar(y))
  }
}