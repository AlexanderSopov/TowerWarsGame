export default class Tower {
  components = []
  constructor () {
  }
  update () {
    this.components.forEach(c => c.update())
  }
}