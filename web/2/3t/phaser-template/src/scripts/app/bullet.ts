import Vector2 from "./vector2";

export default class Bullet {
    private position: Vector2
    private velocity: Vector2

    public constructor(position: Vector2, velocity: Vector2 = {x: 1, y: 1}) {
        this.position = position
        this.velocity = velocity
    }

    public GetVelocity(): Vector2 {
        return this.velocity
    }

    public GetStartPosition(): Vector2 {
        return this.position
    }
}