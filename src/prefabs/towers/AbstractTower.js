import { Object3D, FrontSide, PlaneGeometry, MeshBasicMaterial, Mesh } from "three"
import { removeSceneSubject } from "../../scene-manager"
import { roundToTile, Tile, TILE_SIZE } from "../../tile-system"
import { store } from "../../store"
import { addTile, removeTile } from "../../store/worldSlice"

export const buildstate = {
  PLACEABLE: 'transparent'
}

const placeStates = [
  'placeable',
  'initBuild',
  'building',
  'placed'
]

export default class AbstractTower extends Object3D {
  components = []
  placeState = 0
  tileWidth
  tileHeight

  constructor (baseSize, opts) {
    super()

    if (opts && opts.helpers) {
      this.add( this.createPlaneGeo() );
    }
    const { tileWidth, tileHeight } = baseSize
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight
    // this.position.y = tileHeight + 1
    const geometry = new PlaneGeometry( tileWidth * TILE_SIZE, tileHeight * TILE_SIZE );
    const material = new MeshBasicMaterial( {color: 0xff0000, side: FrontSide} );
    const plane = new Mesh( geometry, material );
    plane.position.y = 0
    plane.rotation.x = -Math.PI/2
    this.add( plane );
  }

  update () {
    this.components.forEach(c => c.update())
    if (this.placeState < 2) {
      this.addTiles()
    }
  }

  addTiles () {
    const x = roundToTile(this.position.x) / TILE_SIZE
    const z = roundToTile(this.position.z) / TILE_SIZE
    for (let i = 0; i < this.tileWidth; i++)
      for (let j = 0; j < this.tileHeight; j++)
        store.dispatch(addTile({
          x: z - Math.ceil(this.tileWidth / 2) + j,
          y: x - Math.ceil(this.tileHeight / 2) + i,
          tile: (new Tile("destructible")).serialize()
        }));
    this.placeState = 3
  }
  removeTiles () {
    const x = roundToTile(this.position.x) / TILE_SIZE
    const z = roundToTile(this.position.z) / TILE_SIZE
    for (let i = 0; i < this.tileWidth; i++)
      for (let j = 0; j < this.tileHeight; j++)
        store.dispatch(removeTile({
          x: z - Math.ceil(this.tileWidth / 2) + j,
          y: x - Math.ceil(this.tileHeight / 2) + i,
        }));
    this.placeState = 3
  }

  sell (price) {
    removeSceneSubject(this)
    this.removeTiles()
    this.removeFromParent()
  }

  createPlaneGeo () {
    return null
  }
}