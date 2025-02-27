export const TILE_SIZE = 1.25
export const WORLD_WIDTH = 125;
export const WORLD_HEIGHT = 125;

export const roundToTile = (x: number) => Math.round(x / TILE_SIZE) * TILE_SIZE

type TileState = 'free' | 'blocked' | 'destructible';

export class Tile {
  state: TileState
  unitIds: string[] | null | undefined

  constructor(state: TileState, unitIds?: string[]) {
      this.state = state
      this.unitIds = unitIds
  }
  serialize = () => {
    return {
        state: this.state,
        unitIds: this.unitIds,
    };
  }

  // Static deserialization method
  static deserialize(data: { state: TileState, unitIds: string[] }) {
      return new Tile(data.state, data.unitIds);
  }
}
