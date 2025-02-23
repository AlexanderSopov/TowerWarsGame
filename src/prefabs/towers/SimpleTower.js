import * as THREE from 'three'
import Selectable from '../../components/Selectable'
import AbstractTower from './AbstractTower'
import pisa from './images/pisa.jpg'
import upgrade from './images/upgrade.jpg'
import sell from './images/sell.jpg'
import { subscribe } from '../../utilities/EventBus'
import { TILE_SIZE } from '/tile-system'

const color = 0xa4444a
const eventBusPrefix = 'sellSimpleTower_'

const radius = 2
const radiusTop = 1.25
const height = 6
export class SimpleTower extends AbstractTower {

  constructor (scene, camera, opts) {
    
    super({
      tileWidth: (radius * TILE_SIZE * 2 + TILE_SIZE) / TILE_SIZE,
      tileHeight: (radius * TILE_SIZE * 2 + TILE_SIZE) / TILE_SIZE
    }, opts)

    const { basePosition } = opts ?? {}

    this.scene = scene
    this.camera = camera

    const geometry = new THREE.CylinderGeometry( TILE_SIZE * radiusTop, TILE_SIZE * radius, TILE_SIZE * height, 16 ); 
    const material = new THREE.MeshStandardMaterial( { color } );
    this.cube = new THREE.Mesh( geometry, material );
    this.cube.position.y = TILE_SIZE * height / 2
    this.add( this.cube );

    this.components.push(new Selectable(this, this.cube, color, this.generateCommandPanelData()))

    if (basePosition) {
      this.position.x = basePosition.x
      this.position.y = basePosition.y
      this.position.z = basePosition.z
    }

    this.scene.add(this)
    subscribe(eventBusPrefix + this.id, price => this.sell(price))
  }

  generateCommandPanelData () {
    return {
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
          description: 'Upgrade tower to StrongSimpleTower.',
          cost: 400,
          costLabel: 'Buy'
        }, {
          icon: sell,
          description: 'Sell tower to regain money.',
          cost: 200,
          costLabel: 'Sell',
          action: [eventBusPrefix + this.id, 200]
        }
      ]
    }
  }
}