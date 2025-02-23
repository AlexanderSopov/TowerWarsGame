export const TILE_SIZE = 1.25
export const WORLD_WIDTH = 200;
export const WORLD_HEIGHT = 200;

export const roundToTile = x => Math.round(x / TILE_SIZE) * TILE_SIZE

export class Tile {
  constructor(type, passable, unitIds) {
      this.type = type // Type of tile (e.g., 'empty', 'obstacle', 'building', 'path')
      this.passable = passable
      this.unitIds = unitIds
  }
  serialize = () => {
    return {
        type: this.type,
        passable: this.passable,
        unitIds: this.unitIds,
    };
  }

  // Static deserialization method
  static deserialize(data) {
      return new Tile(data.type, data.passable, data.unitIds);
  }
}