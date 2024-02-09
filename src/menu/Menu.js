import { store } from '/store'
import { refreshState } from "../store/mousePointer/Slice"

export default class MenuManager {
  container
  state = {}

  constructor () {
    this.container = document.getElementById("menu-container")
    this.container.addEventListener('click', evt => {
      evt.stopPropagation();
      return false;
    })
    store.subscribe(this.threeSelect)
    this.menuWindow = new MenuWindow()
    this.menuStats = new MenuStats()
    this.menuOptions = new MenuOptions()
    this.render()
  }

  render () {
    const state = this.state
    this.container.innerHTML = `
      ${this.menuWindow.render(state)}
      ${this.menuStats.render(state)}
      ${this.menuOptions.render(state)}
    `
  }

  threeSelect = () => {
    const { mousePointer } = store.getState()
    console.log('selected', mousePointer.selected)
    this.state.selected = mousePointer.selected
    this.render()
  }
}


class MenuWindow {
  state
  constructor (state) {
    this.state = state
  }


  removeSelect = () => {
    window._removeSelect = (function () {
      const _publish = function () {
        store.dispatch(refreshState())
      }
      return function () {
        _publish()
      }
    })()
    return '_removeSelect()'
  }

  render (state) {
    return `<div class="menu__window">
      ${this.title(state.selected)}
    </div>`
  }
  title = (selected) => `<h1 onclick="${this.removeSelect()}">${selected ? selected.id: "Standard"}</h1>`
  // title = (selected) => `<h1>${"Standard"}</h1>`
}
class MenuStats {
  render (state) {
    return `<div class="menu__stats"></div>`
  }
}
class MenuOptions {
  render (state) {
    return `<div class="menu__options"></div>`
  }
}
