export default class Tower {
  components = []
  character
  constructor () {
  }
  update () {
    this.components.forEach(c => c.update())
  }

  sell (price) {
    console.log('selling for price', price, this.character)
    this.character.removeFromParent()
  }
}