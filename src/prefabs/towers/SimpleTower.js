import * as THREE from "three";
import Selectable from "../../components/Selectable";
import Tower from "./Tower";
import pisa from "./images/pisa.jpg";
import upgrade from "./images/upgrade.jpg";
import sell from "./images/sell.jpg";
import { subscribe } from "../../utilities/EventBus";

const SIZE = 1.5;
const color = 0xa4444a;
const eventBusPrefix = "sellSimpleTower_";
export class SimpleTower extends Tower {
  constructor(scene, camera, opts) {
    super();

    const { helpers, basePosition } = opts ?? {};

    this.scene = scene;
    this.camera = camera;

    const geometry = new THREE.CylinderGeometry(
      SIZE * 1,
      SIZE * 1.5,
      SIZE * 4,
      16
    );
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 1,
      roughness: 0,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.y = 1;
    this.cube.castShadow = true;
    this.add(this.cube);

    this.components.push(
      new Selectable(this, this.cube, color, this.generateCommandPanelData())
    );

    if (helpers) {
      this.add(createPlaneGeo());
    }

    if (basePosition) {
      this.position.x = basePosition.x;
      this.position.y = basePosition.y;
      this.position.z = basePosition.z;
    }

    this.scene.add(this);
    subscribe(eventBusPrefix + this.id, (price) => this.sell(price));
  }

  generateCommandPanelData() {
    return {
      portrait: {
        image: pisa,
        animation: false,
        health: {
          current: 300,
          max: 300,
        },
        mana: {
          current: 100,
          max: 100,
        },
      },
      stats: {
        name: "SimpleTower",
        stats: [
          {
            label: "Armor",
            value: 0,
            valueLabel: "0",
          },
          {
            label: "Damage",
            range: [4, 6],
            valueLabel: "4 - 6",
          },
          {
            label: "Speed",
            value: 1,
            valueLabel: "Average",
          },
          {
            label: "Range",
            value: 60,
            valueLabel: "60",
          },
        ],
      },
      options: [
        {
          icon: upgrade,
          description: "Upgrade tower to StrongSimpleTower.",
          cost: 400,
          costLabel: "Buy",
        },
        {
          icon: sell,
          description: "Sell tower to regain money.",
          cost: 200,
          costLabel: "Sell",
          action: [eventBusPrefix + this.id, 200],
        },
      ],
    };
  }
}
