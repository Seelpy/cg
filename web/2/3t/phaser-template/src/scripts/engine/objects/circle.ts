export default class PhaserCircle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, radius, fillColor = 0xffffff) {
        // Создаем круг как текстуру
        const graphics = scene.add.graphics();
        graphics.fillStyle(fillColor, 1);
        graphics.fillCircle(radius, radius, radius);
        const textureKey = `circle-${radius}-${fillColor}`;
        graphics.generateTexture(textureKey, radius * 2, radius * 2);
        graphics.destroy();

        super(scene, x, y, textureKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCircle(radius)
            .setCollideWorldBounds(true)
            .setBounce(0.9)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVelocityY(-600);
                this.setVelocityX(400);
            });

        // Добавляем обработчик столкновений
        this.scene.physics.world.on('collide', this.handleCollision.bind(this));
    }

    handleCollision(bodyA, bodyB) {
        if ((bodyA.gameObject instanceof PhaserCircle) && (bodyB.gameObject instanceof PhaserCircle)) {
            bodyA.gameObject.changeColor();
            bodyB.gameObject.changeColor();
        }
    }

    changeColor() {
        const randomColor = Math.floor(Math.random() * 16777215);
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(randomColor, 1);
        graphics.fillCircle(this.width / 2, this.height / 2, this.width / 2);

        const textureKey = `circle-${this.width / 2}-${randomColor}`;
        graphics.generateTexture(textureKey, this.width, this.height);
        graphics.destroy();

        this.setTexture(textureKey);
    }

    addCollider(otherObject, context) {
        this.scene.physics.add.collider(this, otherObject, () => {this.changeColor()}, () => {this.changeColor()}, context || this.scene);
    }
}
