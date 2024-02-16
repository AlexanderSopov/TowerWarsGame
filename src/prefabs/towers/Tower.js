import { Object3D } from "three"
import { removeSceneSubject } from "../../scene-manager"

export const buildstate = {
  PLACEABLE: 'transparent'
}

export default class Tower extends Object3D {
  components = []

  update () {
    this.components.forEach(c => c.update())
  }

  sell (price) {
    removeSceneSubject(this)
    this.removeFromParent()
  }
}