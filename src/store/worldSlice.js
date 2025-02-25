import { createSlice, createSelector } from '@reduxjs/toolkit'
import { Tile, WORLD_WIDTH, WORLD_HEIGHT } from '../tile-system';


// Initialize the game world with empty tiles
const emptyWorld = () => {
  const world = []
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    world[y] = [];
    for (let x = 0; x < WORLD_WIDTH; x++) {
        world[y][x] = (new Tile('free')).serialize();
    }
  }
  world[100][100] = new Tile("blocked").serialize()
  // Set up buildings
  return world
}

// const mazeWorld = () => {
//   const ROOM_SIZE = 5;
//   const BLOCK_SIZE = 3;
//   const ROOMS_X = WORLD_WIDTH / ROOM_SIZE;
//   const ROOMS_Y = WORLD_HEIGHT / ROOM_SIZE;

//   const worldTypes = Array(WORLD_HEIGHT).fill(null).map(() =>
//     Array(WORLD_WIDTH).fill('free')
//   );

//   // Place blocking objects
//   for (let ry = 0; ry < ROOMS_Y; ry++) {
//     for (let rx = 0; rx < ROOMS_X; rx++) {
//       const startX = rx * ROOM_SIZE;
//       const startY = ry * ROOM_SIZE;
//       const blockStartX = startX + 1;
//       const blockStartY = startY + 1;
//       const blockType = Math.random() < 0.5 ? 'blocked' : 'destructible';
//       for (let dy = 0; dy < BLOCK_SIZE; dy++) {
//         for (let dx = 0; dx < BLOCK_SIZE; dx++) {
//           worldTypes[blockStartY + dy][blockStartX + dx] = blockType;
//         }
//       }
//     }
//   }

//   // Generate maze on coarse grid
//   const visited = Array(ROOMS_Y).fill(null).map(() => 
//     Array(ROOMS_X).fill(false)
//   );
//   const directions = [
//     [0, 1], [1, 0], [0, -1], [-1, 0]
//   ];
//   const stack = [[0, 0]];
//   visited[0][0] = true;

//   while (stack.length > 0) {
//     const [ry, rx] = stack[stack.length - 1];
//     const neighbors = [];
//     for (const [dy, dx] of directions) {
//       const newRy = ry + dy;
//       const newRx = rx + dx;
//       if (
//         newRy >= 0 && newRy < ROOMS_Y &&
//         newRx >= 0 && newRx < ROOMS_X &&
//         !visited[newRy][newRx]
//       ) {
//         neighbors.push([newRy, newRx]);
//       }
//     }

//     if (neighbors.length === 0) {
//       stack.pop();
//       continue;
//     }

//     const [nextRy, nextRx] = neighbors[Math.floor(Math.random() * neighbors.length)];
//     visited[nextRy][nextRx] = true;
//     stack.push([nextRy, nextRx]);

//     const startX1 = rx * ROOM_SIZE;
//     const startY1 = ry * ROOM_SIZE;
//     const startX2 = nextRx * ROOM_SIZE;
//     const startY2 = nextRy * ROOM_SIZE;

//     if (nextRx === rx + 1) {
//       const connectX = startX1 + ROOM_SIZE - 1;
//       const connectY = startY1 + 2;
//       worldTypes[connectY][connectX] = 'free';
//     } else if (nextRx === rx - 1) {
//       const connectX = startX1;
//       const connectY = startY1 + 2;
//       worldTypes[connectY][connectX] = 'free';
//     } else if (nextRy === ry + 1) {
//       const connectX = startX1 + 2;
//       const connectY = startY1 + ROOM_SIZE - 1;
//       worldTypes[connectY][connectX] = 'free';
//     } else if (nextRy === ry - 1) {
//       const connectX = startX1 + 2;
//       const connectY = startY1;
//       worldTypes[connectY][connectX] = 'free';
//     }
//   }

//   const world = worldTypes.map(row =>
//     row.map(type => (new Tile(type)).serialize())
//   );

//   return world;
// };

