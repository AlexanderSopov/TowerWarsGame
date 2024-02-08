import { subscribe, publish } from "../utilities/EventBus"

export default class MenuManager {
  container
  state = {}

  constructor () {
    this.container = document.getElementById("menu-container")
    this.container.addEventListener('click', evt => {
      evt.stopPropagation();
      return false;
    })
    subscribe('mouseSelect', this.threeSelect)
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

  threeSelect = (selected) => {
    this.state.selected = selected
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
      const _publish = publish
      return function () {
        _publish('refreshMouseState')
      }
    })()
    return '_removeSelect()'
  }

  render (state) {
    return `<div class="menu__window">
      ${this.title(state.selected)}
    </div>`
  }
  title = (selected) => `<h1 onclick="${this.removeSelect()}">${selected ? selected.object.parent.id: "Standard"}</h1>`
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
