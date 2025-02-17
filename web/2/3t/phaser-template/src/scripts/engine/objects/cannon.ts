import PhaserCircle from '../objects/circle'
export default class Cannon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'cannon'); // Предполагается, что текстура пушки загружена в preload
        scene.add.existing(this);

        this.setInteractive();

        this.on('pointerdown', () => {
            this.shoot(); // Стреляем при нажатии
        });
    }

    shoot() {
        const ball = new PhaserCircle(this.scene, this.x + 30, this.y - 20, 10, 0xff0000); // Создаем шарик
        ball.setVelocity(300, -300);
        this.scene.physics.add.existing(ball);
    }
}