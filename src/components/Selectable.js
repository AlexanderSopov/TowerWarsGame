import { store } from "/store"
import { setCommandPanelData } from '/store/CommandPanelSlice'

class Selectable {
  character
  cube
  isSelected = false
  mousePointer = {}
  color
  cpData

  constructor (character, cube, defaultColor, cpData) {
    this.character = character
    this.cube = cube
    this.color = defaultColor
    character.mouseSelectable = true
    this.cpData = cpData
    store.subscribe(() => {
      const { mousePointer } = store.getState()
      this.mousePointer = mousePointer
    })
  }

  setSelectable () {
    const { intersects } = this.mousePointer
    if (
      intersects
      && intersects.id == this.cube.id
    ) {
      this.cube.material.color.set( 0x0000ff );
      document.body.style.cursor = 'pointer';
      this.isSelectable = true
    } else if (this.isSelectable) {
      document.body.style.cursor = 'default';
      this.cube.material.color.set( this.color );
      this.isSelectable = false
    }
  }

  setSelected () {
    const { selected } = this.mousePointer
    if (
      !this.isSelected
      && selected
      && selected.id == this.cube.id
    ) {
      this.cube.material.color.set( 0xffa000 );
      store.dispatch(setCommandPanelData(this.cpData))
      this.isSelected = true
    } else if (
      this.isSelected
      && (!selected || selected.id !== this.cube.id)
    ) {
      this.isSelected = false
      this.cube.material.color.set( this.color );
    }
  }

  update () {
    if (!this.isSelected)
      this.setSelectable()
    this.setSelected()
  }


}

export default Selectable