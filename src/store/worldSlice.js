import { createSlice, createSelector } from '@reduxjs/toolkit'
import { Tile, WORLD_HEIGHT, WORLD_WIDTH } from '../tile-system';
import { mazeWorld, mapOneAsCubes, createBlock } from '../components/world-initializer';

const reducers = {
  // addTile (state, action) {
  //   const { x, y, tile } = action.payload
  //   state.tiles[x][y] = tile
  // },
  // removeTile (state, action) {
  //   const { x, y } = action.payload
  //   state.tiles[x][y] = (new Tile('free')).serialize();
  // },
  addCollisionCube (state, action) {
    const { x, y, z, w, h, d, owner } = action.payload
    if (!x || !y || !z || !w || !d || !h) {
      return
    }
    // createBlock(state.tiles, owner.tileState, h, w, x, y)
    state.collisionCubes.push({x, y, z, w, h, d, owner})
  },
  refreshWorld (state) {
    return emptyWorld()
  }
}

const worldSlice = createSlice({
  name: 'world',
  initialState: mapOneAsCubes(),
  reducers
})

// Middleware to handle serialization and deserialization
export const tileSerializationMiddleware = store => next => action => {
  // // Before dispatching action, serialize state
  // const serializedState = serializeState(store.getState());

  // // Call the next middleware in the chain
  // const result = next(action);

  // // After state update, deserialize state
  // const deserializedState = deserializeState(store.getState());

  // // Return the result of the action
  // return result;
};

// Function to serialize state
function serializeState(state) {
  // Serialize tiles in the state
  const serializedTiles = state.world.tiles.map(row => row.map(tile => tile.serialize ? tile.serialize() : tile));
  return { ...state, world: serializedTiles };
}

// Function to deserialize state
function deserializeState(state) {
  // Deserialize tiles in the state
  const deserializedTiles = state.world.tiles.map(row => row.map(tileData => Tile.deserialize(tileData)));
  return { ...state, world: deserializedTiles };
}

const freeWorld = new Array(WORLD_HEIGHT).fill(null).map(_ => new Array(WORLD_WIDTH).fill("free"))

// Selectors
export const selectWorld = (state) => state.world
export const selectWorldTileStates = createSelector(
  selectWorld,
  (world) => world.collisionCubes.reduce(
    (tiles, collisionCube) => {
      const { x, y, h, w, owner } = collisionCube
      for (let i = x; i < x+w; i++) {
        for (let j = y; j < y+h; j++) {
          tiles[j][i] = owner.tileState
        }
      }
      return tiles
    },
    freeWorld
  )
)

// export const selectIsTileFree = (state, x, y) => {
//   const tile = state.world.tiles[x]?.[y];
//   return tile && tile.type === 'free'; // Adjust based on your tile structure
// };

export const selectAtPosition = (state, xpos, ypos) => state.world.collisionCubes
  .find(
    ({ x, y, w, h }) => isWithinRectangle(x, y, w,h,xpos,ypos)
  )?.owner

export const selectIsPosFree = (state, xpos, ypos) => !!selectAtPosition(state, xpos, ypos)


const isWithinRectangle = (x,y,w,h,xpos,ypos) => {
  const withinXAxis = x <= xpos && xpos <= x+w
  const withinYAxis = y <= ypos && ypos <= y+h
  return withinXAxis && withinYAxis
  }

export const { addTile, removeTile, refreshWorld } = worldSlice.actions
export default worldSlice.reducer

