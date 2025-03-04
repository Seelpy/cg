import Vector2 from './../../app/vector2';
import Texture = Phaser.Textures.Texture;

export default class PhaserPolygon extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, points: Vector2[], fillColor: number = 0xffffff) {
        const graphics = scene.add.graphics();

        // Draw the polygon on the Graphics object
        graphics.fillStyle(fillColor, 1); // Color and alpha
        graphics.beginPath();
        graphics.moveTo(points[0].x + 300, points[0].y + 300);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fillPath();

        // Generate a texture from the Graphics object
        const texture = graphics.generateTexture('polygonTexture');

        graphics.destroy();

        // Create the Sprite using the generated texture
        super(scene, texture.x, texture.y, 'polygonTexture'); // Use the texture key
        scene.add.existing(this);

        this.setInteractive();
    }
}
