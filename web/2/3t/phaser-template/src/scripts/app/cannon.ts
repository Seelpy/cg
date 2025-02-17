import Vector2 from './vector2'
import Bullet from './bullet'

export default class Cannon {
    private position: Vector2
    private ballVelocityMulti: Vector2

    public constructor(position: Vector2, ballVelocityMulti: Vector2 = {x: 1, y: 1}) {
        this.position = position
        this.ballVelocityMulti = ballVelocityMulti
    }

    public Push(trekX: number, trekY: number): Bullet {
        return new Bullet(this.position, {
            x: (this.position.x - trekX) * this.ballVelocityMulti.x,
            y: (this.position.y - trekY) * this.ballVelocityMulti.x
        })
    }

    public Position(): Vector2 {
        return this.position
    }
}