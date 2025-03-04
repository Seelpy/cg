import PhaserCircle from '../objects/circle'
import FpsText from '../objects/fpsText'
import Cannon from '../objects/cannon'
import PhaserPolygon from '../objects/polygon'
import MapGenerator from '../../app/generator'
import Group = Phaser.Physics.Arcade.Group;

export default class MainScene extends Phaser.Scene {
    fpsText

    constructor() {
        super({key: 'MainScene'})
    }

    create() {
        const ballGroup =  new Group(this, this);
        const generator = new MapGenerator(2280, 1220, 6, 100, 350, 10);
        const map = generator.GenerateMap();

        map.Polygons().forEach((polygon) => {
            const tmp = new PhaserPolygon(this, polygon.List()[0].x, polygon.List()[0].y, polygon.List(), 0x034150);
            ballGroup.add(tmp)
        });

        const cannon = new Cannon(this, 100, 500, (ball) => {
            ballGroup.getChildren().forEach((poly) => {
                ball.addCollider(poly)
            })
        });

        this.fpsText = new FpsText(this);

        this.add
            .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
                color: '#000000',
                fontSize: '24px'
            })
            .setOrigin(1, 0);
    }


    update() {
        this.fpsText.update();
    }
}
