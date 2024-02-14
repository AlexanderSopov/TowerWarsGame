import * as THREE from 'three'
import Selectable from '../../components/Selectable'
import Tower from './Tower'
import pisa from './images/pisa.jpg'
import upgrade from './images/upgrade.jpg'
import sell from './images/sell.jpg'

const SIZE = 1.5
const color = 0xa4444a

export class SimpleTower extends Tower {

  commandPanelData = {
    portrait: {
      image: pisa,
      animation: false,
      health: {
        current: 300,
        max: 300
      },
      mana: {
        current: 100,
        max: 100
      },
    },
    stats: {
      name: 'SimpleTower',
      stats: [
        {
          label: 'Armor',
          value: 0,
          valueLabel: '0'
        }, {
          label: 'Damage',
          range: [4, 6],
          valueLabel: '4 - 6'
        }, {
          label: 'Speed',
          value: 1,
          valueLabel: 'Average'
        }, {
          label: 'Range',
          value: 60,
          valueLabel: '60'
        }
      ],
    },
    options: [
      {
        icon: upgrade,
        description: 'Upgrade tower to StrongSimpleTower',
        cost: 400
      }, {
        icon: sell,
        description: 'Sell tower to regain money',
        cost: 200
      }
    ]
  }

  constructor (scene, camera, opts) {
    super()

    const { helpers, basePosition } = opts ?? {}

    this.scene = scene
    this.camera = camera
    this.character = new THREE.Object3D()

    const geometry = new THREE.CylinderGeometry( SIZE * 1, SIZE * 1.5, SIZE * 4, 16 ); 
    const material = new THREE.MeshStandardMaterial( { color } );
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.y = 1
    this.cube.castShadow = true
    this.character.add( this.cube );

    this.components.push(new Selectable(this.character, this.cube, color, this.commandPanelData))

    if (helpers) {
      this.character.add( createPlaneGeo() );
    }

    if (basePosition) {
      this.character.position.x = basePosition.x
      this.character.position.y = basePosition.y
      this.character.position.z = basePosition.z
    }

    this.scene.add(this.character)
  }



}