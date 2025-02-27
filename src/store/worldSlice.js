import { createSlice, createSelector } from '@reduxjs/toolkit'
import { Tile } from '../tile-system';
import { mazeWorld } from '../components/world-initializer';



const worldSlice = createSlice({
  name: 'world',
  initialState: mazeWorld(),
  reducers: {
    addTile (state, action) {
      const { x, y, tile } = action.payload
      state[x][y] = tile
    },
    removeTile (state, action) {
      const { x, y } = action.payload
      state[x][y] = (new Tile('free')).serialize();
    },
    refreshWorld (state) {
      return emptyWorld()
    }
  }
})

// Middleware to handle serialization and deserialization
export const tileSerializationMiddleware = store => next => action => {
  // Before dispatching action, serialize state
  const serializedState = serializeState(store.getState());

  // Call the next middleware in the chain
  const result = next(action);

  // After state update, deserialize state
  const deserializedState = deserializeState(store.getState());

  // Return the result of the action
  return result;
};

// Function to serialize state
function serializeState(state) {
  // Serialize tiles in the state
  const serializedTiles = state.world.map(row => row.map(tile => tile.serialize ? tile.serialize() : tile));
  return { ...state, world: serializedTiles };
}

// Function to deserialize state
function deserializeState(state) {
  // Deserialize tiles in the state
  const deserializedTiles = state.world.map(row => row.map(tileData => Tile.deserialize(tileData)));
  return { ...state, world: deserializedTiles };
}

// Selectors
export const selectWorld = (state) => state.world

export const selectWorldTileStates = createSelector(
  selectWorld,
  (world) => world.map(row => row.map(tile => tile.state))
)


export const { addTile, removeTile, refreshWorld } = worldSlice.actions
export default worldSlice.reducer

