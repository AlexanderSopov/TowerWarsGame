import { store } from "../store"
import { refreshState } from "../store/mousePointer/Slice"

export class KeyboardControls {
  zoomMin = 5
  zoomMax = 60
  camera
  up = false
  down = false
  left = false
  right = false
  y = 0
  stopZoomingTimeout
  zoomSlowing = false

  constructor (camera) {
    this.camera = camera
    window.addEventListener('wheel', this.handleMouseScroll)
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
    this.camera.position.x += x
    this.camera.position.z += z
    this.camera.translateZ(this.y / 2)
    this.camera.position.y += this.y / 2
    if (this.y !== 0)
      this.handleZoom()
      this.handleRotation()
  }

  handleZoom () {
    if (this.camAtBottom()) {
      this.y = 0
      this.camera.position.y = this.zoomMin
    }
    if (this.camAtTop()) {
      this.y = 0
      this.camera.position.y = this.zoomMax
    }
    if (this.zoomSlowing)
      this.zoomSlowDown()
  }

  handleMouseScroll = (evt) => {
    if (
      (evt.deltaY < 0 && this.camAtBottom()) ||
      (evt.deltaY > 0 && this.camAtTop())
    ) {
      return
    }
    this.y = evt.deltaY / 200
    clearTimeout(this.stopZoomingTimeout)
    this.stopZoomingTimeout = setTimeout(() => this.zoomSlowing = true, 125)
  }

  zoomSlowDown = () => {
    if (Math.abs(this.y) < 0.1 || this.camAtBottom() || this.camAtTop()) {
      this.y = 0
      this.zoomSlowing = false
      return
    }
    this.y = this.y < 0 ? this.y + 0.1 : this.y - 0.1
  }

  camAtBottom = () => {
    return this.camera.position.y <= this.zoomMin
  }

  camAtTop = () => {
    return this.camera.position.y >= this.zoomMax
  }

  handleRotation = () => {
    const yPos = this.camera.position.y
    const ySpan = this.zoomMax - this.zoomMin
    const threshold = this.zoomMax - ySpan / 4
    const zoomSpan = threshold - this.zoomMin
    if (threshold < yPos)
      return
    this.camera.rotation.x = -.25
    this.camera.rotation.x = -.85
    const zoom = yPos - this.zoomMin
    const percentage = zoom / zoomSpan
    const rotation = .5 * percentage
    this.camera.rotation.x = -.25 - rotation
  }
}