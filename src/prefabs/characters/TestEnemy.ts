import { BoxGeometry, CylinderGeometry, Mesh, MeshStandardMaterial, Object3D } from "three";
import { TILE_SIZE } from "../../tile-system";
import { store } from "../../store";
import { selectWorldTileStates } from "../../store/worldSlice";
import { Position, TileState, TroopMovement } from "../../components/TroopMovement";

export class TestEnemy extends Object3D {
  body;
  path: Position[] | null;
  pathFinder
  scene

  constructor ( scene: { add: (obj: Object3D) => {} } ) {
    super()
    this.scene = scene
    this.body = new Mesh(
      new CylinderGeometry(TILE_SIZE * .5, TILE_SIZE * .5, TILE_SIZE * 6, 16),
      new MeshStandardMaterial( { color: "yellow" })
    )
    // this.children.push(this.body)
    this.body.position.setX(TILE_SIZE * 5)
    this.body.position.setZ(TILE_SIZE * 5)
    scene.add(this.body)
    this.pathFinder = new TroopMovement()
    this.path = null 
  }

  // update () {
  //   if (!this.path) {
  //     this.path = this.pathFinder.findPath(
  //       {
  //         x: 10,
  //         y: 10
  //       },
  //       {
  //         x: 100,
  //         y: 100
  //       },
  //       selectWorldTileStates(store.getState())
  //     )
  //     return
  //   }
  //   if (this.isAtPosition()) {
  //     this.path.shift()
  //   }
  //   const nextX = this.path[0].x * TILE_SIZE
  //   const nextY = this.path[0].y * TILE_SIZE
  //   const moveXBy = Math.sign(nextX - this.body.position.x) * TILE_SIZE;
  //   const moveZBy = Math.sign(nextY - this.body.position.z) * TILE_SIZE;
  //   // console.log("moveXBy", moveXBy)
  //   this.body.position.x += moveXBy * 0.01
  //   this.body.position.z += moveZBy * 0.01
  //   // this.body.position.z = Math.abs(this.body.position.z % TILE_SIZE) < 0.01 ? this.body.position.z - this.body.position.z % TILE_SIZE : this.body.position.z
  //   // this.body.position.x = Math.abs(this.body.position.x % TILE_SIZE) < 0.01 ? this.body.position.x - this.body.position.x % TILE_SIZE : this.body.position.x
  // }
  // isAtPosition () {
  //   if (!this.path) return false
  //   const atX = this.body.position.x / TILE_SIZE - this.path[0].x
  //   const atY = this.body.position.z / TILE_SIZE - this.path[0].y
  //   // console.log("are we at", atX, atY)
  //   return atX && atY
  // }
  update(delta: number) {
    // Initialize the path if it doesn’t exist
    if (!this.path) {
      const world = selectWorldTileStates(store.getState())
      this.path = this.pathFinder.findPath(
          { x: 10, y: 10 },
          { x: 100, y: 100 },
          world
      );

      world.forEach((tiles: TileState[], i: number) => {
        tiles.forEach((tile: TileState, j) => {
          const red = new MeshStandardMaterial({
            color: 0xff0000
          })
          const black = new MeshStandardMaterial({
            color: 0x000000
          })
          const box = new BoxGeometry(
            TILE_SIZE,
            TILE_SIZE * 2,
            TILE_SIZE,
          )
          switch(tile) {
            case "blocked":
              const block = new Mesh(
                box,
                black
              )
              block.position.setX(j * TILE_SIZE)
              block.position.setZ(i * TILE_SIZE)
              return this.scene.add(
                block
              )
            case "destructible":
              const building = new Mesh(
                box,
                red
              )
              building.position.setX(i * TILE_SIZE)
              building.position.setZ(j * TILE_SIZE)
              return this.scene.add(
                building
              )
            case "free":
            default:
              return
          }
        })
      })

      return;
    }

    // If the path is empty, the troop has reached the destination
    if (this.path.length === 0) {
        console.log("REACHED GOAL!")
        return;
    }

    // Calculate the target position in world coordinates
    const targetX = this.path[0].x * TILE_SIZE;
    const targetZ = this.path[0].y * TILE_SIZE;

    // Compute the distance to the target
    const dx = targetX - this.body.position.x;
    const dz = targetZ - this.body.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    // Define a small threshold to determine if we’re "close enough"
    const epsilon = 0.1; // Adjust this value based on your needs

    if (distance < epsilon) {
        // Snap to the exact target position
        this.body.position.x = targetX;
        this.body.position.z = targetZ;
        // Move to the next tile in the path
        this.path.shift();
    } else {
        // Define movement speed: 1 TILE_SIZE per second
        const speed = TILE_SIZE * 5; // units per second
        const moveDistance = speed * delta; // Distance to move this frame

        // Calculate the direction to the target
        const directionX = dx / distance; // Normalize the x component
        const directionZ = dz / distance; // Normalize the z component

        // Update the position
        this.body.position.x += directionX * moveDistance;
        this.body.position.z += directionZ * moveDistance;
    }
}

// Optional: Updated isAtPosition (if you still need it elsewhere)
isAtPosition() {
    if (!this.path || this.path.length === 0) return false;

    const targetX = this.path[0].x * TILE_SIZE;
    const targetZ = this.path[0].y * TILE_SIZE;
    
    // Check if within a small distance of the target
    const dx = targetX - this.body.position.x;
    const dz = targetZ - this.body.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const epsilon = 0.1; // Same threshold as in update

    return distance < epsilon;
}
}

