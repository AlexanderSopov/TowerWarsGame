import { Vector3 } from 'three'
import pisa from '/prefabs/towers/images/pisa.jpg'
import { subscribe } from '../utilities/EventBus'
import { SimpleTower } from '../prefabs/towers/SimpleTower'

export const TowerOptions = [
  {
    icon: pisa,
    description: 'Simple tower with medium range and medium damage.',
    cost: 60,
    costLabel: 'Buy',
    action: ['BuildSimpleTower']
  }
]
class TowerBuilders {
  i = 0
  constructor (scene, camera) {
    subscribe('BuildSimpleTower', () => {
      console.log('haaaaaiii', this.i)
      new SimpleTower(scene, camera, {
        basePosition: new Vector3(16 + this.i, 0, 0)
      })
      this.i += 8
    })
  }
  update () {}
}

export default TowerBuilders