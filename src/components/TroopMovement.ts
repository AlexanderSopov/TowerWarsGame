// Define a Position type for x, y coordinates
export type Position = {
  x: number;
  y: number;
};

// Define possible tile states for type safety
export type TileState = 'free' | 'blocked' | 'destructible';

export class TroopMovement {
  grid: TileState[][]
  constructor() {
    this.grid = [[]]
  }

  /**
   * Finds the shortest path from start to goal based on the game rules.
   * @param start - Starting position of the troop
   * @param goal - Goal position to reach
   * @returns Array of positions representing the path, or null if no path exists
   */
  public findPath(start: Position, goal: Position, grid: TileState[][]): Position[] | null {
      this.grid = grid
      // Validate start and goal positions
      if (!this.isValidPosition(start) || !this.isValidPosition(goal)) {
          return null;
      }

      // Step 1: Try to find a path using only free tiles
      const pathFree = this.bfs(start, goal, (tile) => tile === 'free');
      if (pathFree) {
          return pathFree;
      }

      // Step 2: If no path exists with free tiles only, allow destructible tiles
      return this.bfs(start, goal, (tile) => tile === 'free' || tile === 'destructible');
  }

  /**
   * Breadth-First Search to find the shortest path from start to goal.
   * @param start - Starting position
   * @param goal - Goal position
   * @param canTraverse - Function determining if a tile can be traversed
   * @returns Path as an array of positions, or null if no path exists
   */
  private bfs(start: Position, goal: Position, canTraverse: (tile: TileState) => boolean): Position[] | null {
      const queue: Position[] = [start];
      const visited: Set<string> = new Set([`${start.x},${start.y}`]);
      const parent: Map<string, Position> = new Map(); // Maps position key to its parent position

      while (queue.length > 0) {
          const current = queue.shift()!;

          // If we've reached the goal, reconstruct and return the path
          if (current.x === goal.x && current.y === goal.y) {
              return this.reconstructPath(parent, current);
          }

          // Explore neighbors
          const neighbors = this.getNeighbors(current);
          for (const neighbor of neighbors) {
              const nKey = `${neighbor.x},${neighbor.y}`;
              if (!visited.has(nKey) && canTraverse(this.grid[neighbor.y][neighbor.x])) {
                  visited.add(nKey);
                  parent.set(nKey, current);
                  queue.push(neighbor);
              }
          }
      }

      // No path found
      return null;
  }
/**
 * Depth-First Search to find a path from start to goal.
 * @param start - Starting position
 * @param goal - Goal position
 * @param canTraverse - Function determining if a tile can be traversed
 * @returns Path as an array of positions, or null if no path exists
 */
private dfs(start: Position, goal: Position, canTraverse: (tile: TileState) => boolean): Position[] | null {
    const stack: Position[] = [start];
    const visited: Set<string> = new Set([`${start.x},${start.y}`]);
    const parent: Map<string, Position> = new Map(); // Maps position key to its parent position

    while (stack.length > 0) {
        const current = stack.pop()!;

        // If we've reached the goal, reconstruct and return the path
        if (current.x === goal.x && current.y === goal.y) {
            return this.reconstructPath(parent, current);
        }

        // Explore neighbors
        const neighbors = this.getNeighbors(current);
        for (const neighbor of neighbors) {
            const nKey = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(nKey) && canTraverse(this.grid[neighbor.y][neighbor.x])) {
                visited.add(nKey);
                parent.set(nKey, current);
                stack.push(neighbor);
            }
        }
    }

    // No path found
    return null;
}
  /**
   * Gets valid adjacent neighbors of a position.
   * @param pos - Current position
   * @returns Array of neighboring positions within grid bounds
   */
  private getNeighbors(pos: Position): Position[] {
      const { x, y } = pos;
      const candidates: Position[] = [
          { x: x + 1, y }, // Right
          { x: x - 1, y }, // Left
          { x, y: y + 1 }, // Down
          { x, y: y - 1 }, // Up
      ];

      return candidates.filter((p) => this.isValidPosition(p));
  }

  /**
   * Checks if a position is within grid bounds.
   * @param pos - Position to check
   * @returns True if position is valid, false otherwise
   */
  private isValidPosition(pos: Position): boolean {
      return (
          pos.x >= 0 &&
          pos.x < this.grid[0].length &&
          pos.y >= 0 &&
          pos.y < this.grid.length
      );
  }

  /**
   * Reconstructs the path from the parent map.
   * @param parent - Map of position keys to their parent positions
   * @param end - End position (goal)
   * @returns Array of positions from start to end
   */
  private reconstructPath(parent: Map<string, Position>, end: Position): Position[] {
      const path: Position[] = [];
      let current: Position | undefined = end;

      while (current) {
          path.unshift(current);
          const key = `${current.x},${current.y}`;
          current = parent.get(key);
      }

      return path;
  }
}


