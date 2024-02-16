import { Vector3 } from 'three'
import pisa from '/prefabs/towers/images/pisa.jpg'
import { subscribe, publish } from '../utilities/EventBus'
import { SimpleTower } from '../prefabs/towers/SimpleTower'
import { buildstate } from '../prefabs/towers/Tower'
import { addSceneSubject } from '../scene-manager'

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
      publish(
        'PlaceObject',
        new SimpleTower(scene, camera, {
          basePosition: new Vector3(16 + this.i, 0, 0),
          status: buildstate.PLACEABLE
        })
      )
    })
    subscribe('ConstructObject', (tower) => {
      addSceneSubject(tower)
    })
  }
  update () {}
}

export default TowerBuilders