import PhaserCircle from '../objects/circle'
import FpsText from '../objects/fpsText'
import Cannon from '../objects/cannon'
import PhaserPolygon from '../objects/polygon'
import MapGenerator from '../../app/generator'

export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    const c1 = new PhaserCircle(this, this.cameras.main.width / 4, 0, 100)
    const c2 = new PhaserCircle(this, this.cameras.main.width / 4, 0, 100)

    const ballGroup = this.physics.add.group();
    ballGroup.add(c1);
    ballGroup.add(c2);

    const cannon = new Cannon(this, 100, 500);

    this.physics.add.collider(ballGroup.getChildren(), ballGroup.getChildren());

    const generator = new MapGenerator(1280, 720, 5, 100, 300, 10);
    const map = generator.GenerateMap();

    map.Polygons().forEach((polygon) => {
      const tmp = new PhaserPolygon(this, polygon.List()[0].x, polygon.List()[0].y, polygon.List(), 0x034150)
      ballGroup.add(tmp)
    })

    this.fpsText = new FpsText(this)

    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0)
  }

  update() {
    this.fpsText.update()
  }
}