// Initialize the game world as a labyrinth leading to the middle
const mazeWorld = () => {
  // Step 1: Create a 2D array of tile types, all initially 'blocked'
  const worldTypes = Array(WORLD_HEIGHT).fill(null).map(() => 
    Array(WORLD_WIDTH).fill('blocked')
  );

  // Step 2: Define the center of the map and set it as 'free'
  const centerX = Math.floor(WORLD_WIDTH / 2);
  const centerY = Math.floor(WORLD_HEIGHT / 2);
  worldTypes[centerY][centerX] = 'free';

  // Step 3: Define possible movement directions (up, right, down, left)
  const directions = [
    [0, -1],  // up
    [1, 0],   // right
    [0, 1],   // down
    [-1, 0]   // left
  ];

  // Step 4: Iterative maze carving using a stack
  const stack = [[centerX, centerY]];

  while (stack.length > 0) {
    const [x, y] = stack.pop();

    // Get unvisited neighbors (two steps away)
    const neighbors = directions
      .map(([dx, dy]) => [x + dx * 2, y + dy * 2])
      .filter(([nx, ny]) => 
        nx >= 0 && nx < WORLD_WIDTH &&
        ny >= 0 && ny < WORLD_HEIGHT &&
        worldTypes[ny][nx] === 'blocked'
      );

    if (neighbors.length > 0) {
      // Shuffle neighbors to randomize path
      const shuffledNeighbors = neighbors.sort(() => Math.random() - 0.5);
      const [nx, ny] = shuffledNeighbors[0];

      // Carve the path: set the intermediate cell and the new cell to 'free'
      const mx = x + (nx - x) / 2;
      const my = y + (ny - y) / 2;
      worldTypes[my][mx] = 'free';
      worldTypes[ny][nx] = 'free';

      // Push current cell back to explore other directions later
      stack.push([x, y]);
      // Push new cell to explore its neighbors
      stack.push([nx, ny]);
    }
  }

  // Step 5: Replace some 'blocked' tiles with 'destructible' ones
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    for (let x = 0; x < WORLD_WIDTH; x++) {
      if (worldTypes[y][x] === 'blocked') {
        // Check if the tile is adjacent to a 'free' tile
        const neighbors = [
          [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
        ].filter(([nx, ny]) => 
          nx >= 0 && nx < WORLD_WIDTH && ny >= 0 && ny < WORLD_HEIGHT
        );
        const isAdjacentToFree = neighbors.some(([nx, ny]) => 
          worldTypes[ny][nx] === 'free'
        );
        // 20% chance to make a 'blocked' tile 'destructible' if next to a path
        if (isAdjacentToFree && Math.random() < 0.2) {
          worldTypes[y][x] = 'destructible';
        }
      }
    }
  }

  // Step 6: Convert the worldTypes array to serialized Tile objects
  const world = worldTypes.map(row => 
    row.map(type => (new Tile(type)).serialize())
  );
  for(let x = 0; x < 10; x++)
    for(let y = 0; y < 10; y++) {
      world[5+x][5+y] = new Tile("free").serialize()
      world[95+x][95+y] = new Tile("free").serialize()
    }
  // Return the initialized world
  return world;
};
// const mazeWorld = () => {
//   // Step 1: Create a 2D array of tile types, all initially 'blocked'
//   const worldTypes = Array(WORLD_HEIGHT).fill(null).map(() => 
//     Array(WORLD_WIDTH).fill('blocked')
//   );

//   // Step 2: Define the center of the map and set it as 'free'
//   const centerX = Math.floor(WORLD_WIDTH / 2);
//   const centerY = Math.floor(WORLD_HEIGHT / 2);
//   worldTypes[centerY][centerX] = 'free';

//   // Step 3: Define possible movement directions (up, right, down, left)
//   const directions = [
//     [0, -1],  // up
//     [1, 0],   // right
//     [0, 1],   // down
//     [-1, 0]   // left
//   ];

//   // Step 4: Recursive function to carve the maze
//   const carveMaze = (x, y) => {
//     // Randomly shuffle directions for varied maze patterns
//     const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

//     for (const [dx, dy] of shuffledDirs) {
//       // Move two steps in the direction to leave walls between paths
//       const nx = x + dx * 2;
//       const ny = y + dy * 2;

//       // Check if the new position is within bounds and unvisited ('blocked')
//       if (
//         nx >= 0 && nx < WORLD_WIDTH &&
//         ny >= 0 && ny < WORLD_HEIGHT &&
//         worldTypes[ny][nx] === 'blocked'
//       ) {
//         // Carve the path: set the intermediate cell and the new cell to 'free'
//         worldTypes[y + dy][x + dx] = 'free';
//         worldTypes[ny][nx] = 'free';
//         // Recurse to continue carving from the new position
//         carveMaze(nx, ny);
//       }
//     }
//   };

//   // Start carving the maze from the center
//   carveMaze(centerX, centerY);

//   // Step 5: Replace some 'blocked' tiles with 'destructible' ones
//   for (let y = 0; y < WORLD_HEIGHT; y++) {
//     for (let x = 0; x < WORLD_WIDTH; x++) {
//       if (worldTypes[y][x] === 'blocked') {
//         // Check if the tile is adjacent to a 'free' tile
//         const neighbors = [
//           [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]
//         ].filter(([nx, ny]) => 
//           nx >= 0 && nx < WORLD_WIDTH && ny >= 0 && ny < WORLD_HEIGHT
//         );
//         const isAdjacentToFree = neighbors.some(([nx, ny]) => 
//           worldTypes[ny][nx] === 'free'
//         );
//         // 20% chance to make a 'blocked' tile 'destructible' if next to a path
//         if (isAdjacentToFree && Math.random() < 0.2) {
//           worldTypes[y][x] = 'destructible';
//         }
//       }
//     }
//   }

//   // Step 6: Convert the worldTypes array to serialized Tile objects
//   const world = worldTypes.map(row => 
//     row.map(type => (new Tile(type)).serialize())
//   );

//   // Return the initialized world
//   return world;
// };

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

