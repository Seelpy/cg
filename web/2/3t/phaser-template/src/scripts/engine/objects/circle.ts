export default class PhaserCircle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, radius, fillColor = 0xffffff) {
        // Создаем круг как текстуру
        const graphics = scene.add.graphics();
        graphics.fillStyle(fillColor, 1); // Устанавливаем цвет круга
        graphics.fillCircle(radius, radius, radius); // Рисуем круг
        const textureKey = `circle-${radius}-${fillColor}`;
        graphics.generateTexture(textureKey, radius * 2, radius * 2); // Генерируем текстуру круга
        graphics.destroy(); // Удаляем временный объект Graphics

        // Передаем текстуру в суперконструктор
        super(scene, x, y, textureKey);

        // Добавляем круг в сцену и включаем физику
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCircle(radius); // Устанавливаем физическое тело как круг
        this.setCollideWorldBounds(true)
            .setBounce(0.9)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVelocityY(-600); // Прыжок вверх
                this.setVelocityX(400); // Движение вправо
            });
    }
}
