import * as THREE from 'three'
import { BoxGeometry, CylinderGeometry, Mesh, MeshStandardMaterial, Object3D } from "three";
import { Tile, TILE_SIZE } from "../../tile-system";
import { store } from "../../store";
import { selectWorldTileStates, removeTile, selectAtPosition } from "../../store/worldSlice";
import { Position, TileState, PathFinder, NewPathFinder } from "../../components/TroopMovement";
import { TextureLoader } from "three";

const textureLoader = new TextureLoader();

export class TestEnemy extends Object3D {
  body;
  path: Position[] | null;
  pathFinder
  scene
  isDamaging: unknown
  textures = (async () => {
    const [
      diff,
      dis,
      metal,
      ao,
      rough,
      nor
    ] = await Promise.all([
        textureLoader.loadAsync("/textures/natural-bricks/DIFF.jpg").catch(err => {
          console.log("error loading", "/textures/natural-bricks/DIFF.jpg", err)
        }),
        textureLoader.loadAsync("/textures/natural-bricks/DIS.jpg").catch(err => {
          console.log("error loading", "/textures/natural-bricks/DIS.jpg", err)
        }),
        textureLoader.loadAsync("/textures/natural-bricks/AO.jpg").catch(err => {
          console.log("error loading", "/textures/natural-bricks/AO.jpg", err)
        }),
        textureLoader.loadAsync("/textures/natural-bricks/AO.jpg").catch(err => {
          console.log("error loading", "/textures/natural-bricks/AO.jpg", err)
        }),
        textureLoader.loadAsync("/textures/natural-bricks/ROUGH.jpg").catch(err => {
          console.log("error loading", "/textures/natural-bricks/ROUGH.jpg", err)
        }),
        textureLoader.loadAsync("/textures/natural-bricks/NORGL.jpg").catch(err => {
          console.log("error loading", "/textures/natural-bricks/NORGL.jpg", err)
        }),
    ])
    if (!diff || !nor || !dis || !metal || !rough || !ao) {
      throw new Error("Error loading texture!")
    }
    diff.colorSpace = THREE.SRGBColorSpace;
    diff.wrapS = THREE.RepeatWrapping;
    diff.wrapT = THREE.RepeatWrapping;
    diff.repeat.set(3, 3);
    nor.wrapS = THREE.RepeatWrapping;
    nor.wrapT = THREE.RepeatWrapping;
    nor.repeat.set(3, 3);
    dis.wrapS = THREE.RepeatWrapping;
    dis.wrapT = THREE.RepeatWrapping;
    dis.repeat.set(3, 3);
    metal.wrapS = THREE.RepeatWrapping;
    metal.wrapT = THREE.RepeatWrapping;
    metal.repeat.set(3, 3);
    rough.wrapS = THREE.RepeatWrapping;
    rough.wrapT = THREE.RepeatWrapping;
    rough.repeat.set(3, 3);
    return { diff, dis, metal, ao, rough, nor }
  })()

  constructor ( scene: { add: (obj: Object3D) => {} } ) {
    super()
    this.scene = scene
    this.body = new Mesh(
      new CylinderGeometry(TILE_SIZE * .5, TILE_SIZE * .5, TILE_SIZE * 2, 16),
      new MeshStandardMaterial( { color: "yellow" })
    )
    // this.children.push(this.body)
    this.body.position.setX(TILE_SIZE * 5)
    this.body.position.setY(TILE_SIZE)
    this.body.position.setZ(TILE_SIZE * 5)
    scene.add(this.body)
    // this.pathFinder = new TroopMovement()
    // this.pathFinder = new PathFinder()
    this.pathFinder = new NewPathFinder()
    this.path = null 

    // this.textures.then(({
    //   diff, dis, metal, ao, nor, rough
    // }) => {
    //   const testBall = new Mesh(
    //     new THREE.BoxGeometry( 15, 15, 15, 64, 64 ),
    //     new MeshStandardMaterial({
    //       map: diff,
    //       metalness: .8,
    //       // metalnessMap: metal,
    //       roughness: 1,
    //       roughnessMap: rough,
    //       normalMap: nor,
    //       normalScale: new THREE.Vector2(5, 5),
    //       // normalMapType: THREE.ObjectSpaceNormalMap,
    //       displacementMap: dis,
    //       displacementBias: -.125,
    //       displacementScale: .25,
    //       aoMap: ao,
    //       aoMapIntensity: 1,
    //     })
    //   )
    //   testBall.position.set(100, 30, 90)
    //   this.scene.add(
    //     testBall
    //   )
    // })
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
      return this.initiatePath()
    }

    // If the path is empty, the troop has reached the destination
    if (this.path.length === 0) {
        return;
    }
    if (this.nextTileIsDestructible()) {
      return this.damageNextTile()
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
  isAtPosition () {
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
  nextTileIsDestructible () {
    if (!this.path) return false
    const nextTile: Position = this.path[0]
    const objectAt = selectAtPosition(store.getState(), nextTile.x, nextTile.y)
    return objectAt && objectAt.tileState === "destructible"
  }
  damageNextTile () {
    if (this.isDamaging) return
    this.isDamaging = setTimeout(() => {
      if (!this.path) return
      // @ts-ignore
      store.dispatch(removeTile({
        x: this.path[0].x,
        y: this.path[0].y,
      }))
      this.isDamaging = null
    }, 5000)
  }
  initiatePath () {
    const world = selectWorldTileStates(store.getState())
    const cubes = store.getState().world.collisionCubes
    this.path = this.pathFinder.findPath(
        { x: 10, y: 10 },
        { x: 63, y: 115 },
        world
    );
    this.textures.then(textures => {
      const {
        diff,
        dis,
        metal,
        rough,
        nor
      } = textures 
      const red = new MeshStandardMaterial({
        color: 0xff0000
      })
      const black = new MeshStandardMaterial({
        map: diff,
        metalness: 1,
        metalnessMap: metal,
        roughness: 1,
        roughnessMap: rough,
        normalMap: nor,
        // displacementMap: dis,
        // displacementBias: -.25,
        // displacementScale: .5,
      })
      cubes.forEach((cube, i: number) => {
        const box = new BoxGeometry(
          TILE_SIZE * cube.w,
          TILE_SIZE * 2,
          TILE_SIZE * cube.h,
        )
        const tile = cube.owner.tileState
        switch(tile) {
          case "blocked":
            const block = new Mesh(
              box,
              black
            )
            block.position.setX((cube.x + (cube.w / 2)) * TILE_SIZE)
            block.position.setY(TILE_SIZE )
            block.position.setZ((cube.y + (cube.h / 2)) * TILE_SIZE)
            return this.scene.add(
              block
            )
          case "destructible":
            const building = new Mesh(
              box,
              red
            )
            building.position.setZ((cube.x + cube.w / 2) * TILE_SIZE)
            building.position.setY(TILE_SIZE )
            building.position.setX((cube.y + cube.h / 2) * TILE_SIZE)
            return this.scene.add(
              building
            )
          case "free":
          default:
            return
        }
      })
    })

  }
}