export class PathFinder {
    private grid: null | TileState[][] = null
    private height: null | number = null
    private width: null | number = null

    /**
     * Finds the shortest path from start to goal using BFS.
     * @param start - Starting position
     * @param goal - Goal position
     * @returns Array of positions from start to goal, or null if no path exists
     */
    public findPath(start: Position, goal: Position, world: TileState[][]): Position[] | null {
        this.grid = world
        this.height = world.length;
        this.width = world[0].length;
        // Check if start and goal are valid
        if (!this.isValidPosition(start) || !this.isValidPosition(goal)) {
            return null;
        }
        if (!this.canTraverse(start) || !this.canTraverse(goal)) {
            return null;
        }

        const queue: Position[] = [start];
        const visited: Set<string> = new Set([`${start.x},${start.y}`]);
        const parent: Map<string, Position> = new Map(); // Tracks the path

        while (queue.length > 0) {
            const current = queue.shift()!;

            // Reached the goal, reconstruct the path
            if (current.x === goal.x && current.y === goal.y) {
                return this.reconstructPath(parent, current);
            }

            // Explore all neighbors (including diagonals)
            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                const key = `${neighbor.x},${neighbor.y}`;
                if (!visited.has(key) && this.canTraverse(neighbor)) {
                    visited.add(key);
                    parent.set(key, current);
                    queue.push(neighbor);
                }
            }
        }

        // No path found
        return null;
    }

    /**
     * Gets all valid neighboring positions, including diagonals.
     * @param pos - Current position
     * @returns Array of neighboring positions
     */
    private getNeighbors(pos: Position): Position[] {
        const { x, y } = pos;
        const candidates: Position[] = [
            { x: x + 1, y },      // Right
            { x: x - 1, y },      // Left
            { x, y: y + 1 },      // Down
            { x, y: y - 1 },      // Up
            { x: x + 1, y: y + 1 }, // Down-Right
            { x: x + 1, y: y - 1 }, // Up-Right
            { x: x - 1, y: y + 1 }, // Down-Left
            { x: x - 1, y: y - 1 }  // Up-Left
        ];

        return candidates.filter((p) => this.isValidPosition(p));
    }

    /**
     * Checks if a position is within grid bounds.
     * @param pos - Position to check
     * @returns True if valid, false otherwise
     */
    private isValidPosition(pos: Position): boolean {
        return (
            pos.x >= 0 &&
            pos.x < this.width &&
            pos.y >= 0 &&
            pos.y < this.height
        );
    }

    /**
     * Checks if a position is traversable.
     * @param pos - Position to check
     * @returns True if traversable, false otherwise
     */
    private canTraverse(pos: Position): boolean {
        return !!this.grid && this.grid[pos.y][pos.x] !== "blocked";
    }

    /**
     * Reconstructs the path from the parent map.
     * @param parent - Map of position keys to their parents
     * @param end - Goal position
     * @returns Array of positions from start to end
     */
    private reconstructPath(parent: Map<string, Position>, end: Position): Position[] {
        const path: Position[] = [];
        let current: Position | undefined = end;

        while (current) {
            path.push(current);
            const key = `${current.x},${current.y}`;
            current = parent.get(key);
        }

        return path.reverse(); // Start to end
    }
}

export class NewPathFinder {

    // Find the shortest path from start to goal
    findPath(start: Position, goal: Position, tileStates: TileState[][]) {
        // Queue for BFS: stores positions and the path taken to reach them
        const queue: {pos: Position, path: Position[]}[] = [{ pos: start, path: [start] }];
        // Track visited tiles to avoid cycles
        const visited = new Set();
        visited.add(`${start.x},${start.y}`);

        // Possible movements: right, left, down, up (no diagonals)
        const directions = [
            { dx: 1, dy: 0 },  // right
            { dx: -1, dy: 0 }, // left
            { dx: 0, dy: 1 },  // down
            { dx: 0, dy: -1 }, // up
        ];

        while (queue.length > 0) {
            const { pos, path } = queue.shift();
            const { x, y } = pos;

            // If we've reached the goal, return the path
            if (x === goal.x && y === goal.y) {
                return path;
            }

            // Explore neighbors
            for (const { dx, dy } of directions) {
                const newX = x + dx;
                const newY = y + dy;
                const newPos = { x: newX, y: newY };
                const posKey = `${newX},${newY}`;

                // Check if the position is valid and traversable
                if (this.canTraverse(newX, newY, tileStates) && !visited.has(posKey)) {
                    visited.add(posKey);
                    queue.push({ pos: newPos, path: [...path, newPos] });
                }
            }
        }

        // No path found
        return null;
    }

    // Determine if a tile can be traversed
    canTraverse(x: number, y: number, tileStates: TileState[][]) {
        const tile = tileStates[y]?.[x];
        // Assume tileStates[y][x] returns 'free', 'blocked', or 'destructible'
        // Only 'free' tiles are traversable for simplicity
        return tile === 'free';
    }
}