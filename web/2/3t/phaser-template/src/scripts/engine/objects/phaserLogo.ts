export default class PhaserLogo extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'phaser-logo')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
      .setBounce(0.99)
      .setInteractive()
      .on('pointerdown', () => {
        this.setVelocityY(-600)
        this.setVelocityX(400)
      })
  }

    addCollider(otherObject, callback, context) {
        this.scene.physics.add.collider(this, otherObject, callback, callback, context || this.scene);
    }
}
