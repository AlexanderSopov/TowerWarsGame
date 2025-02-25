// Define a Position type for x, y coordinates
export type Position = {
  x: number;
  y: number;
};

// Define possible tile states for type safety
type TileState = 'free' | 'blocked' | 'destructible';

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
