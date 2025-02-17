import Vector2 from './../../app/vector2';
import Texture = Phaser.Textures.Texture;

export default class PhaserPolygon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, points: Vector2[], fillColor: number = 0xffffff) {
        const graphics = scene.add.graphics();
        // 2. Draw the polygon on the Graphics object
        graphics.fillStyle(fillColor, 1); // Color and alpha
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fillPath();

        // 5. Create the Sprite using the generated texture
        super(scene, x, y, ""); // Use the texture key

        scene.physics.add.existing(this);

        this.body.setSize(graphics.x, graphics.y);
        this.body.setOffset(-graphics.x/2, -graphics.y/2)
    }
}
